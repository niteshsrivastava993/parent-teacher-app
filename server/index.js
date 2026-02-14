const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const authRoutes = require('./authRoutes');
const messageRoutes = require('./messageRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Parent-Teacher Communication API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});