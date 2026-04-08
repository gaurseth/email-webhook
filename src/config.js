const config = {
  port: process.env.PORT || 8080,
  gcsBucket: process.env.GCS_BUCKET,
  mailgunSigningKey: process.env.MAILGUN_SIGNING_KEY,
  gcpProjectId: process.env.GCP_PROJECT_ID || undefined,
  pubsubTopic: process.env.PUBSUB_TOPIC || 'email-received',
};

module.exports = config;
