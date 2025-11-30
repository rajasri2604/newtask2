require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// CORS setup - allow local dev and deployed frontend
app.use(cors({
  origin: [
    'http://localhost:3000', // for local React dev
    'https://task2-employee-attendance-system-m6.vercel.app' // your deployed frontend
  ],
  credentials: true,
}));

// Body parser
app.use(express.json());

// connect to DB
connectDB(process.env.MONGO_URI);

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/dashboard', require('./routes/dashboard'));

// test route
app.get('/', (req, res) => {
  res.send('Attendance API running');
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
