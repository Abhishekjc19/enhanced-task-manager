import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaCalendar, FaTag, FaFlag, FaCheckCircle, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import clsx from 'clsx';
import moment from 'moment';

const TaskCard = ({ task, onDelete, onStatusChange }) => {
  const isOverdue = task.dueDate && moment(task.dueDate).isBefore(moment(), 'day') && task.status !== 'completed';
  const isDueToday = task.dueDate && moment(task.dueDate).isSame(moment(), 'day') && task.status !== 'completed';

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'work': return 'bg-purple-100 text-purple-800';
      case 'personal': return 'bg-pink-100 text-pink-800';
      case 'shopping': return 'bg-indigo-100 text-indigo-800';
      case 'health': return 'bg-red-100 text-red-800';
      case 'education': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (newStatus) => {
    onStatusChange(task._id, newStatus);
  };

  return (
    <div className={clsx(
      'bg-white rounded-lg shadow-md border-l-4 p-4 transition-all duration-200 hover:shadow-lg',
      {
        'border-red-500': isOverdue,
        'border-yellow-500': isDueToday && !isOverdue,
        'border-green-500': task.status === 'completed',
        'border-gray-500': !isOverdue && !isDueToday && task.status !== 'completed'
      }
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
            {task.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {task.description}
          </p>
        </div>
        
        {/* Priority Badge */}
        <div className="flex items-center space-x-2 ml-4">
          <span className={clsx(
            'px-2 py-1 rounded-full text-xs font-medium flex items-center',
            getPriorityColor(task.priority)
          )}>
            <FaFlag className="mr-1" />
            {task.priority}
          </span>
        </div>
      </div>

      {/* Status and Actions */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={clsx(
            'px-3 py-1 rounded-full text-xs font-medium border',
            getStatusColor(task.status)
          )}>
            {task.status === 'completed' && <FaCheckCircle className="inline mr-1" />}
            {task.status === 'in-progress' && <FaClock className="inline mr-1" />}
            {task.status}
          </span>
          
          <span className={clsx(
            'px-2 py-1 rounded-full text-xs font-medium',
            getCategoryColor(task.category)
          )}>
            <FaTag className="inline mr-1" />
            {task.category}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to={`/tasks/${task._id}`}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Edit task"
          >
            <FaEdit />
          </Link>
          <button
            onClick={() => onDelete(task._id)}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Delete task"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Due Date */}
      {task.dueDate && (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <FaCalendar className="mr-2" />
            <span className={clsx({
              'text-red-600 font-medium': isOverdue,
              'text-yellow-600 font-medium': isDueToday && !isOverdue,
              'text-gray-600': !isOverdue && !isDueToday
            })}>
              Due: {moment(task.dueDate).format('MMM DD, YYYY')}
            </span>
            {isOverdue && <FaExclamationTriangle className="ml-2 text-red-500" />}
          </div>
        </div>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Quick Status Actions */}
      {task.status !== 'completed' && (
        <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
          <button
            onClick={() => handleStatusChange('in-progress')}
            className={clsx(
              'px-3 py-1 text-xs rounded-full transition-colors',
              task.status === 'in-progress'
                ? 'bg-blue-500 text-white'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            )}
          >
            Start
          </button>
          <button
            onClick={() => handleStatusChange('completed')}
            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
          >
            Complete
          </button>
        </div>
      )}

      {/* Completion Info */}
      {task.status === 'completed' && task.completedAt && (
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
          Completed on {moment(task.completedAt).format('MMM DD, YYYY')}
        </div>
      )}
    </div>
  );
};

export default TaskCard; 