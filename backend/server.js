const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ CORS Configuration (Production Safe)
const allowedOrigins = [
  "http://localhost:3000",
  "https://academic-resilience-assessment-system-7ivblh3n0.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use(express.json());


// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));


// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/assessment', require('./routes/assessment'));
app.use('/api/scenario', require('./routes/scenario'));
app.use('/api/ai-support', require('./routes/aiSupport'));


// ✅ Test Route
app.get('/', (req, res) => {
  res.send("Academic Resilience API is running...");
});


// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});


// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});