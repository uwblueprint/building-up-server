const models = require('../models');
const { findByOrderNumber } = require('./order');
const { incrementTeamScore, decrementTeamScore } = require('./team');

const noteAttributesEnum = {
  userId: 0,
  teamId: 1,
};

/*
  computeQuantity takes in the order event and computes the
  total number of items sold, including if there are refunds or updates
*/
function computeQuantity(event) {
  const { lineItems, refunds } = event;

  let totalQuantity = 0;
  let refundQuantity = 0;

  lineItems.forEach(item => {
    totalQuantity += item.quantity;
  });

  if (refunds !== undefined || refunds.length !== 0) {
    // go through each refund object
    refunds.forEach(item => {
      refundQuantity += item.quantity;
    });
  }

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
  const changelog = {};
  const { note_attributes } = incomingOrder;
  const { userId, teamId, price, numberOfItems } = existingOrder;

  if (note_attributes[noteAttributesEnum.userId].value !== userId) {
    changelog.userId = note_attributes[noteAttributesEnum.userId].value;
  }

  if (note_attributes[noteAttributesEnum.teamId].value !== teamId) {
    changelog.teamId = note_attributes[noteAttributesEnum.teamId].value;
  }

  const newPrice = computeUpdatedPrice(incomingOrder);
  if (newPrice !== price) {
    changelog.price = newPrice;
  }

  const newQuantity = computeQuantity(incomingOrder);
  if (newQuantity !== numberOfItems) {
    changelog.numberOfItems = newQuantity;
  }

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
  // date of purchase from Shopify request data.

  const { order_number, note_attributes, subtotal_price, created_at } = event;

  // create noteAttributesMap hashmap.
  const noteAttributesMap = new Map();

  // userId is index 0, teamId is index 1
  for (let i = 0; i < 3; i += 1) {
    if (typeof note_attributes[i] !== 'undefined') {
      noteAttributesMap.set(i, note_attributes[i].value);
    } else {
      error = true;
      // eslint-disable-next-line no-console
      console.error(`Error: undefined index ${i} in JSON payload, note_attributes field`);
    }
  }

  // quantity of items sold.
  const numberOfItems = computeQuantity(event);

  if (!error) {
    try {
      const item = await models.Order.create({
        orderNumber: order_number,
        userId: noteAttributesMap.get(noteAttributesEnum.userId),
        teamId: noteAttributesMap.get(noteAttributesEnum.teamId),
        price: subtotal_price,
        numberOfItems,
        purchaseDate: created_at,
      });

      incrementTeamScore(parseInt(noteAttributesMap.get(noteAttributesEnum.teamId), 10), numberOfItems);

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
    const { order_number } = event;
    const row = await findByOrderNumber(order_number);
    const { teamId, numberOfItems } = row;

    if (row !== null) {
      const rowsDeleted = await models.Order.destroy({
        where: {
          orderNumber: order_number,
        },
      });

      if (rowsDeleted === 1) {
        decrementTeamScore(parseInt(teamId, 10), numberOfItems);

        res.json({
          Message: 'Success: payment record was deleted',
          order_number,
        });
      } else {
        /*
        Edge case where we had multiple rows with the same order_number.
        This should not happen as we have a unique constraint in the DB.
        */
        throw new Error(`deleted multiple records with the same order_number: ${order_number}`);
      }
    } else {
      throw new Error(`no payment record with order_number: ${order_number} to be deleted`);
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
    const { order_number, note_attributes } = event;
    const existingOrder = await findByOrderNumber(order_number);
    const { numberOfItems } = existingOrder;

    if (existingOrder != null) {
      // we can cross reference the incoming changes with existing data in our DB.
      const changelog = orderChanges(event, existingOrder);

      // if changelog object is not empty, we can update the DB record
      if (Object.keys(changelog).length !== 0) {
        const rows = await models.Order.update(changelog, {
          where: {
            orderNumber: order_number,
          },
          returning: true,
        });

        if (rows[0] === 1 && rows[1] !== null) {
          if (Object.hasOwnProperty.call(changelog, 'numberOfItems')) {
            incrementTeamScore(
              parseInt(note_attributes[noteAttributesEnum.teamId].value, 10),
              changelog.numberOfItems - numberOfItems,
            );
          }

          res.json({
            Message: 'Success: payment record was updated',
            order_number,
            number_rows: rows[0],
            item: rows[1],
          });
        }
      }
      // check if changelog object is empty
      else if (Object.keys(changelog).length === 0 && changelog.constructor === Object) {
        res.json({
          Message: 'Success: no DB changes need to be made to order record',
          order_number,
        });
      } else {
        throw new Error('no changelog object initiated');
      }
    } else {
      throw new Error(`no payment record with orderNumber: ${order_number} to be updated `);
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
