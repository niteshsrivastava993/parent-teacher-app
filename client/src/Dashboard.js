import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ user, onNavigateToMessages }) => {
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [receivedRes, sentRes] = await Promise.all([
        axios.get('http://localhost:5000/api/messages/received', config),
        axios.get('http://localhost:5000/api/messages/sent', config)
      ]);

      setReceivedMessages(receivedRes.data);
      setSentMessages(sentRes.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '20px'
    },
    card: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    button: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1rem',
      marginBottom: '20px'
    },
    messageItem: {
      padding: '10px',
      borderBottom: '1px solid #eee',
      marginBottom: '10px'
    },
    messageTitle: {
      fontWeight: 'bold',
      marginBottom: '5px'
    },
    messageInfo: {
      fontSize: '0.9rem',
      color: '#666'
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <button onClick={onNavigateToMessages} style={styles.button}>
        📝 Send New Message
      </button>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>📨 Received Messages ({receivedMessages.length})</h3>
          {receivedMessages.length === 0 ? (
            <p>No messages received yet.</p>
          ) : (
            receivedMessages.slice(0, 5).map((message) => (
              <div key={message._id} style={styles.messageItem}>
                <div style={styles.messageTitle}>{message.subject}</div>
                <div style={styles.messageInfo}>
                  From: {message.sender.name} ({message.sender.role})
                </div>
                <div style={styles.messageInfo}>
                  {new Date(message.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={styles.card}>
          <h3>📤 Sent Messages ({sentMessages.length})</h3>
          {sentMessages.length === 0 ? (
            <p>No messages sent yet.</p>
          ) : (
            sentMessages.slice(0, 5).map((message) => (
              <div key={message._id} style={styles.messageItem}>
                <div style={styles.messageTitle}>{message.subject}</div>
                <div style={styles.messageInfo}>
                  To: {message.receiver.name} ({message.receiver.role})
                </div>
                <div style={styles.messageInfo}>
                  {new Date(message.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;