class Message {
  constructor(messageId, caseId, senderId, content, attachment = null) {
    this.messageId = messageId;
    this.caseId = caseId;
    this.senderId = senderId;
    this.content = content;
    this.createdAt = new Date();
    this.attachment = attachment;
  }
  static validate({ senderId, content }, { users, cases }, caseId) {
    if (!senderId || !content) {
      throw new Error('senderId and content are required');
    }
    if (content.trim().length === 0) {
      throw new Error('Message content cannot be empty');
    }
    const existingCase = cases.find(c => c.caseId === Number(caseId) && c.status === 'open');
    if (!existingCase) {
      throw new Error('Case not found');
    }
    const senderUser = users.find(u => u.userId === Number(senderId));
    if (!senderUser) {
      throw new Error('Sender user not found');
    }
    if (senderUser.type === 'user' && existingCase.ownerId !== senderUser.userId) {
      throw new Error('A regular user can only message their own case.');
    }
    if (senderUser.type !== 'user' && senderUser.type !== 'staff' && senderUser.type !== 'AI') {
      throw new Error('Unknown or unauthorized user type');
    }
  }
  static create(data, stores) {
    const { messageId, caseId, senderId, content, attachment } = data;
    Message.validate({ senderId, content }, stores, caseId);
    return new Message(messageId, Number(caseId), Number(senderId), content.trim(), attachment || null);
  }
}
module.exports = Message;
