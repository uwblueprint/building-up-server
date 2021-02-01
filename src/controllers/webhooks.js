const models = require('../models');
const { incrementTeamScore, decrementTeamScore } = require('../redis/leaderboard');

const noteAttributesEnum = {
  userID: 0,
  teamID: 1,
  teamName: 2,
};

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
  // the Shopify order number from the JSON payload.
  const orderNumber = event.order_number;

  // create noteAttributesMap hashmap.
  const noteAttributesMap = new Map();

  // userID is index 0, teamID is index 1, teamName is index 2.
  for (let i = 0; i < 3; i++) {
    if (typeof event.note_attributes[i] !== 'undefined') {
      noteAttributesMap.set(i, event.note_attributes[i].value);
    } else {
      error = true;
      // eslint-disable-next-line no-console
      console.error(`Error: undefined index ${i} in JSON payload, note_attributes field`);
    }
  }

  // includes any discounts, excludes tax.
  const price = event.subtotal_price;

  // quantity of items sold.
  const numberOfItems = computeQuantity(event);

  // date of purchase from Shopify request data.
  const purchaseDate = event.created_at;

  if (!error) {
    try {
      item = await models.Orders.create({
        orderNumber,
        userID: noteAttributesMap.get(noteAttributesEnum.userID),
        teamID: noteAttributesMap.get(noteAttributesEnum.teamID),
        teamName: noteAttributesMap.get(noteAttributesEnum.teamName),
        price,
        numberOfItems,
        purchaseDate,
      });

      // succesful payment record creation, now we can add to redis.
      incrementCacheScore(
        parseInt(noteAttributesMap.get(noteAttributesEnum.teamID)),
        noteAttributesMap.get(noteAttributesEnum.teamName),
        numberOfItems,
      );

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
    row = await findById(event.order_number);
    if (row != null) {
      rowsDeleted = await models.Orders.destroy({
        where: {
          orderNumber: event.order_number,
        },
      });

      if (rowsDeleted == 1) {
        // succesful payment record deleted, now we can update redis.
        decrementCacheScore(parseInt(row.teamID), row.teamName, row.numberOfItems);

        res.json({
          Message: 'Success: payment record was deleted',
          order_number: event.order_number,
        });
      } else {
        /*
        Edge case where we had multiple rows with the same order_number.
        This should not happen as we have a unique constraint in the DB.
        */
        throw new Error(`deleted multiple records with the same order_number: ${event.order_number}`);
      }
    } else {
      throw new Error(`no payment record with order_number: ${event.order_number} to be deleted`);
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
userID, teamID, teamName, price, numberOfItems, etc.

Also, the webhook will have issues trying to update the redis cache if the teamID
or teamName is changed. We will need a better method of syncing our DB with redis
in the future.

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
    existingOrder = await findById(event.order_number);

    if (existingOrder != null) {
      // we can cross reference the incoming changes with existing data in our DB.
      changelog = orderChanges(event, existingOrder);

      // if changelog object is not empty, we can update the DB record
      if (Object.keys(changelog).length !== 0) {
        rows = await models.Orders.update(changelog, {
          where: {
            orderNumber: event.order_number,
          },
          returning: true,
        });

        if (rows[0] == 1 && rows[1] != null) {
          // update redis cache if quantity changed
          if (changelog.hasOwnProperty('numberOfItems')) {
            // update cache score in redis
            incrementCacheScore(
              parseInt(event.note_attributes[noteAttributesEnum.teamID].value),
              event.note_attributes[noteAttributesEnum.teamName].value,
              changelog.numberOfItems - existingOrder.numberOfItems,
            );
          }

          res.json({
            Message: 'Success: payment record was updated',
            order_number: event.order_number,
            number_rows: rows[0],
            item: rows[1],
          });
        }
      }
      // check if changelog object is empty
      else if (Object.keys(changelog).length === 0 && changelog.constructor === Object) {
        res.json({
          Message: 'Success: no DB changes need to be made to order record',
          order_number: event.order_number,
        });
      } else {
        throw new Error('no changelog object initiated');
      }
    } else {
      throw new Error(`no payment record with orderNumber: ${event.order_number} to be updated `);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Error: ${err.message}`);
    res.status(200).send('Error: failed to update payment record');
  }
};

/*
  orderChanges.
  Takes in the incoming and existing Order objects and returns
  which fields we need to update in our DB.
*/
function orderChanges(incomingOrder, existingOrder) {
  // this function will return an object of updated values relevant to our DB table
  changelog = new Object();

  if (incomingOrder.note_attributes[noteAttributesEnum.userID].value != existingOrder.userID) {
    changelog.userID = incomingOrder.note_attributes[noteAttributesEnum.userID].value;
  }

  if (incomingOrder.note_attributes[noteAttributesEnum.teamID].value != existingOrder.teamID) {
    changelog.teamID = incomingOrder.note_attributes[noteAttributesEnum.teamID].value;
  }

  if (incomingOrder.note_attributes[noteAttributesEnum.teamName].value != existingOrder.teamName) {
    changelog.teamName = incomingOrder.note_attributes[noteAttributesEnum.teamName].value;
  }

  newPrice = computeUpdatedPrice(incomingOrder);
  if (newPrice != existingOrder.price) {
    changelog.price = newPrice;
  }

  newQuantity = computeQuantity(incomingOrder);
  if (newQuantity != existingOrder.numberOfItems) {
    changelog.numberOfItems = newQuantity;
  }

  return changelog;
}

/*
  computeQuantity takes in the order event and computes the
  total number of items sold, including if there are refunds or updates
*/
function computeQuantity(event) {
  totalQuantity = 0;
  refundQuantity = 0;

  event.line_items.forEach(line_item => {
    totalQuantity += line_item.quantity;
  });
  if (event.refunds !== undefined || event.refunds.length != 0) {
    // go through each refund object
    event.refunds.forEach(refund_item => {
      refund_item.refund_line_items.forEach(refund_line_item => {
        refundQuantity += refund_line_item.quantity;
      });
    });
  }

  return totalQuantity - refundQuantity;
}

/*
  computeUpdatedPrice takes in the order event and computes the
  total updated price due to adding items or refunding
*/
function computeUpdatedPrice(event) {
  refund = 0;
  if (event.refunds !== undefined || event.refunds.length != 0) {
    // go through each refund object
    event.refunds.forEach(refund_item => {
      refund_item.refund_line_items.forEach(refund_line_item => {
        refund += refund_line_item.subtotal;
      });
    });
  }

  return parseFloat(event.subtotal_price) - refund;
}

function findById(orderNumber) {
  return models.Orders.findOne({
    where: {
      orderNumber,
    },
  });
}

function incrementCacheScore(teamID, teamName, quantity) {
  incrementTeamScore(teamID, teamName, quantity);
}

function decrementCacheScore(teamID, teamName, quantity) {
  decrementTeamScore(teamID, teamName, -Math.abs(quantity));
}

exports.captureOrderWebhook = captureOrderWebhook;
exports.cancelOrderWebhook = cancelOrderWebhook;
exports.updateOrderWebhook = updateOrderWebhook;
