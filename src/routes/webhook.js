const { Router } = require('express');
const multer = require('multer');
const verifyMailgun = require('../middleware/verifyMailgun');
const { uploadEmail } = require('../services/storage');
const { saveEmailMetadata } = require('../services/firestore');

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/webhook/email', upload.any(), verifyMailgun, async (req, res) => {
  try {
    const fields = req.body || {};
    const files = req.files || [];

    // Derive a stable ID from Mailgun's Message-Id or fall back to timestamp
    const messageId = (fields['Message-Id'] || `${Date.now()}-${Math.random().toString(36).slice(2)}`)
      .replace(/[<>]/g, '');

    console.log(`Processing email ${messageId} from ${fields.sender} — ${files.length} attachment(s)`);

    // Upload raw payload + attachments to Cloud Storage
    const { storagePath, attachments } = await uploadEmail(messageId, fields, files);

    // Save metadata to Firestore
    await saveEmailMetadata({ messageId, fields, storagePath, attachments });

    console.log(`Stored email ${messageId} → ${storagePath}`);
    res.status(200).json({ status: 'ok', messageId });
  } catch (err) {
    console.error('Webhook processing error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
