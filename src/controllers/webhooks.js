const models = require("../models");

const shopifyWebhook = (req, res) => {
  let event;
  var error = false;

  try {
    event = JSON.parse(req.body);
  } catch (err) {
    error = true;
    console.error(`Error: ${err.message}`);
  }

  var orderNumber = event.order_number;

  var userID, teamID;

  // userID stored in first index
  if (typeof event.note_attributes[0] !== "undefined") {
    userID = event.note_attributes[0].value;
  } else {
    error = true;
    console.error("Error: undefined value in JSON payload");
  }

  // teamID stored in second index
  if (typeof event.note_attributes[1] !== "undefined") {
    teamID = event.note_attributes[1].value;
  } else {
    error = true;
    console.error("Error: undefined value in JSON payload");
  }
  //includes any discounts, excludes tax
  const price = event.subtotal_price;

  var numberOfItems = 0;
  for (i = 0; i < event.line_items.length; i++) {
    numberOfItems += event.line_items[i].quantity;
  }

  if (!error) {
    models.Orders.create({
      orderNumber: orderNumber,
      userID: userID,
      teamID: teamID,
      price: price,
      numberOfItems: numberOfItems
    })
      .then(item => {
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
    res.status(200).send(`Error: failed to capture payment record`);
  }
};

exports.shopifyWebhook = shopifyWebhook;
