import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      onLogin(response.data.user, response.data.token);
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '0 auto',
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    },
    input: {
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '1rem'
    },
    button: {
      padding: '0.75rem',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer'
    },
    error: {
      color: '#e74c3c',
      textAlign: 'center'
    },
    switchBtn: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#3498db',
      cursor: 'pointer',
      textDecoration: 'underline'
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      {error && <div style={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Don't have an account? {' '}
        <button onClick={onSwitchToRegister} style={styles.switchBtn}>
          Register here
        </button>
      </p>
    </div>
  );
};

export default Login;