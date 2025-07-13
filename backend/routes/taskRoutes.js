const express = require("express");
const router = express.Router();
const { 
  getTasks, 
  getTask, 
  postTask, 
  putTask, 
  deleteTask, 
  getTaskStats 
} = require("../controllers/taskControllers");
const { verifyAccessToken } = require("../middlewares.js");
const { 
  validateTask, 
  handleValidationErrors 
} = require("../utils/validation");

// Routes beginning with /api/tasks
router.get("/", verifyAccessToken, getTasks);
router.get("/stats", verifyAccessToken, getTaskStats);
router.get("/:taskId", verifyAccessToken, getTask);
router.post("/", verifyAccessToken, validateTask, handleValidationErrors, postTask);
router.put("/:taskId", verifyAccessToken, validateTask, handleValidationErrors, putTask);
router.delete("/:taskId", verifyAccessToken, deleteTask);

module.exports = router;
