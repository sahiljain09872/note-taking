require('dotenv').config(); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Apply CORS middleware globally and with logging
app.use(cors((req, callback) => {
  console.log('CORS Request Origin:', req.headers.origin);
  // Allow all origins for now (origin: true)
  callback(null, { origin: true });
}));


app.use(express.json()); // Middleware to parse JSON request bodies

const notesRoutes = require('./routes/notes'); 

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic Route for server health check
app.get('/', (req, res) => {
  res.send('Notes App Backend API is running!');
});

// Use notes routes for /api/notes endpoint
app.use('/api/notes', notesRoutes);

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).send('Something broke on the server!');
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});