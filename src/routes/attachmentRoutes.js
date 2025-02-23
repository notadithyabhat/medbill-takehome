const express = require('express');
const router = express.Router();

const Attachment = require('../models/Attachment');
const { cases } = require('../data/caseStore');
const { messages } = require('../data/messageStore');
const { attachments } = require('../data/attachmentStore');

router.post('/:caseId/messages/:messageId/attachments', (req, res) => {
  const { caseId, messageId } = req.params;
  const { fileName, fileUrl } = req.body;
  const existingCase = cases.find((c) => c.caseId === Number(caseId));
  if (!existingCase) {
    return res.status(404).json({ error: 'Case not found' });
  }
  const existingMessage = messages.find((m) => m.messageId === Number(messageId));
  if (!existingMessage) {
    return res.status(404).json({ error: 'Message not found' });
  }
  if (!fileName || !fileUrl) {
    return res.status(400).json({ error: 'fileName and fileUrl are required' });
  }
  const newAttachment = new Attachment(Number(messageId), fileName, fileUrl);
  newAttachment.attachmentId = attachments.length + 1;
  attachments.push(newAttachment);
  existingMessage.attachments = existingMessage.attachments || [];
  existingMessage.attachments.push(newAttachment);
  return res.status(201).json(newAttachment);
});

module.exports = router;
