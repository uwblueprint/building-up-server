const express = require('express');
const bodyParser = require('body-parser');
const { captureOrderWebhook, cancelOrderWebhook, updateOrderWebhook } = require('../controllers');

const { shopifyValidator } = require('../middleware/shopifyValidator');

const router = express.Router();

/*
bodyParser middleware for verifying the request type and setting the result of the
shopifyValidator in the header.
*/
router.use(
  bodyParser.raw({
    type: 'application/json',
    verify: shopifyValidator,
  }),
);

/*
middleware for verifying the result of the shopifyValidator set in the
request header.
*/
router.use((req, res, next) => {
  if (req.is_shopify_header_verified === true) {
    next();
  } else {
    res.sendStatus(403);
  }
});

router.get('/', (req, res) => {
  res.send('hello world');
});

router.post('/captureOrderWebhook', captureOrderWebhook);

router.post('/cancelOrderWebhook', cancelOrderWebhook);

router.post('/updateOrderWebhook', updateOrderWebhook);

module.exports = router;
