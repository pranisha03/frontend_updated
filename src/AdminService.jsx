// src/AdminService.js
import axios from 'axios';

const BASIC_URL = 'http://localhost:8080/';

class AdminService {
  getUsers() {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios.get(`${BASIC_URL}api/admin/users`, { headers });
  }

  createTask(task) {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios.post(`${BASIC_URL}api/admin/task`, task, { headers });
  }

  getTasks() {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios.get(`${BASIC_URL}api/admin/tasks`, { headers });
  }

  deleteTask(taskId) {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios.delete(`${BASIC_URL}api/admin/task/${taskId}`, { headers });
  }

  updateTask(taskId, task) {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios.put(`${BASIC_URL}api/admin/task/${taskId}`, task, { headers });
  }

  searchTasks(title) {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return axios.get(`${BASIC_URL}api/admin/tasks/search/${title}`, { headers });
  }
}

export default AdminService;
