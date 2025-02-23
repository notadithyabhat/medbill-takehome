class Attachment {
  constructor(attachmentId, messageId, fileName, fileUrl) {
    this.attachmentId = attachmentId;
    this.messageId = messageId;
    this.fileName = fileName;
    this.fileUrl = fileUrl;
  }
  static validate({ fileName, fileUrl }) {
    if (!fileName || !fileUrl) {
      throw new Error('fileName and fileUrl are required');
    }
  }
  static create(data) {
    const { attachmentId, messageId, fileName, fileUrl } = data;
    Attachment.validate({ fileName, fileUrl });
    return new Attachment(attachmentId, Number(messageId), fileName, fileUrl);
  }
}
module.exports = Attachment;
