import React, { useState, useEffect } from 'react';
import Login from './login';
import Register from './Register';
import Dashboard from './Dashboard';
import MessagePage from './MessagePage';

const App = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('login');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    },
    header: {
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logoutBtn: {
      backgroundColor: '#e74c3c',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      {user && (
        <div style={styles.header}>
          <h1>Parent-Teacher Communication</h1>
          <div>
            <span>Welcome, {user.name} ({user.role})</span>
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}

      {currentPage === 'login' && (
        <Login 
          onLogin={handleLogin} 
          onSwitchToRegister={() => setCurrentPage('register')} 
        />
      )}
      
      {currentPage === 'register' && (
        <Register 
          onRegister={handleLogin} 
          onSwitchToLogin={() => setCurrentPage('login')} 
        />
      )}
      
      {currentPage === 'dashboard' && (
        <Dashboard 
          user={user} 
          onNavigateToMessages={() => setCurrentPage('messages')} 
        />
      )}
      
      {currentPage === 'messages' && (
        <MessagePage 
          user={user} 
          onBackToDashboard={() => setCurrentPage('dashboard')} 
        />
      )}
    </div>
  );
};

export default App;