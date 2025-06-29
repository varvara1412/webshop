import React, { useState, useEffect } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: ''
  });

  // Fetch users from database
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users);
      } else {
        setError('Failed to fetch users');
      }
    } catch (error) {
      setError('Network error while fetching users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      dateOfBirth: ''
    });
    setEditingUser(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingUser 
        ? `http://localhost:5000/api/users/${editingUser._id}`
        : 'http://localhost:5000/api/register';
      
      const method = editingUser ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert(editingUser ? 'User updated successfully!' : 'User added successfully!');
        resetForm();
        fetchUsers(); // Refresh the user list
      } else {
        alert(data.message || 'Operation failed');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '', // Don't show password
      phone: user.phone,
      dateOfBirth: user.dateOfBirth.split('T')[0] // Format date for input
    });
    setShowAddForm(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('User deleted successfully!');
        fetchUsers(); // Refresh the user list
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete user');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="user-management-container">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      <div className="user-management-card">
        <div className="user-management-header">
          <h1>User Management</h1>
          <p>Manage users in the database</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="user-management-actions">
          <button 
            className="add-user-btn"
            onClick={() => setShowAddForm(true)}
          >
            Add New User
          </button>
        </div>

        {showAddForm && (
          <div className="add-user-form">
            <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password {editingUser && '(leave blank to keep current)'}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!editingUser}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="users-table-container">
          <h2>Users in Database ({users.length})</h2>
          {users.length === 0 ? (
            <div className="no-users">No users found in the database.</div>
          ) : (
            <div className="users-table">
              <div className="table-header">
                <div className="header-cell">Name</div>
                <div className="header-cell">Email</div>
                <div className="header-cell">Phone</div>
                <div className="header-cell">Date of Birth</div>
                <div className="header-cell">Created</div>
                <div className="header-cell">Actions</div>
              </div>
              
              {users.map(user => (
                <div key={user._id} className="table-row">
                  <div className="table-cell">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="table-cell">{user.email}</div>
                  <div className="table-cell">{user.phone}</div>
                  <div className="table-cell">{formatDate(user.dateOfBirth)}</div>
                  <div className="table-cell">{formatDate(user.createdAt)}</div>
                  <div className="table-cell actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement; 