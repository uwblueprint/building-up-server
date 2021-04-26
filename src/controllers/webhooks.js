// Useful reference: https://shopify.dev/docs/admin-api/rest/reference/events/webhook
// API version: 2021-04
const models = require('../models');
const { findByOrderId } = require('./order');
const { incrementTeamSales, decrementTeamSales } = require('./team');

const TEAM_ID_KEY = 'teamId';

/**
 * We set the "teamId" we want to associate with the order using "custom attributes", which is sent in a field called note_attributes
 * `note_attributes` is an array of objects {key: string, value: string}
 *
 * @param {{key: string, value: string}[]} noteAttributes
 * @returns {string | null}
 */
function getTeamIdFromNoteAttributes(noteAttributes) {
  const filtered = noteAttributes.filter(val => typeof val === 'object' && val.name && val.name === TEAM_ID_KEY);
  const teamId = filtered[0] ? filtered[0].value : null;

  return teamId;
}

/*
  computeQuantity takes in the order event and computes the
  total number of items sold, including if there are refunds or updates
*/
function computeQuantity(event) {
  const { line_items: lineItems, refunds } = event;

  const totalQuantity = lineItems
    .filter(({ product_exists: productExists }) => productExists !== false)
    .reduce((total, item) => total + item.quantity, 0);
  const refundQuantity = refunds.reduce((total, item) => total + item.quantity, 0);

  return totalQuantity - refundQuantity;
}

/*
  computeUpdatedPrice takes in the order event and computes the
  total updated price due to adding items or refunding
*/
function computeUpdatedPrice(event) {
  let refund = 0;
  if (event.refunds !== undefined || event.refunds.length !== 0) {
    // go through each refund object
    event.refunds.forEach(refundItem => {
      refundItem.refund_line_items.forEach(refundLineItem => {
        refund += refundLineItem.subtotal;
      });
    });
  }

  return parseFloat(event.subtotal_price) - refund;
}

/*
  orderChanges.
  Takes in the incoming and existing Order objects and returns
  which fields we need to update in our DB.
*/
function orderChanges(incomingOrder, existingOrder) {
  // this function will return an object of updated values relevant to our DB table
  const { note_attributes: noteAttributes, updated_at: updatedAt, donation_amount: donationAmount } = incomingOrder;
  const { teamId } = existingOrder;

  const newTeamId = getTeamIdFromNoteAttributes(noteAttributes);
  const newPrice = computeUpdatedPrice(incomingOrder);
  const newQuantity = computeQuantity(incomingOrder);

  const changelog = {
    updatedAt,
    teamId: newTeamId !== teamId ? newTeamId : teamId,
    price: newPrice,
    numberOfItems: newQuantity,
    donationAmount: parseFloat(donationAmount),
  };

  return changelog;
}

const captureOrderWebhook = async (req, res) => {
  let event;
  let error = false;

  try {
    event = JSON.parse(req.body);
  } catch (err) {
    error = true;
    // eslint-disable-next-line no-console
    console.error(`Error: ${err.message}`);
  }

  // order_number - Shopify order number
  // subtotal_price - includes any discounts, excludes tax
  // Note: If we wanted to put the amount raised as the price of items before discounts, you would use total_line_items_price instead of subtotal_price

  const {
    id,
    order_number: orderNumber,
    note_attributes: noteAttributes,
    subtotal_price: subtotalPrice,
    created_at: createdAt,
    updated_at: updatedAt,
    total_tip_received: totalTipReceived,
  } = event;

  if (!error) {
    try {
      const teamId = getTeamIdFromNoteAttributes(noteAttributes);
      const numberOfItems = computeQuantity(event);
      const priceInTable = parseFloat(subtotalPrice);
      const donationAmount = parseFloat(totalTipReceived);
      const totalPrice = priceInTable + donationAmount;

      const item = await models.Order.create({
        id,
        orderNumber,
        teamId,
        price: priceInTable,
        donationAmount,
        numberOfItems,
        createdAt,
        updatedAt,
      });

      if (teamId) {
        incrementTeamSales(teamId, numberOfItems, totalPrice);
      }

      // return 200 ok response
      res.json({
        Message: 'Success: payment record was captured',
        Item: item,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Error: ${err.message}`);
      res.status(200).send('Error: failed to capture payment record');
    }
  } else {
    // Shopify expects a 200 response from our webhook otherwise it will retry 19
    // times over 48 hours, if still no response the webhook subscription is deleted.
    // https://shopify.dev/tutorials/manage-webhooks
    res.status(200).send('Error: failed to capture payment record');
  }
};

const cancelOrderWebhook = async (req, res) => {
  let event;

  try {
    event = JSON.parse(req.body);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Error: ${err.message}`);
  }

  try {
    const id = event.id.toString();
    const row = await findByOrderId(id);

    if (row !== null) {
      const { teamId, numberOfItems, price, donationAmount } = row;
      const rowsDeleted = await models.Order.destroy({
        where: {
          id,
        },
      });

      if (rowsDeleted === 1) {
        if (teamId) {
          decrementTeamSales(teamId, numberOfItems, parseFloat(price) + parseFloat(donationAmount));
        }

        res.json({
          Message: 'Success: payment record was deleted',
          id,
        });
      } else {
        /*
        Edge case where we had multiple rows with the same order_number.
        This should not happen as we have a unique constraint in the DB.
        */
        throw new Error(`deleted multiple records with the same order_id: ${id}`);
      }
    } else {
      throw new Error(`no payment record with id: ${id} to be deleted`);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Error: ${err.message}`);
    res.status(200).send('Error: failed to delete payment record');
  }
};

/*
updateOrderWebhook.
Only update a DB order record if there are changes to important fields like the
userId, teamId, price, numberOfItems, etc.

If an update occurs on something like shipping address, or phone number, then we
do not need to update any records in the DB.
*/
const updateOrderWebhook = async (req, res) => {
  let event;

  try {
    event = JSON.parse(req.body);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Error: ${err.message}`);
  }

  // first find the record in the DB.
  // since order_numbers are unique in our DB, there should only be 1 order found.
  try {
    const { note_attributes: noteAttributes } = event;
    const id = event.id.toString();
    const existingOrder = await findByOrderId(id);

    if (existingOrder != null) {
      const { numberOfItems, price, donationAmount } = existingOrder;
      // we can cross reference the incoming changes with existing data in our DB.
      const changelog = orderChanges(event, existingOrder);

      const rows = await models.Order.update(changelog, {
        where: {
          id,
        },
        returning: true,
      });

      if (rows[0] === 1 && rows[1] !== null) {
        if (Object.hasOwnProperty.call(changelog, 'numberOfItems')) {
          const teamId = getTeamIdFromNoteAttributes(noteAttributes);

          if (teamId) {
            incrementTeamSales(
              teamId,
              changelog.numberOfItems - parseFloat(numberOfItems),
              changelog.price + changelog.donationAmount - (parseFloat(price) + parseFloat(donationAmount)),
            );
          }
        }

        res.json({
          Message: 'Success: payment record was updated',
          id,
          number_rows: rows[0],
          item: rows[1],
        });
      }
    } else {
      throw new Error(`no payment record with id: ${id} to be updated `);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Error: ${err.message}`);
    res.status(200).send('Error: failed to update payment record');
  }
};

exports.captureOrderWebhook = captureOrderWebhook;
exports.cancelOrderWebhook = cancelOrderWebhook;
exports.updateOrderWebhook = updateOrderWebhook;
