class Attachment {
    constructor(messageId, fileName, fileUrl, thumbnailUrl=null) {
      this.messageId = messageId;
      this.fileName = fileName;
      this.fileUrl = fileUrl;
      this.thumbnailUrl = thumbnailUrl;
    }
  }
  
  module.exports = Attachment;
  