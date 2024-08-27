# Node.js Task Queuing with Rate Limiting

## 📜 Overview

This project implements a Node.js API cluster to handle task queuing with rate limiting. The API supports managing user tasks with constraints to ensure efficient task processing and logging. The system is designed to handle tasks with a rate limit of 1 task per second and 20 tasks per minute per user ID.

## 🚀 Features

- **Rate Limiting**: Enforces a limit of 1 task per second and 20 tasks per minute per user ID.
- **Task Queueing**: Manages tasks to ensure they are processed according to rate limits.
- **Clustering**: Utilizes Node.js clustering with two replica sets for load balancing.
- **Logging**: Records task completion details in a log file.
- **Resilience**: Handles failures and edge cases effectively.

## ⚙️ Installation

To set up the project locally:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Suyash2175/node-task-queuing-with-rate-limiting.git
   cd node-task-queuing-with-rate-limiting
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Application**
   ```bash
   npm start
   ```

## 🌐 API Endpoints

### **POST /task**

Add a task for a specific user.

- **Request Body**:
  ```json
  {
    "userId": "string",
    "taskDescription": "string"
  }
  ```

- **Response**:
  ```text
  Task {taskId} added successfully
  ```

- **Example**:
  ```bash
  curl -X POST http://localhost:4005/task -H "Content-Type: application/json" -d '{"userId": "123", "taskDescription": "Test task"}'
  ```

### **GET /tasks/:userId**

Retrieve tasks for a specific user.

- **Response**:
  ```json
  [
    {
      "userId": "string",
      "taskId": "string",
      "taskDescription": "string",
      "timestamp": "number",
      "status": "string"
    }
  ]
  ```

- **Example**:
  ```bash
  curl http://localhost:4005/tasks/123
  ```

## 🛠️ Configuration

- **Port**: The application listens on port `4005`.
- **Log Files**: Task completion details are logged in `task-log.json`.

## 📋 Task Function

The provided task function logs the completion of a task, including the user ID and timestamp. This information is stored in a log file.

```javascript
async function task(user_id) {
  console.log(`${user_id}-task completed at-${Date.now()}`);
  // This should be stored in a log file
}
```

## 🏗️ Rate Limiting

- **Per User**: 1 task per second, 20 tasks per minute.
- **Queueing**: Requests exceeding the rate limit are queued and processed accordingly.

## 🔄 Clustering

- **Replica Sets**: The application runs with two replica sets for load balancing.
- **CPUs**: Utilizes all available CPU cores.

## 📝 Notes

- **Redis**: Recommended for queueing between clusters (not implemented in this solution but suggested for larger-scale implementations).
- **Error Handling**: Ensures no requests are dropped; exceeded rate limits are preserved and processed after the desired interval.

## 🤝 Contributing

Feel free to contribute by submitting issues or pull requests. Please follow best practices and ensure your code is well-documented.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## 🏅 Evaluation Criteria

Your submission will be evaluated based on:

- Correct implementation of rate limiting and task queueing.
- Proper handling of asynchronous operations and edge cases.
- Efficiency and scalability of the solution.
- Clarity and organization of the codebase.
- Quality of documentation.

## 📚 Documentation

- **Setup and Running**: Provided in the Installation section.
- **API Usage**: See API Endpoints for details on how to interact with the API.
- **Configuration and Clustering**: Refer to Configuration and Clustering sections.

