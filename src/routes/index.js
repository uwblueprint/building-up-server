const express = require("express");
const {
  captureOrderWebhook,
  cancelOrderWebhook,
  updateOrderWebhook
} = require("../controllers");

const bodyParser = require("body-parser");

const router = express.Router();

router.post(
  "/captureOrderWebhook",
  bodyParser.raw({ type: "application/json" }),
  captureOrderWebhook
);

router.post(
  "/cancelOrderWebhook",
  bodyParser.raw({ type: "application/json" }),
  cancelOrderWebhook
);

router.post(
  "/updateOrderWebhook",
  bodyParser.raw({ type: "application/json" }),
  updateOrderWebhook
);

module.exports = router;
