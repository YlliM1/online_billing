import React, { useEffect, useState } from 'react';
import { FaPen, FaTrash, FaPlus } from 'react-icons/fa';  
import Navbar from '../../components/Navbar';
import './Team.css';
import { useNavigate } from 'react-router-dom';

const Team = () => {
  const [userName, setUserName] = useState('');
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = sessionStorage.getItem('user_name');
    const storedRole = sessionStorage.getItem('user_role');
    const lastActivity = sessionStorage.getItem('last_activity');
    const now = new Date().getTime();

    if (storedName) {
      if (lastActivity && now - lastActivity > 45 * 60 * 1000) {
        alert('Session expired. Please log in again.');
        handleLogout();
      } else {
        setUserName(storedName);
        setIsAdmin(storedRole === 'admin');
        sessionStorage.setItem('last_activity', now);
        fetchUsers();
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost/online_billing/server/php/view_users.php');
      const data = await response.json();
      if (data.length) {
        setUsers(data);
      } else {
        alert('No users found.');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost/online_billing/server/php/logout.php', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        sessionStorage.clear();
        navigate('/login');
      } else {
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred during logout.');
    }
  };

  const validateForm = (user) => {
    let formErrors = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    };

    if (!user.firstname) formErrors.firstname = 'First name is required.';
    if (!user.lastname) formErrors.lastname = 'Last name is required.';
    if (!user.email) formErrors.email = 'Email is required.';
    if (!user.password) formErrors.password = 'Password is required.';

    if (user.firstname && user.firstname.length < 3) {
      formErrors.firstname = 'First name must be at least 3 characters long.';
    }
    if (user.lastname && user.lastname.length < 3) {
      formErrors.lastname = 'Last name must be at least 3 characters long.';
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (user.email && !emailPattern.test(user.email)) {
      formErrors.email = 'Please enter a valid email address.';
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (user.password && !passwordPattern.test(user.password)) {
      formErrors.password = 'Password must be at least 8 characters, including 1 uppercase letter and 1 number.';
    }

    setErrors(formErrors);
    return Object.values(formErrors).every((error) => error === '');
  };

  const handleCreate = async () => {
    if (!validateForm(newUser)) return;

    try {
      const response = await fetch('http://localhost/online_billing/server/php/create_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      const result = await response.json();

      if (result.success) {
        alert('User created successfully');
        setUsers([...users, { id: result.id, ...newUser }]);
        setShowForm(false);
        setNewUser({
          firstname: '',
          lastname: '',
          email: '',
          password: '',
          role: 'user',
        });
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleEdit = (userId) => {
    const userToEdit = users.find(user => user.id === userId);
    setEditingUser({ ...userToEdit });
  };

  const handleEditSubmit = async () => {
    if (!validateForm(editingUser)) return;

    try {
      const response = await fetch('http://localhost/online_billing/server/php/edit_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      });

      const result = await response.json();

      if (result.success) {
        alert('User updated successfully');
        setUsers(users.map((user) => (user.id === editingUser.id ? editingUser : user)));
        setEditingUser(null);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      const response = await fetch('http://localhost/online_billing/server/php/delete_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      });

      const result = await response.json();

      if (result.success) {
        alert('User deleted successfully');
        setUsers(users.filter(user => user.id !== userId));
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user.');
    }
  };

  return (
    <div className="team-container">
      <Navbar userName={userName} handleLogout={handleLogout} />

      <div className="team-header">
        <h2>Users List</h2>
        {isAdmin && (
          <button className="add-user-btn" onClick={() => setShowForm(!showForm)}>
            <FaPlus />
          </button>
        )}
      </div>

      {showForm && isAdmin && (
        <div className="create-user-form">
          <button className="close-btn" onClick={() => setShowForm(false)}>&#x2715;</button>
          <h3>Add User</h3>
          <input
            type="text"
            name="firstname"
            value={newUser.firstname}
            onChange={handleInputChange}
            placeholder="First Name"
          />
          {errors.firstname && <p className="error">{errors.firstname}</p>}
          <input
            type="text"
            name="lastname"
            value={newUser.lastname}
            onChange={handleInputChange}
            placeholder="Last Name"
          />
          {errors.lastname && <p className="error">{errors.lastname}</p>}
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
          {errors.email && <p className="error">{errors.email}</p>}
          <input
            type="password"
            name="password"
            value={newUser.password}
            onChange={handleInputChange}
            placeholder="Password"
          />
          {errors.password && <p className="error">{errors.password}</p>}
          <select name="role" value={newUser.role} onChange={handleInputChange}>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <button onClick={handleCreate}>Add User</button>
        </div>
      )}

      {editingUser && isAdmin && (
        <div className="create-user-form">
          <button className="close-btn" onClick={() => setEditingUser(null)}>&#x2715;</button>
          <h3>Edit User</h3>
          <input
            type="text"
            name="firstname"
            value={editingUser.firstname}
            onChange={handleInputChange}
            placeholder="First Name"
          />
          {errors.firstname && <p className="error">{errors.firstname}</p>}
          <input
            type="text"
            name="lastname"
            value={editingUser.lastname}
            onChange={handleInputChange}
            placeholder="Last Name"
          />
          {errors.lastname && <p className="error">{errors.lastname}</p>}
          <input
            type="email"
            name="email"
            value={editingUser.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
          {errors.email && <p className="error">{errors.email}</p>}
          <input
            type="password"
            name="password"
            value={editingUser.password}
            onChange={handleInputChange}
            placeholder="Password"
          />
          {errors.password && <p className="error">{errors.password}</p>}
          <select name="role" value={editingUser.role} onChange={handleInputChange}>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <button onClick={handleEditSubmit}>Update User</button>
        </div>
      )}

      {/* Users Table */}
      <div className="table-container">
        <table className="user-list-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id || `${user.firstname}-${user.lastname}-${index}`}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  {isAdmin && (
                    <td className="actions">
                                      <button className="action-btn edit-btn" onClick={() => handleEdit(user.id)}>
                        <FaPen />
                      </button>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(user.id)}>
                        <FaTrash />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Team;

