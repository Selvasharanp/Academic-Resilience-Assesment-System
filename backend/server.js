const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize the app
const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://academic-resilience-assessment-system-7ivblh3n0.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("CORS not allowed"), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.options("*", cors()); // handle preflight requests
app.use(express.json()); // Parses incoming JSON requests

// 1. Database Connection
// Ensure you have MONGO_URI in your .env file
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// 2. Import Route Files
const authRoutes = require('./routes/auth');
const assessmentRoutes = require('./routes/assessment');

// 3. Use Routes
// This maps your route files to specific URL paths
app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/scenario', require('./routes/scenario'));
app.use('/api/ai-support', require('./routes/aiSupport')); 

// 4. Base Route for Testing
app.get('/', (req, res) => {
    res.send("Academic Resilience API is running...");
});

// 5. Global Error Handler (Optional but recommended)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong on the server!' });
});

// 6. Define Port and Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});