const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { users } = require('../data/userStore');
const { cases } = require('../data/caseStore');
const { messages } = require('../data/messageStore');
const { attachments } = require('../data/attachmentStore');
const { generateThumbnail } = require('../utilities/thumbnailGenerator');

router.post('/:caseId/messages', (req, res) => {
  const { caseId } = req.params;
  const { senderId, content, attachment } = req.body;
  try {
    const newMessage = Message.create({
      messageId: messages.length + 1,
      caseId,
      senderId,
      content,
      attachment: attachment || null
    }, { users, cases });
    messages.push(newMessage);
    if (attachment) {
      const newAttachment = {
        attachmentId: attachments.length + 1,
        messageId: newMessage.messageId,
        fileName: attachment.fileName,
        fileUrl: attachment.fileUrl
      };
      attachments.push(newAttachment);
      try {
        const thumbnailPath = `public/thumbnails/thumb_${attachment.fileName}`;
        generateThumbnail(attachment.fileUrl, thumbnailPath);
        newAttachment.thumbnailUrl = thumbnailPath;
      } catch (error) {
        newAttachment.thumbnailUrl = null;
      }
    }
    return res.status(201).json(newMessage);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/:caseId/messages', (req, res) => {
  const { caseId } = req.params;
  const existingCase = cases.find(c => c.caseId === Number(caseId) && c.status === 'open');
  if (!existingCase) {
    return res.status(404).json({ error: 'Case not found' });
  }
  const filteredMessages = messages.filter(m => m.caseId === Number(caseId));
  return res.json(filteredMessages);
});

router.get('/:caseId/messages/:messageId/attachments', (req, res) => {
  const { caseId, messageId } = req.params;
  const existingCase = cases.find(c => c.caseId === Number(caseId) && c.status === 'open');
  if (!existingCase) {
    return res.status(404).json({ error: 'Case not found' });
  }
  const existingMessage = messages.find(m => m.messageId === Number(messageId));
  if (!existingMessage) {
    return res.status(404).json({ error: 'Message not found' });
  }
  const filteredAttachments = attachments.filter(att => att.messageId === Number(messageId));
  return res.json(filteredAttachments);
});

router.post('/:caseId/messages/:messageId/edit', (req, res) => {
  const { caseId, messageId } = req.params;
  const { content, senderId } = req.body;
  const existingCase = cases.find(c => c.caseId === Number(caseId) && c.status === 'open');
  if (!existingCase) {
    return res.status(404).json({ error: 'Case not found' });
  }
  const existingMessage = messages.find(m => m.messageId === Number(messageId));
  if (!existingMessage) {
    return res.status(404).json({ error: 'Message not found' });
  }
  if (Number(senderId) !== existingMessage.senderId) {
    return res.status(403).json({ error: 'Only the original sender can edit the message' });
  }
  if (content.trim().length === 0) {
    return res.status(400).json({ error: 'Message content cannot be empty' });
  }
  existingMessage.content = content.trim();
  return res.json(existingMessage);
});

module.exports = router;
