import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import conferenceRoutes from './routes/conferenceRoutes';
import resourceRoutes from './routes/resourceRoutes';
import adminRoutes from './routes/adminRoutes';

const app: Application = express();

// Production CORS Middleware allowing Vercel deployment URLs and localhost
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman, or same-origin Vercel requests)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin) ||
        /localhost/.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(null, true); // Permissive CORS for seamless production deployment
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Nitin Sir Academic Alerts API',
    jwtExpiresIn: 'never',
    environment: process.env.NODE_ENV || 'production',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/conferences', conferenceRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found`,
  });
});

// Global Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

export default app;
