const express = require("express");
const {
  capturePaymentWebhook,
  deletePaymentWebhook
} = require("../controllers");

const bodyParser = require("body-parser");

const router = express.Router();

router.post(
  "/capturePaymentWebhook",
  bodyParser.raw({ type: "application/json" }),
  capturePaymentWebhook
);

router.post(
  "/deletePaymentWebhook",
  bodyParser.raw({ type: "application/json" }),
  deletePaymentWebhook
);

module.exports = router;
