import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import authRoutes from './routes/authRoutes.js';
import shipmentRoutes from './routes/shipmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import contactRoutes from './routes/contactRoutes.js';
import rateRoutes from './routes/rateRoutes.js';
import { createCorsOriginValidator } from './utils/corsOrigin.js';

const app = express();

// PHASE 24 - Render needs trust proxy
app.set('trust proxy', 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

const allowedOrigins = new Set([
  'https://g71logistics.com',
  'https://www.g71logistics.com',
]);

if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.add('http://localhost:5173');
  allowedOrigins.add('http://localhost:3000');
}

if (process.env.FRONTEND_URL?.trim()) {
  allowedOrigins.add(new URL(process.env.FRONTEND_URL.trim()).origin);
}

app.use(
  cors({
    origin: createCorsOriginValidator(allowedOrigins),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use('/api', generalLimiter);

app.get('/', (req, res) =>
  res.json({
    status: 'success',
    message: 'G71 Logistics API - Phase 24 Deploy Ready',
    version: '2.1.0',
    env: process.env.NODE_ENV,
  }),
);

// Render health check needs /health and /api/health
app.get('/health', (req, res) =>
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  }),
);
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', uptime: process.uptime() }),
);

app.use('/api/rates', rateRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/contact', contactRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
