const express = require('express');
const router = express.Router();
const Attachment = require('../models/Attachment');
const { cases } = require('../data/caseStore');
const { messages } = require('../data/messageStore');
const { attachments } = require('../data/attachmentStore');
const { generateThumbnail } = require('../utilities/thumbnailGenerator');

router.post('/:caseId/messages/:messageId/attachments', async (req, res) => {
  const { caseId, messageId } = req.params;
  const { fileName, fileUrl } = req.body;
  const existingCase = cases.find(c => c.caseId === Number(caseId));
  if (!existingCase) {
    return res.status(404).json({ error: 'Case not found' });
  }
  const existingMessage = messages.find(m => m.messageId === Number(messageId));
  if (!existingMessage) {
    return res.status(404).json({ error: 'Message not found' });
  }
  try {
    const newAttachment = Attachment.create({
      attachmentId: attachments.length + 1,
      messageId: messageId,
      fileName,
      fileUrl
    });
    attachments.push(newAttachment);
    existingMessage.attachments = existingMessage.attachments || [];
    existingMessage.attachments.push(newAttachment);
    try {
      const thumbnailPath = `public/thumbnails/thumb_${fileName}`;
      await generateThumbnail(fileUrl, thumbnailPath);
      newAttachment.thumbnailUrl = thumbnailPath;
    } catch (error) {
      newAttachment.thumbnailUrl = null;
    }
    return res.status(201).json(newAttachment);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
