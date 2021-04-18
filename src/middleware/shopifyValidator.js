const crypto = require('crypto');
const { SHOPIFY_KEY } = require('../config/config');

function verifyShopifyHeader(hmac, rawBody) {
  /* Compare the computed HMAC digest based on the shared secret
   * and the request contents
   */
  const hash = crypto.createHmac('sha256', SHOPIFY_KEY).update(rawBody, 'utf8', 'hex').digest('base64');
  return hmac === hash;
}

function shopifyValidator(req, res, buf, encoding) {
  if (buf && buf.length) {
    const rawBody = buf.toString(encoding || 'utf8');
    const hmac = req.get('X-Shopify-Hmac-Sha256');
    // set a custom request field for the shopifyValidators result
    req.is_shopify_header_verified = verifyShopifyHeader(hmac, rawBody);
  } else {
    req.is_shopify_header_verified = false;
  }
}

exports.shopifyValidator = shopifyValidator;
