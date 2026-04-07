const { Firestore } = require('@google-cloud/firestore');
const config = require('../config');

const db = new Firestore({ projectId: config.gcpProjectId });
const emailsCollection = db.collection('emails');

async function saveEmailMetadata({ messageId, fields, storagePath, attachments }) {
  const doc = {
    messageId,
    from: fields.sender || fields.from || '',
    to: fields.recipient || fields.to || '',
    subject: fields.subject || '',
    bodyPlainSnippet: (fields['body-plain'] || '').substring(0, 500),
    date: fields.Date ? new Date(fields.Date) : null,
    receivedAt: Firestore.Timestamp.now(),
    storagePath,
    attachments,
  };

  await emailsCollection.doc(messageId).set(doc);
  return doc;
}

module.exports = { saveEmailMetadata };
