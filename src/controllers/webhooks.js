const models = require("../models");
const {
  incrementTeamScore,
  getGlobalLeaderboard
} = require("../redis/leaderboard");

const noteAttributesEnum = {
  userID: 0,
  teamID: 1,
  teamName: 2
};

const shopifyWebhook = (req, res) => {
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

  // userID is index 0, teamID is 1, teamName is 2
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
        // succesful model creation, now we can add to redis
        incrementTeamScore(
          noteAttributesEnum.teamID,
          noteAttributesEnum.teamName,
          numberOfItems
        );
        res.json({
          Message: "Success: payment record was captured",
          Item: item
        });
      })
      .catch(err => {
        console.log("Error: failed to create shopify order-payment record");
        console.error(err);
      });
  } else {
    // Shopify expects a 200 response from our webhook otherwise it will retry 19
    // times over 48 hours, if still no response the webhook subscription is deleted.
    // https://shopify.dev/tutorials/manage-webhooks
    res.status(200).send(`Error: failed to capture payment record`);
  }
};

exports.shopifyWebhook = shopifyWebhook;
