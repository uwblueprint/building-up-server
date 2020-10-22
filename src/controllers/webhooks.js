const shopifyWebhook = (req, res) => {
  let event;
  try {
    event = JSON.parse(req.body);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case "payment_method.payment_failed":
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a res to acknowledge receipt of the event
  res.json({ received: true });
};

exports.shopifyWebhook = shopifyWebhook;
