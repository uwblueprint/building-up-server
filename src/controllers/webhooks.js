const models = require("../models");
const { incrementTeamScore } = require("../redis/leaderboard");

const noteAttributesEnum = {
  userID: 0,
  teamID: 1,
  teamName: 2
};

const captureOrderWebhook = (req, res) => {
  let event;
  var error = false;

  try {
    event = JSON.parse(req.body);
  } catch (err) {
    error = true;
    console.error(`Error: ${err.message}`);
  }
  // the Shopify order number from the JSON payload.
  var orderNumber = event.order_number;

  // create noteAttributesMap hashmap.
  var noteAttributesMap = new Map();

  // userID is index 0, teamID is index 1, teamName is index 2.
  for (var i = 0; i < 3; i++) {
    if (typeof event.note_attributes[i] !== "undefined") {
      noteAttributesMap.set(i, event.note_attributes[i].value);
    } else {
      error = true;
      console.error(
        `Error: undefined index ${i} in JSON payload, note_attributes field`
      );
    }
  }

  // includes any discounts, excludes tax.
  const price = event.subtotal_price;

  // quantity of items sold.
  var numberOfItems = computeQuantity(event);

  // date of purchase from Shopify request data.
  var purchaseDate = event.created_at;

  if (!error) {
    models.Orders.create({
      orderNumber: orderNumber,
      userID: noteAttributesMap.get(noteAttributesEnum.userID),
      teamID: noteAttributesMap.get(noteAttributesEnum.teamID),
      teamName: noteAttributesMap.get(noteAttributesEnum.teamName),
      price: price,
      numberOfItems: numberOfItems,
      purchaseDate: purchaseDate
    })
      .then(item => {
        // succesful payment record creation, now we can add to redis.
        incrementTeamScore(
          noteAttributesMap.get(noteAttributesEnum.teamID),
          noteAttributesMap.get(noteAttributesEnum.teamName),
          numberOfItems
        );
        res.json({
          Message: "Success: payment record was captured",
          Item: item
        });
      })
      .catch(err => {
        console.error(`Error: ${err.message}`);
        res.status(200).send("Error: failed to capture payment record");
      });
  } else {
    // Shopify expects a 200 response from our webhook otherwise it will retry 19
    // times over 48 hours, if still no response the webhook subscription is deleted.
    // https://shopify.dev/tutorials/manage-webhooks
    res.status(200).send("Error: failed to capture payment record");
  }
};

const cancelOrderWebhook = (req, res) => {
  var event;

  try {
    event = JSON.parse(req.body);
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }

  models.Orders.destroy({
    where: {
      orderNumber: event.order_number
    }
  })
    .then(rowsDestroyed => {
      if (rowsDestroyed == 1) {
        res.json({
          Message: "Success: payment record was deleted",
          order_number: event.order_number
        });
      } else if (rowsDestroyed == 0) {
        console.error(
          `Error: could not find record with order_number: ${event.order_number}`
        );
        res.json({
          Message: "Error: no payment record found with order number",
          order_number: event.order_number
        });
      } else {
        /*
        Edge case where we had multiple rows with the same order_number.
        This should not happen as we have a unique constraint in the DB.
        */
        console.error(
          "Error: deleted multiple records with the same order_number"
        );
        res.status(200).send("Error: failed to delete payment record");
      }
    })
    .catch(err => {
      console.error(`Error: ${err.message}`);
      res.status(200).send("Error: failed to delete payment record");
    });
};

/*
updateOrderWebhook.
Only update a DB order record if there are changes to important fields like the
userID, teamID, teamName, price, numberOfItems, etc.

If an update occurs on something like shipping address, or phone number, then we
do not need to update any records in the DB.
*/
const updateOrderWebhook = (req, res) => {
  var event;

  try {
    event = JSON.parse(req.body);
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }

  // first find the record in the DB.
  // since order_numbers are unique in our DB, there should only be 1 order found.
  models.Orders.findOne({
    where: {
      orderNumber: event.order_number
    }
  })
    .then(existingOrder => {
      if (existingOrder != null) {
        // we can cross reference the incoming changes with existing data in our DB.
        changelog = orderChanges(event, existingOrder);
        console.log("changelog is: ");
        console.log(changelog);
        if (changelog != null) {
          models.Orders.update(changelog, {
            where: {
              orderNumber: event.order_number
            }
          }).then(rows => {
            console.log(rows);
            if (rows[0] == 1 && rows[1] != null) {
              res.json({
                Message: "Success: payment record was updated",
                order_number: event.order_number,
                number_rows: rows[0],
                item: rows[1]
              });
            }
          });
        }
        if (changelog == null) {
          console.log("changelog is null");
          res.json({
            Message: "Success: no DB changes need to be made to order record",
            order_number: event.order_number
          });
        }
      } else {
        res.json({
          Message: "Error: no payment record was found to be updated",
          order_number: event.order_number
        });
      }
    })
    .catch(err => {
      console.error(`Error: ${err.message}`);
      res.status(200).send("Error: failed to update payment record");
    });
};

/*
  orderChanges.
  Takes in the incoming and existing Order objects and returns
  which fields we need to update in our DB.
*/
function orderChanges(incomingOrder, existingOrder) {
  // this function will return an object of updated values relevant to our DB table
  // check userID, teamID, teamName, price, numberOfItems, purchaseDate
  changelog = {};

  console.log("inside orderChanges");
  // console.log(existingOrder);
  console.log(existingOrder.purchaseDate);

  console.log("incoming Orders data");
  console.log(incomingOrder);
  console.log(incomingOrder.note_attributes[noteAttributesEnum.userID].value);

  if (
    incomingOrder.note_attributes[noteAttributesEnum.userID].value !=
    existingOrder.userID
  ) {
    changelog.userID = incomingOrder.userID;
  }
  if (
    incomingOrder.note_attributes[noteAttributesEnum.teamID].value !=
    existingOrder.teamID
  ) {
    changelog.teamID = incomingOrder.teamID;
  }
  if (
    incomingOrder.note_attributes[noteAttributesEnum.teamName].value !=
    existingOrder.teamName
  ) {
    changelog.teamName = incomingOrder.teamName;
  }
  if (incomingOrder.subtotal_price != existingOrder.price) {
    changelog.price = incomingOrder.subtotal_price;
  }

  if (computeQuantity(incomingOrder) != existingOrder.numberOfItems) {
    changelog.numberOfItems = incomingOrder.numberOfItems;
  }
  if (incomingOrder.created_at != existingOrder.purchaseDate) {
    changelog.purchaseDate = incomingOrder.created_at;
  }

  return changelog;
}

/*
  computeQuantity takes in the order event and computes the
  total number of items sold
*/
function computeQuantity(event) {
  numberOfItems = 0;
  for (i = 0; i < event.line_items.length; i++) {
    numberOfItems += event.line_items[i].quantity;
  }
  return numberOfItems;
}

exports.captureOrderWebhook = captureOrderWebhook;
exports.cancelOrderWebhook = cancelOrderWebhook;
exports.updateOrderWebhook = updateOrderWebhook;
