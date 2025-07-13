const Task = require("../models/Task");
const { validateObjectId, sanitizeSearchQuery, validatePagination } = require("../utils/validation");
const moment = require("moment");

// Get all tasks with filtering, search, and pagination
exports.getTasks = async (req, res) => {
  try {
    const { 
      status, 
      priority, 
      category, 
      search, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { user: req.user.id };
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    
    // Add search functionality
    if (search) {
      const sanitizedSearch = sanitizeSearchQuery(search);
      filter.$or = [
        { title: { $regex: sanitizedSearch, $options: 'i' } },
        { description: { $regex: sanitizedSearch, $options: 'i' } },
        { tags: { $in: [new RegExp(sanitizedSearch, 'i')] } }
      ];
    }

    // Validate pagination
    const { page: pageNum, limit: limitNum } = validatePagination(page, limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const tasks = await Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const total = await Task.countDocuments(filter);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;

    res.status(200).json({
      status: true,
      msg: "Tasks retrieved successfully",
      data: {
        tasks,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      }
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return res.status(500).json({ 
      status: false, 
      msg: "Internal Server Error" 
    });
  }
};

// Get a single task
exports.getTask = async (req, res) => {
  try {
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ 
        status: false, 
        msg: "Invalid task ID format" 
      });
    }

    const task = await Task.findOne({ 
      user: req.user.id, 
      _id: req.params.taskId 
    });

    if (!task) {
      return res.status(404).json({ 
        status: false, 
        msg: "Task not found" 
      });
    }

    res.status(200).json({
      status: true,
      msg: "Task retrieved successfully",
      task
    });
  } catch (err) {
    console.error("Error fetching task:", err);
    return res.status(500).json({ 
      status: false, 
      msg: "Internal Server Error" 
    });
  }
};

// Create a new task
exports.postTask = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      status = 'pending',
      priority = 'medium',
      category = 'other',
      dueDate,
      tags = []
    } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ 
        status: false, 
        msg: "Title and description are required" 
      });
    }

    // Create task data object
    const taskData = {
      user: req.user.id,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      category,
      tags: Array.isArray(tags) ? tags.filter(tag => tag.trim()) : []
    };

    // Add due date if provided
    if (dueDate) {
      taskData.dueDate = new Date(dueDate);
    }

    const task = await Task.create(taskData);

    res.status(201).json({
      status: true,
      msg: "Task created successfully",
      task
    });
  } catch (err) {
    console.error("Error creating task:", err);
    return res.status(500).json({ 
      status: false, 
      msg: "Internal Server Error" 
    });
  }
};

// Update a task
exports.putTask = async (req, res) => {
  try {
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ 
        status: false, 
        msg: "Invalid task ID format" 
      });
    }

    const { 
      title, 
      description, 
      status,
      priority,
      category,
      dueDate,
      tags
    } = req.body;

    // Find task and check ownership
    let task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ 
        status: false, 
        msg: "Task not found" 
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        status: false, 
        msg: "Access denied. You can only update your own tasks" 
      });
    }

    // Prepare update data
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (category !== undefined) updateData.category = category;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags.filter(tag => tag.trim()) : [];

    // Handle completion status
    if (status === 'completed' && task.status !== 'completed') {
      updateData.completedAt = new Date();
    } else if (status !== 'completed' && task.status === 'completed') {
      updateData.completedAt = null;
    }

    // Update task
    task = await Task.findByIdAndUpdate(
      req.params.taskId, 
      updateData, 
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: true,
      msg: "Task updated successfully",
      task
    });
  } catch (err) {
    console.error("Error updating task:", err);
    return res.status(500).json({ 
      status: false, 
      msg: "Internal Server Error" 
    });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    if (!validateObjectId(req.params.taskId)) {
      return res.status(400).json({ 
        status: false, 
        msg: "Invalid task ID format" 
      });
    }

    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ 
        status: false, 
        msg: "Task not found" 
      });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        status: false, 
        msg: "Access denied. You can only delete your own tasks" 
      });
    }

    await Task.findByIdAndDelete(req.params.taskId);

    res.status(200).json({
      status: true,
      msg: "Task deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting task:", err);
    return res.status(500).json({ 
      status: false, 
      msg: "Internal Server Error" 
    });
  }
};

// Get task statistics
exports.getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get counts by status
    const statusStats = await Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Get counts by priority
    const priorityStats = await Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    // Get counts by category
    const categoryStats = await Task.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    // Get overdue tasks
    const overdueTasks = await Task.countDocuments({
      user: userId,
      dueDate: { $lt: new Date() },
      status: { $nin: ['completed', 'cancelled'] }
    });

    // Get tasks due today
    const today = moment().startOf('day');
    const tomorrow = moment().endOf('day');
    const dueToday = await Task.countDocuments({
      user: userId,
      dueDate: { $gte: today.toDate(), $lte: tomorrow.toDate() },
      status: { $nin: ['completed', 'cancelled'] }
    });

    // Get total tasks
    const totalTasks = await Task.countDocuments({ user: userId });

    res.status(200).json({
      status: true,
      msg: "Task statistics retrieved successfully",
      stats: {
        total: totalTasks,
        overdue: overdueTasks,
        dueToday,
        byStatus: statusStats,
        byPriority: priorityStats,
        byCategory: categoryStats
      }
    });
  } catch (err) {
    console.error("Error fetching task statistics:", err);
    return res.status(500).json({ 
      status: false, 
      msg: "Internal Server Error" 
    });
  }
};