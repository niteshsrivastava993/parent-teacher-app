import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MessagePage = ({ user, onBackToDashboard }) => {
  const [users, setUsers] = useState([]);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('compose');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    receiverId: '',
    subject: '',
    content: ''
  });

  useEffect(() => {
    fetchUsers();
    fetchMessages();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.get('http://localhost:5000/api/messages/users', config);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.post('http://localhost:5000/api/messages/send', formData, config);
      setMessage('Message sent successfully!');
      setFormData({ receiverId: '', subject: '', content: '' });
      fetchMessages(); // refresh message lists
    } catch (error) {
      setMessage('Error sending message');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const styles = {
    container: { maxWidth: '1000px', margin: '0 auto' },
    backButton: {
      backgroundColor: '#95a5a6',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginBottom: '20px'
    },
    tabs: { display: 'flex', marginBottom: '20px' },
    tab: {
      padding: '10px 20px',
      border: 'none',
      backgroundColor: '#ecf0f1',
      cursor: 'pointer',
      marginRight: '5px',
      borderRadius: '4px 4px 0 0'
    },
    activeTab: { backgroundColor: '#3498db', color: 'white' },
    card: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    input: {
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '1rem'
    },
    textarea: {
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '1rem',
      minHeight: '120px',
      resize: 'vertical'
    },
    button: {
      padding: '0.75rem',
      backgroundColor: '#27ae60',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer'
    },
    messageItem: {
      padding: '15px',
      borderBottom: '1px solid #eee',
      marginBottom: '10px'
    },
    messageTitle: { fontWeight: 'bold', marginBottom: '5px' },
    messageContent: { marginBottom: '10px', lineHeight: '1.4' },
    messageInfo: { fontSize: '0.9rem', color: '#666' },
    feedback: {
      marginBottom: '1rem',
      color: 'green',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={onBackToDashboard} style={styles.backButton}>
        ← Back to Dashboard
      </button>

      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('compose')}
          style={{
            ...styles.tab,
            ...(activeTab === 'compose' ? styles.activeTab : {})
          }}
        >
          ✍️ Compose
        </button>
        <button
          onClick={() => setActiveTab('received')}
          style={{
            ...styles.tab,
            ...(activeTab === 'received' ? styles.activeTab : {})
          }}
        >
          📨 Received ({receivedMessages.length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          style={{
            ...styles.tab,
            ...(activeTab === 'sent' ? styles.activeTab : {})
          }}
        >
          📤 Sent ({sentMessages.length})
        </button>
      </div>

      <div style={styles.card}>
        {activeTab === 'compose' && (
          <div>
            <h3>Compose New Message</h3>
            {message && <div style={styles.feedback}>{message}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
              <select
                name="receiverId"
                value={formData.receiverId}
                onChange={handleChange}
                required
                style={styles.input}
              >
                <option value="">Select recipient...</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.role}) - {u.email}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <textarea
                name="content"
                placeholder="Message content..."
                value={formData.content}
                onChange={handleChange}
                required
                style={styles.textarea}
              />

              <button type="submit" disabled={loading} style={styles.button}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'received' && (
          <div>
            <h3>Received Messages</h3>
            {receivedMessages.length === 0 ? (
              <p>No messages received yet.</p>
            ) : (
              receivedMessages.map((msg) => (
                <div key={msg._id} style={styles.messageItem}>
                  <div style={styles.messageTitle}>{msg.subject}</div>
                  <div style={styles.messageContent}>{msg.content}</div>
                  <div style={styles.messageInfo}>
                    From: {msg.sender.name} ({msg.sender.role}) - {msg.sender.email}
                  </div>
                  <div style={styles.messageInfo}>
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'sent' && (
          <div>
            <h3>Sent Messages</h3>
            {sentMessages.length === 0 ? (
              <p>No messages sent yet.</p>
            ) : (
              sentMessages.map((msg) => (
                <div key={msg._id} style={styles.messageItem}>
                  <div style={styles.messageTitle}>{msg.subject}</div>
                  <div style={styles.messageContent}>{msg.content}</div>
                  <div style={styles.messageInfo}>
                    To: {msg.receiver.name} ({msg.receiver.role}) - {msg.receiver.email}
                  </div>
                  <div style={styles.messageInfo}>
                    {new Date(msg.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
