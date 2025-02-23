const express = require('express');
const router = express.Router();

const { users } = require('../data/userStore'); 
const { cases } = require('../data/caseStore');    
const { messages } = require('../data/messageStore'); 
const { attachments } = require('../data/attachmentStore');


router.post('/:caseId/messages', (req, res) => {
  const { caseId } = req.params;
  const { senderId, content, attachment } = req.body;

  if (!senderId || !content) {
    return res.status(400).json({ error: 'senderId and content are required' });
  }
  if (content.trim().length === 0) {
    return res.status(400).json({ error: 'Message content cannot be empty' });
  }

  // Checking if the case exists
  const existingCase = cases.find((c) => c.caseId === Number(caseId));
  if (!existingCase) {
    return res.status(404).json({ error: 'Case not found' });
  }

  // Checking if the sender is a valid user
  const senderUser = users.find((u) => u.userId === Number(senderId));
  if (!senderUser) {
    return res.status(404).json({ error: 'Sender user not found' });
  }

  if (senderUser.type === 'user') {
    if (existingCase.ownerId !== senderUser.userId) {
      return res.status(403).json({ error: 'A regular user can only message their own case.' });
    }
  } else if (senderUser.type !== 'staff' && senderUser.type !== 'AI') {
    return res.status(403).json({ error: 'Unknown or unauthorized user type' });
  }


  const newMessage = {
    messageId: messages.length + 1,
    caseId: Number(caseId),
    senderId: senderUser.userId,
    content: content.trim(),
    createdAt: new Date(),
    attachment: attachment || null
  };

  messages.push(newMessage);

  if (attachment) {
    const newAttachment = {
      attachmentId: attachments.length + 1,
      messageId: newMessage.messageId,
      fileName: attachment.fileName,
      fileUrl: attachment.fileUrl
    };
    attachments.push(newAttachment);
    }

  return res.status(201).json(newMessage);
});


router.get('/:caseId/messages', (req, res) => {
    const { caseId } = req.params;
  
    const existingCase = cases.find((c) => c.caseId === Number(caseId));
    if (!existingCase) {
      return res.status(404).json({ error: 'Case not found' });
    }
  
    const filteredMessages = messages.filter((m) => m.caseId === Number(caseId));
    return res.json(filteredMessages);
  });


  router.get('/:caseId/messages/:messageId/attachments', (req, res) => {
    const { caseId, messageId } = req.params;
    const existingCase = cases.find((c) => c.caseId === Number(caseId));
    if (!existingCase) {
      return res.status(404).json({ error: 'Case not found' });
    }
    const existingMessage = messages.find((m) => m.messageId === Number(messageId));
    if (!existingMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }
    const filteredAttachments = attachments.filter(
      (att) => att.messageId === Number(messageId)
    );
    return res.json(filteredAttachments);
  });

module.exports = router;
