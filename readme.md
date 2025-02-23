# Requirements

**Note:** Using Git for version control so I can easily revert changes if I don't complete a feature.

## Data Modelling

### Entities

1. **Users**  
   The end users (customers) along with staff and AI.
2. **Cases**  
   Each represents a conversation instance.
3. **Messages**  
   The chat messages posted within a case.
4. **Attachments**  
   Files attached to messages.

### Relationships

- **Users → Cases:** One user can have many cases (1:N).  
- **Cases → Messages:** One case can include many messages (1:N).  
- **Messages → Attachments:** One message can have multiple attachments (1:N).

### ER Model

- **User:**  
  - `userId`
  - `name`
  - `type` (AI, staff, user)

- **Case:**  
  - `caseId`
  - `ownerId` (Foreign Key to User)
  - `issueDescription`
  - `createdAt`

- **Message:**  
  - `messageId`
  - `caseId` (Foreign Key to Case)
  - `senderId` (Foreign Key to User)
  - `content`
  - `createdAt`
  - `attachment`

- **Attachment:**  
  - `messageId` (Foreign Key to Message)
  - `fileName`
  - `fileUrl`

I believe these entities cover all the basic requirements. I started off by creating a list of objects for each data model and defining each model in the `models` folder.

# Major Design Decisions

1. **Attachment Storage:**  
   Attachments aren’t stored directly in the message; only the URL is saved. This approach leverages cloud storage (like S3) for file management.

2. **Case Access:**  
   Cases can only be accessed by the owner, staff, or AI.

3. **Data Deletion:**  
   Instead of physically deleting a case, message, or attachment, they are marked as closed.

# Implementation

1. **Case Route:**  
   - Created a route to create a new case for a user and to fetch the list of a user's cases.  
   - Tested using Postman—everything works as expected.

2. **Message Route:**  
   - Built a route to create a new message.  
   - Added a check to verify the case exists before adding a message.  
   - Mounted the message route under the case route since messages belong to cases.  
   - Included validations so that only the case owner, staff, or AI can post messages.

3. **Attachment Handling:**  
   - Decided to create a separate attachment store rather than embedding attachments directly in messages. This makes it easier to add multiple attachments to a single message.  
   - Most validations are similar to those in the message route, with messages updated to include an attachments list if applicable.

4. **Thumbnail Generation:**  
   - Integrated a thumbnail generator using Sharp. This assumes that the image URL is accessible, and testing with a sample URL has been successful.

This setup should cover the basic requirements.

**Testing with Postman so far:**

- Creating a case for a user.
- Ensuring that the user, staff, and AI can create a message.
- Verifying that unauthorized users cannot create messages.
- Retrieving a list of cases for a user.
- Retrieving messages for a specific case.
- Retrieving attachments for a specific message.

# Next Steps

1. **GraphQL Migration:**  
   Consider switching to GraphQL for handling cases, messages, and attachments since the REST endpoints are growing in complexity. I had thought about it, but due to time constraints and my current familiarity, I implemented REST for now.

2. **Test Suite:**  
   Build a comprehensive test suite using Jest to cover all routes.

3. **Enhanced Thumbnail Generator:**  
   Work on a version that downloads the file to generate thumbnails. This might make me reconsider the current approach of not storing files locally.

4. **Documentation:**  
   Dedicate more time to refining the documentation—haha.

5. **ID Management:**  
   Address the issue where deleting a case, message, or attachment causes a replication error (due to the counter incrementing). A dedicated counter for the next `caseId`, `messageId`, and `attachmentId` is needed.

6. **Model Validations:**  
   Move validation logic from the routes into the data models.

# API Endpoints

**Note:** Users already exist in the database.

### Instructions
- Run `npm start` and make requests to the endpoints.

---

### 1) **Create a New Case**  
- **Method:** `POST /cases`  
- **Request Body** (JSON):
  ```json
  {
    "ownerId": 1,
    "issueDescription": "Having a billing issue"
  }
  ```
- **Result:** Returns the newly created case object.

---

### 2) **Get All Cases for a Specific User**  
- **Method:** `GET /cases/user/:userId`  
- **Example:** `GET /cases/user/1`  
- **Result:** Returns a list of all cases for user 1. If none are found, returns a 404.

---

### 3) **Create a Message in a Case**  
- **Method:** `POST /cases/:caseId/messages`  
- **Request Body:**
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
  *(The `attachment` part is optional.)*
- **Rules:**  
  - The `content` field should not be empty.  
  - If the `senderId` belongs to a regular user, it must match the case owner.  
  - Staff or AI can post messages to any case.
- **Result:** Returns the newly created message object.

---

### 4) **Get Messages for a Case**  
- **Method:** `GET /cases/:caseId/messages`  
- **Example:** `GET /cases/1/messages`  
- **Result:** Returns an array of all messages in case 1.

---

### 5) **Add an Attachment to an Existing Message**  
- **Method:** `POST /cases/:caseId/messages/:messageId/attachments`  
- **Request Body** (JSON):
  ```json
  {
    "fileName": "xray.pdf",
    "fileUrl": "https://cdn.example.com/xray.pdf"
  }
  ```
- **Result:** Returns the newly created attachment object.

---

### 6) **Get Attachments for a Message**  
- **Method:** `GET /cases/:caseId/messages/:messageId/attachments`  
- **Example:** `GET /cases/1/messages/1/attachments`  
- **Result:** Returns an array of attachments linked to message #1 in case #1.

---