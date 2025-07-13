import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import TaskCard from './TaskCard';
import TaskFilters from './TaskFilters';

const Tasks = () => {
  const authState = useSelector(state => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [fetchData, { loading }] = useFetch();

  // Fetch tasks with filters
  const fetchTasks = useCallback(async (page = 1) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '10',
      ...filters
    });

    const config = { 
      url: `/tasks?${params}`, 
      method: "get", 
      headers: { Authorization: authState.token } 
    };
    
    try {
      const data = await fetchData(config, { showSuccessToast: false });
      if (data.data) {
        setTasks(data.data.tasks);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [authState.token, fetchData, filters]);

  // Fetch task statistics
  const fetchStats = useCallback(async () => {
    const config = { 
      url: "/tasks/stats", 
      method: "get", 
      headers: { Authorization: authState.token } 
    };
    
    try {
      const data = await fetchData(config, { showSuccessToast: false });
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks(1);
    fetchStats();
  }, [authState.isLoggedIn, fetchTasks, fetchStats]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Handle search change
  const handleSearchChange = (value) => {
    setFilters(prev => ({
      ...prev,
      search: value
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      category: '',
      search: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Handle task deletion
  const handleDelete = async (taskId) => {
    const config = { 
      url: `/tasks/${taskId}`, 
      method: "delete", 
      headers: { Authorization: authState.token } 
    };
    
    try {
      await fetchData(config);
      fetchTasks(pagination.currentPage);
      fetchStats();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Handle status change
  const handleStatusChange = async (taskId, newStatus) => {
    const config = { 
      url: `/tasks/${taskId}`, 
      method: "put", 
      data: { status: newStatus },
      headers: { Authorization: authState.token } 
    };
    
    try {
      await fetchData(config);
      fetchTasks(pagination.currentPage);
      fetchStats();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchTasks(page);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600 mt-1">
            Manage and organize your tasks efficiently
          </p>
        </div>
        <Link
          to="/tasks/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <FaPlus />
          <span>Add Task</span>
        </Link>
      </div>

      {/* Filters */}
      <TaskFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onClearFilters={handleClearFilters}
        stats={stats}
      />

      {/* Tasks List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
        </div>
      ) : (
        <>
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {filters.search || filters.status || filters.priority || filters.category
                  ? 'No tasks match your filters'
                  : 'No tasks yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {filters.search || filters.status || filters.priority || filters.category
                  ? 'Try adjusting your filters or search terms'
                  : 'Get started by creating your first task'}
              </p>
              {!filters.search && !filters.status && !filters.priority && !filters.category && (
                <Link
                  to="/tasks/add"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-colors"
                >
                  <FaPlus />
                  <span>Create Your First Task</span>
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Tasks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  <span className="px-4 py-2 text-gray-700">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Results Info */}
              <div className="text-center text-gray-500 mt-4">
                Showing {tasks.length} of {pagination.totalItems} tasks
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tasks;