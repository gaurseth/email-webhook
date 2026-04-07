require('dotenv').config();
const express = require('express');
const config = require('./config');
const webhookRouter = require('./routes/webhook');

const app = express();

// Parse URL-encoded and JSON bodies (fallback for non-multipart requests)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'email-webhook' });
});

// Webhook routes
app.use(webhookRouter);

app.listen(config.port, () => {
  console.log(`email-webhook listening on port ${config.port}`);
});
