class Message {
    constructor(messageId, caseId, senderId, content, attachment = null) {
      this.messageId = messageId;
      this.caseId = caseId;
      this.senderId = senderId;
      this.content = content;
      this.createdAt = new Date();
      this.attachment = attachment;
    }
  }
  
  module.exports = Message;
  