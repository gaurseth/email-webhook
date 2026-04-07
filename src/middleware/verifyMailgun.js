const crypto = require('crypto');
const config = require('../config');

function verifyMailgun(req, res, next) {
  if (!config.mailgunSigningKey) {
    console.warn('MAILGUN_SIGNING_KEY not set — skipping signature verification');
    return next();
  }

  const body = req.body || {};
  const timestamp = body.timestamp;
  const token = body.token;
  const signature = body.signature;

  if (!timestamp || !token || !signature) {
    return res.status(401).json({ error: 'Missing signature fields' });
  }

  const hmac = crypto
    .createHmac('sha256', config.mailgunSigningKey)
    .update(timestamp + token)
    .digest('hex');

  if (hmac !== signature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  next();
}

module.exports = verifyMailgun;
