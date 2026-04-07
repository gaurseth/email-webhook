const { Storage } = require('@google-cloud/storage');
const config = require('../config');

const storage = new Storage({ projectId: config.gcpProjectId });

async function uploadEmail(messageId, fields, files) {
  const bucket = storage.bucket(config.gcsBucket);
  const prefix = `emails/${messageId}`;
  const uploads = [];

  // Upload full payload as JSON
  const payloadBlob = bucket.file(`${prefix}/payload.json`);
  uploads.push(
    payloadBlob.save(JSON.stringify(fields, null, 2), {
      contentType: 'application/json',
    })
  );

  // Upload HTML body if present
  if (fields['body-html']) {
    const htmlBlob = bucket.file(`${prefix}/body.html`);
    uploads.push(
      htmlBlob.save(fields['body-html'], {
        contentType: 'text/html',
      })
    );
  }

  // Upload attachments
  const attachmentMeta = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const destPath = `${prefix}/attachments/${file.originalname}`;
      const blob = bucket.file(destPath);
      uploads.push(
        blob.save(file.buffer, {
          contentType: file.mimetype,
        })
      );
      attachmentMeta.push({
        filename: file.originalname,
        contentType: file.mimetype,
        size: file.size,
        gcsUri: `gs://${config.gcsBucket}/${destPath}`,
      });
    }
  }

  await Promise.all(uploads);

  return {
    storagePath: `gs://${config.gcsBucket}/${prefix}`,
    attachments: attachmentMeta,
  };
}

module.exports = { uploadEmail };
