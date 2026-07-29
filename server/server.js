const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://*.vercel.app', 'https://*.vercel.app/'],
  credentials: true
}));
app.use(express.json({ limit: '100kb' })); // Allows the app to parse JSON from client requests

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/data', require('./routes/data'));
app.use('/api/chat', require('./routes/chat')); // <--- NEW ROUTE


// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
