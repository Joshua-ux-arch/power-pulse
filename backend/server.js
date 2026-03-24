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

// CORS - allow everything, no restrictions
app.use(cors());
app.options('*', cors());

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: { error: 'Too many requests. Wait 5 minutes.' },
});

app.use('/api/reports', limiter);
app.use('/api/reports', reportRoutes);
app.use('/api/areas', areaRoutes);

app.get('/', (req, res) => res.json({ message: 'PowerPulse API is running ⚡' }));
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
  })
  .catch(err => { console.error('❌ MongoDB error:', err.message); process.exit(1); });
