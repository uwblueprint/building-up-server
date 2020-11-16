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
  // the Shopify order number from the JSON payload
  var orderNumber = event.order_number;

  // create noteAttributesMap hashmap
  var noteAttributesMap = new Map();

  // userID is index 0, teamID is index 1, teamName is index 2
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

  // includes any discounts, excludes tax
  const price = event.subtotal_price;

  // quantity of items sold
  var numberOfItems = 0;
  for (i = 0; i < event.line_items.length; i++) {
    numberOfItems += event.line_items[i].quantity;
  }

  // date of purchase from Shopify request data
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
        // succesful payment record creation, now we can add to redis
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
        This should not happen as we have a unique constraint in the DB
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

exports.captureOrderWebhook = captureOrderWebhook;
exports.cancelOrderWebhook = cancelOrderWebhook;
