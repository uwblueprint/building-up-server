const crypto = require('crypto');

function verifyShopifyHeader(hmac, rawBody) {
  // Retrieving the key
  const secretKey = process.env.SHOPIFY_KEY;
  /* Compare the computed HMAC digest based on the shared secret
   * and the request contents
   */
  const hash = crypto.createHmac('sha256', secretKey).update(rawBody, 'utf8', 'hex').digest('base64');
  return hmac === hash;
}

function shopifyValidator(req, res, buf, encoding) {
  if (buf && buf.length) {
    const rawBody = buf.toString(encoding || 'utf8');
    const hmac = req.get('X-Shopify-Hmac-SHA256');
    // set a custom request field for the shopifyValidators result
    req.is_shopify_header_verified = verifyShopifyHeader(hmac, rawBody);
  } else {
    req.is_shopify_header_verified = false;
  }
}

exports.shopifyValidator = shopifyValidator;
