# Requirements

## Data Modelling
### Entities
1. Users - the end user who has an open case + staff + AI
2. Cases - each conversation instance
3. Messages - Chat messages posted in a case
4. Attahments - files attached to a message

### Relationship
1. Users -> Cases (1:N)
2. Cases -> Messages (1:N)
3. Messages -> Attachments (0:N)

### ER Model
1. User - userId, name, type(AI, staff, user)
2. case - caseId, ownerId (FK to User), issueDescription, createdAt
3. message - messageId, caseId(FK to Case), senderId(FK to User), content, createdAt, attachment
4. attachment - messageId(FK to MessageStore), fileName, fileUrl

I think these three entities are enough to cover all the requirements. I started off by created list of objects for each data and defined each models in the models folder.




