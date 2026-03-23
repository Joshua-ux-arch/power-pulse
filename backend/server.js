const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const reportRoutes = require('./routes/reports');
const areaRoutes = require('./routes/areas');

const app = express();
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use(cors({
  origin: (origin, cb) => {
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:3000',
    ];
    if (!origin || allowed.includes(origin)) return cb(null, true);
    cb(new Error('CORS blocked'));
  },
  methods: ['GET', 'POST', 'PATCH'],
  allowedHeaders: ['Content-Type'],
}));

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 15,
  message: { error: 'Too many requests. Wait 5 minutes.' },
  keyGenerator: (req) => req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress,
});

app.use('/api/reports', limiter);
app.use('/api/reports', reportRoutes);
app.use('/api/areas', areaRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => res.status(500).json({ error: 'Server error' }));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
  })
  .catch(err => { console.error('❌', err.message); process.exit(1); });
