class Case {
    constructor(caseId, ownerId, issueDescription) {
      this.caseId = caseId;
      this.ownerId = ownerId;
      this.issueDescription = issueDescription;
      this.status = 'open';
      this.createdAt = new Date();
    }
  }
  
  module.exports = Case;
  