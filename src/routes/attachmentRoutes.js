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
  
    // Create new attachment record
    const newAttachment = {
      attachmentId: attachments.length + 1,
      messageId: Number(messageId),
      fileName,
      fileUrl,
    };
  
    attachments.push(newAttachment);
  
    existingMessage.attachments = existingMessage.attachments || [];
    existingMessage.attachments.push(newAttachment);
  
    return res.status(201).json(newAttachment);
  });
  