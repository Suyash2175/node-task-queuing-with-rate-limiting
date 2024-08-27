const express = require('express');
const fs = require('fs');
const path = require('path');
const winston = require('winston');
const { v4: uuidv4 } = require('uuid');
const cluster = require('cluster');
const os = require('os');

const app = express();
const numCPUs = os.cpus().length;

// Configure Winston for logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'task-log.json' }),
    new winston.transports.Console()
  ]
});

// Middleware to parse JSON request bodies
app.use(express.json());

// POST /task: API endpoint to add a task
app.post('/task', async (req, res) => {
  const { userId, taskDescription } = req.body;
  if (!userId || !taskDescription) {
    return res.status(400).send('Missing userId or taskDescription');
  }

  const taskId = uuidv4();
  const taskData = {
    userId,
    taskId,
    taskDescription,
    timestamp: Date.now(),
    status: 'completed'
  };

  // Save task data to file
  const filePath = path.join(__dirname, 'tasks.json');
  let tasks = [];

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    tasks = JSON.parse(data);
  } catch (error) {
    logger.warn('No previous task data found, starting a new file');
  }

  tasks.push(taskData);
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));

  logger.info(`Task ${taskId} for user ${userId} completed and logged`);

  res.status(200).send(`Task ${taskId} added successfully`);
});

// GET /tasks/:userId: API endpoint to get tasks by userId
app.get('/tasks/:userId', async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send('Missing userId');
  }

  try {
    const tasks = await fetchTasks(userId);
    res.status(200).json(tasks);
  } catch (error) {
    logger.error(`Error fetching tasks for user ${userId}:`, error);
    res.status(500).send('Error fetching tasks');
  }
});

// Fetch tasks function
async function fetchTasks(userId) {
  const filePath = path.join(__dirname, 'tasks.json');
  let tasks = [];

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    tasks = JSON.parse(data);
  } catch (error) {
    logger.warn('Error reading task data from file:', error);
  }

  return tasks.filter(task => task.userId === userId);
}

// Cluster setup for load balancing
if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  // Start the server
  const PORT = 4005;
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} started on port ${PORT}`);
  });
}
