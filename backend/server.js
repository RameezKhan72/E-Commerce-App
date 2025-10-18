const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// --- Database Connection ---
const MONGO_URI = 'mongodb://127.0.0.1:27017/ecommerce';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


// --- Middlewares ---
app.use(cors());
app.use(express.json());

// Serve static files (like profile pictures) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- Define Routes ---
app.use('/api', require('./routes/api'));


// --- Start the Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

