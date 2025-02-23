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

Next Steps:
1. Created the case route to create a new case for a user and get the list of cases for a user. Tested with postman and it works as expected. 
2. Created the message route to create a new message. Added a check to only proceed it the case exists. Since a message belongs to a case, I've mounted the mesage route to the case route. Also another thing is that the case can be accessed only the owner of the case as well as the Staff or AI. So Added checks for those accordingly.
3. 




