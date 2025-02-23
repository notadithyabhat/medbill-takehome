# Requirements

Note: Tracking with Git, so that I can revert back incase I dont complete a feature for version control.

## Data Modelling
### Entities
1. Users - the end user who has an open case + staff + AI
2. Cases - each conversation instance
3. Messages - Chat messages posted in a case
4. Attahments - files attached to a message

### Relationship
1. Users -> Cases (1:N)
2. Cases -> Messages (1:N)
3. Messages -> Attachments (1:N)

### ER Model
1. User - userId, name, type(AI, staff, user)
2. case - caseId, ownerId (FK to User), issueDescription, createdAt
3. message - messageId, caseId(FK to Case), senderId(FK to User), content, createdAt, attachment
4. attachment - messageId(FK to MessageStore), fileName, fileUrl

I think these three entities are enough to cover all the requirements. I started off by creating list of objects for each data and defined each models in the models folder. 

# Major Design Decision:

1. I am not storing the attachment in the message but only storing the URL because in most applications, it is better to store the attachment in something like s3 or a cloud storage and the URL is enough to access the attachment.
2. A case can only be accessed by the owner/staff/AI.
3. A case, message and attachment are not going to be deleted. They are going to be marked as deleted.

# Implementation
1. Created the case route to create a new case for a user and get the list of cases for a user. Tested with postman and it works as expected. 
2. Created the message route to create a new message. Added a check to only proceed it the case exists. Since a message belongs to a case, I've mounted the mesage route to the case route. Additionally added checks to make sure the case can be accessed only the owner of the case as well as the Staff or AI.
3. Next with the attachments, I could either store in the message or have a seperate attachment store. I decided to create a seperate store so that it's easy to add multiple attachments to a message. Most of the validation remains the same as the messages route. Updated the message to add the attachments list if it exists. 

This should cover the basic requirements.

Testing done with Postman so far:
1. Create a case for a user
2. Ensure that user, staff and AI can create a message
3. Ensure that other users cannot create a message
4. Get the list of cases for a user
5. Get a list of messages for a case
6. Get a list of attachments for a message


# Next Steps
1. I'd probably switch to a graphQL messages since the things like cases/messages/attachments is getting a bit longer. I had thought of using it, but given the time constraint and since I haven't worked with it in a while, decided to implement with REST instead
2. Create a test suite using Jest to test each of the routes
3. Implement a thumbnail generator for the attachments. Would reqire downloading the file and generating the thumbnail. This is making me rethink whether not storing the file locally is a good idea for our current use case.
4. Probably dedicate more time for documentatiion, haha.
5. Deleted a case, message or attachment will cause case.length + 1 to cause replication errors. Need to have a counter for next caseId, messageId and attachmentId
6. Move the validations into the data model instead of the routes

# API Endpoints

Note: Users already exist in the database.
### Instructions: npm start and make requests to the endpoints

### 1) **Create a new case**  
- **Method**: `POST /cases`  
- **Request Body** (JSON):
  ```json
  {
    "ownerId": 1,
    "issueDescription": "Having a billing issue"
  }
  ```
- **Result**: Returns the new case object.  

### 2) **Get all cases for a specific user**  
- **Method**: `GET /cases/user/:userId`  
- **Example**: `GET /cases/user/1`  
- **Result**: Returns a list of all cases owned by user 1. If none found, returns a 404.  

---

### 3) **Create a message in a case**  
- **Method**: `POST /cases/:caseId/messages`  
- **Request Body** :
  ```json
  {
    "senderId": 1,
    "content": "Hello, can someone help me?",
    "attachment": {
      "fileName": "receipt.png",
      "fileUrl": "https://somewhere.com/receipt.png"
    }
  }
  ```
  (The `attachment` part is optional.)  
- **Rules**:  
  - `content` shouldn’t be empty.  
  - If `senderId` belongs to a regular user, it must match the case owner.  
  - Staff or AI can post to any case.  
- **Result**: Returns the newly created message object.

### 4) **Get messages for a case**  
- **Method**: `GET /cases/:caseId/messages`  
- **Example**: `GET /cases/1/messages`  
- **Result**: Returns an array of all messages in case 1.  

---

### 5) **Add a separate attachment to an existing message**  
- **Method**: `POST /cases/:caseId/messages/:messageId/attachments`  
- **Request Body** (JSON):
  ```json
  {
    "fileName": "xray.pdf",
    "fileUrl": "https://cdn.example.com/xray.pdf"
  }
  ```
- **Result**: Returns the newly created attachment object.  

---

### 6) **Get attachments for a message**  
- **Method**: `GET /cases/:caseId/messages/:messageId/attachments`  
- **Example**: `GET /cases/1/messages/1/attachments`  
- **Result**: Returns an array of attachments that were linked to message #1 in case #1.