import React, { useEffect, useState } from 'react';
import './Admin.css';
import AdminService from './AdminService';
import TaskList from './TaskList';

const Admin = () => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'LOW',
    employeeId: '',
    taskStatus: 'PENDING'
  });

  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    const adminService = new AdminService();
    try {
      const response = await adminService.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const adminService = new AdminService();
    try {
      const response = await adminService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminService = new AdminService();
    try {
      if (isEditing) {
        await adminService.updateTask(editTaskId, task);
        alert('Task updated successfully');
        setIsEditing(false);
        setEditTaskId(null);
      } else {
        await adminService.createTask(task);
        alert('Task created successfully');
      }
      setTask({ title: '', description: '', dueDate: '', priority: 'LOW', employeeId: '', taskStatus: 'PENDING' });
      fetchTasks();
    } catch (error) {
      console.error('Error creating/updating task:', error);
      alert('Failed to create/update task');
    }
  };

  const handleDelete = async (taskId) => {
    const adminService = new AdminService();
    try {
      await adminService.deleteTask(taskId);
      alert('Task deleted successfully');
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  const handleEdit = (task) => {
    const formattedDueDate = task.dueDate.split('T')[0];
    setTask({
      title: task.title,
      description: task.description,
      dueDate: formattedDueDate,
      priority: task.priority,
      employeeId: task.employeeId,
      taskStatus: task.taskStatus
    });
    setIsEditing(true);
    setEditTaskId(task.id);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const adminService = new AdminService();
    try {
      const response = await adminService.searchTasks(searchTerm);
      setTasks(response.data);
      setIsSearching(true);
    } catch (error) {
      console.error('Error searching tasks:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleShowAllTasks = () => {
    setSearchTerm('');
    fetchTasks();
    setIsSearching(false);
  };

  return (
    <div className="admin-container">
      <h2>{isEditing ? 'Edit Task' : 'Create a New Task'}</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" name="title" value={task.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <input type="text" name="description" value={task.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Due Date:</label>
          <input type="date" name="dueDate" value={task.dueDate} onChange={handleChange} required />
        </div>
        <div>
          <label>Priority:</label>
          <select name="priority" value={task.priority} onChange={handleChange}>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>
        <div>
          <label>Employee:</label>
          <select name="employeeId" value={task.employeeId} onChange={handleChange} required>
            <option value="">Select an employee</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Status:</label>
          <select name="taskStatus" value={task.taskStatus} onChange={handleChange}>
            <option value="PENDING">Pending</option>
            <option value="INPROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="DEFERRED">Deferred</option>
          </select>
        </div>
        <button type="submit">{isEditing ? 'Update Task' : 'Create Task'}</button>
      </form>

      <div className="admin-search">
        <h2>Search Tasks</h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by title"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button type="submit">Search</button>
        </form>
        {isSearching && (
          <button type="submit" onClick={handleShowAllTasks}>Show All Tasks</button>
        )}
      </div>

      <TaskList tasks={tasks} users={users} onDelete={handleDelete} onEdit={handleEdit} loading={loading} />
    </div>
  );
};

export default Admin;
