const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

const UPLOADS_DIR = path.join(__dirname, '../uploads');

// asegurar carpeta uploads
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Orígenes permitidos SOLO desde env
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log('❌ CORS bloqueado para:', origin);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

// Static files
app.use('/uploads', express.static(UPLOADS_DIR, {
  fallthrough: false,
  index: false,
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
}));

// ruta de test para verificar uploads
app.get('/uploads-test', (_req, res) => {
  try {
    const files = fs.readdirSync(UPLOADS_DIR);
    res.status(200).json({
      ok: true,
      uploadsDir: UPLOADS_DIR,
      count: files.length,
      files: files.slice(0, 20),
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message,
      uploadsDir: UPLOADS_DIR,
    });
  }
});

// Health / root routes for Railway
app.get('/', (_req, res) => {
  res.status(200).send('OK');
});

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stores', require('./routes/stores'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/api/blog', require('./routes/blog'));

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on port ${PORT}`);
  console.log('✅ Allowed origins:', allowedOrigins);
  console.log('✅ Uploads dir:', UPLOADS_DIR);
});
