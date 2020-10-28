const models = require("../models");

const shopifyWebhook = (req, res) => {
  let event;

  try {
    event = JSON.parse(req.body);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
  }

  var userID, teamID;

  // userID stored in first index
  if (typeof event.note_attributes[0] !== "undefined") {
    userID = event.note_attributes[0].value;
  } else {
    // we still want to track the order for completeness even if the userID was NULL
    userID = null
    console.error("Error: undefined value in JSON payload");
  }

  // teamID stored in second index
  if (typeof event.note_attributes[1] !== "undefined") {
    teamID = event.note_attributes[1].value;
  } else {
    // we still want to track the order for completeness even if the teamID was NULL
    teamID = null
    console.error("Error: undefined value in JSON payload");
  }
  //includes any discounts, excludes tax
  const price = event.subtotal_price;

  let numberOfItems = 0;
  for (i = 0; i < event.line_items.length; i++) {
    numberOfItems += event.line_items[i].quantity;
  }

  models.Orders.create({
    userID: userID,
    teamID: teamID,
    price: price,
    numberOfItems: numberOfItems
  })
    .then(item => {
      res.json({
        Message: "Success: created shopify order-payment record",
        Item: item
      });
    })
    .catch(err => {
      console.log("Error: failed to create shopify order-payment record");
      console.error(err);
    });
};

exports.shopifyWebhook = shopifyWebhook;
