const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./db');
const schoolRoutes = require('./routes/schoolRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', schoolRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'School Management API is running' });
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
