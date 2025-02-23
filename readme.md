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

# Major Design Decision:
1. I am not storing the attachment in the message but only storing the URL because in most applications, it is better to store the attachment in something like s3 or a cloud storage and the URL is enough to access the attachment.
2. A case can only be accessed by the owner/staff/AI.

# Implementation
1. Created the case route to create a new case for a user and get the list of cases for a user. Tested with postman and it works as expected. 
2. Created the message route to create a new message. Added a check to only proceed it the case exists. Since a message belongs to a case, I've mounted the mesage route to the case route. Also another thing is that the case can be accessed only the owner of the case as well as the Staff or AI. So Added checks for those accordingly. 
3. Next with the attachments, I could either store in the message or have a seperate attachment store. I decided to create a seperate store so that it's easy to add multiple attachments to a message. Most of the validation remains the same as the messages route. I also updated the message to add the attachments list if it exists. 

This should cover the basic requirements.

Testing done with Postman so far:
1. Create a case for a user
2. Ensure that user, staff and AI can create a message
3. Ensure that other users cannot create a message
4. Get the list of cases for a user
5. Get a list of messages for a case
6. Get a list of attachments for a message


# Next Steps
1. I'd probably switch to a graphQL messages since the things like cases/messages/attachments is getting a bit longer. I had thought of using it, but given the time constraint and since I haven't worked with it in a while so decided to implement with REST instead
2. Create a test suite using Jest to test each of the routes
3. Implement a thumbnail generator for the attachments. Th





