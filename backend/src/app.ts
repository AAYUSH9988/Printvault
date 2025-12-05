import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config/index.js';
import { resourceRoutes } from './routes/index.js';
import adminRoutes from './routes/adminRoutes.js';

/**
 * Create and configure Express application
 */
export function createApp(): Express {
  const app = express();

  // CORS configuration
  app.use(cors({
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));

  // Parse cookies
  app.use(cookieParser());

  // Parse JSON bodies
  app.use(express.json());

  // Parse URL-encoded bodies
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Printvault API is running',
      timestamp: new Date().toISOString(),
    });
  });

  // API info endpoint
  app.get('/api', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      name: 'Printvault API',
      version: '1.0.0',
      description: 'Free print resources library API by Jalaram Cards',
      endpoints: {
        resources: '/api/resources',
        categories: '/api/resources/categories',
        tags: '/api/resources/tags',
        featured: '/api/resources/featured',
        admin: '/api/admin',
      },
    });
  });

  // Mount routes
  app.use('/api/resources', resourceRoutes);
  app.use('/api/admin', adminRoutes);

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: 'Endpoint not found',
    });
  });

  // Global error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      success: false,
      error: config.nodeEnv === 'development' ? err.message : 'Internal server error',
    });
  });

  return app;
}

export default createApp;
