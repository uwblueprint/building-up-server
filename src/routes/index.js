const express = require("express");
const { shopifyWebhook } = require("../controllers");

const bodyParser = require("body-parser");

const router = express.Router();

router.post(
  "/shopifyWebhook",
  bodyParser.raw({ type: "application/json" }),
  shopifyWebhook
);

module.exports = router;
