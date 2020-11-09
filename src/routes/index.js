const express = require("express");
const { captureOrderWebhook, cancelOrderWebhook } = require("../controllers");

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

module.exports = router;
