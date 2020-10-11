const express = require("express");
const { stripeWebhook } = require("../controllers");

const bodyParser = require("body-parser");

const router = express.Router();

router.post(
  "/stripeWebhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

module.exports = router;
