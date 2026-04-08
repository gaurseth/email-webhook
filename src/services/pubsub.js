const { PubSub } = require('@google-cloud/pubsub');
const config = require('../config');

const pubsub = new PubSub({ projectId: config.gcpProjectId });

async function publishEmailEvent({ messageId, from, to, subject, storagePath, attachmentCount }) {
  const topic = pubsub.topic(config.pubsubTopic);

  const message = {
    messageId,
    from,
    to,
    subject,
    storagePath,
    attachmentCount,
    receivedAt: new Date().toISOString(),
  };

  const msgId = await topic.publishMessage({ json: message });
  console.log(`Published Pub/Sub message ${msgId} for email ${messageId}`);
  return msgId;
}

module.exports = { publishEmailEvent };
