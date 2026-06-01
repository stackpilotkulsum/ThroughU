const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const dotenv   = require('dotenv');
const morgan   = require('morgan');

dotenv.config();
const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/donors',    require('./routes/donors'));
app.use('/api/blood',     require('./routes/blood'));
app.use('/api/organs',    require('./routes/organs'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/users',     require('./routes/users'));
app.use('/api/seed',      require('./routes/seed'));

// ── Health check ────────────────────────────────────────────
app.get('/', (req, res) =>
  res.json({ message: '🩸 ThroughU API v1.0 running', status: 'ok' })
);

// ── Global error handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// ── Connect DB & start ──────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create({
        binary: { version: '7.0.14' }
      });
      mongoUri = mongoServer.getUri();
      console.log('⚠️ Using In-Memory MongoDB (No external database connection required!)');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');
    
    app.listen(PORT, () => console.log(`🚀 Server → http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ DB Error:', err.message);
    process.exit(1);
  }
};

startServer();
