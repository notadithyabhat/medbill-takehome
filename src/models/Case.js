class Case {
    constructor(caseId, ownerId, issueDescription) {
      this.caseId = caseId;
      this.ownerId = ownerId;
      this.issueDescription = issueDescription;
      this.createdAt = new Date();
    }
  }
  
  module.exports = Case;
  