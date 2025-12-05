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

  // Home page - Simple HTML
  app.get('/', (_req: Request, res: Response) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Printvault API</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
            color: #fff;
          }
          .container {
            text-align: center;
            padding: 40px;
            max-width: 600px;
          }
          .logo {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #f43f5e, #f97316);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
            font-size: 40px;
          }
          h1 {
            font-size: 2.5rem;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #f43f5e, #f97316);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .subtitle {
            color: #94a3b8;
            font-size: 1.1rem;
            margin-bottom: 32px;
          }
          .status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.3);
            padding: 8px 16px;
            border-radius: 50px;
            color: #22c55e;
            font-size: 0.9rem;
            margin-bottom: 32px;
          }
          .dot {
            width: 8px;
            height: 8px;
            background: #22c55e;
            border-radius: 50%;
            animation: pulse 2s infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .endpoints {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 24px;
            text-align: left;
          }
          .endpoints h3 {
            color: #e2e8f0;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 16px;
          }
          .endpoint {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }
          .endpoint:last-child { border-bottom: none; }
          .method {
            background: rgba(34, 197, 94, 0.2);
            color: #22c55e;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
          }
          .path {
            color: #cbd5e1;
            font-family: monospace;
          }
          .footer {
            margin-top: 32px;
            color: #64748b;
            font-size: 0.85rem;
          }
          .footer a {
            color: #f43f5e;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🖨️</div>
          <h1>Printvault API</h1>
          <p class="subtitle">Free Print Resources Library by Jalaram Cards</p>
          
          <div class="status">
            <span class="dot"></span>
            API is running
          </div>
          
          <div class="endpoints">
            <h3>Available Endpoints</h3>
            <div class="endpoint">
              <span class="method">GET</span>
              <span class="path">/health</span>
            </div>
            <div class="endpoint">
              <span class="method">GET</span>
              <span class="path">/api</span>
            </div>
            <div class="endpoint">
              <span class="method">GET</span>
              <span class="path">/api/resources</span>
            </div>
            <div class="endpoint">
              <span class="method">GET</span>
              <span class="path">/api/resources/featured</span>
            </div>
            <div class="endpoint">
              <span class="method">GET</span>
              <span class="path">/api/resources/categories</span>
            </div>
          </div>
          
          <p class="footer">Made with ❤️ by <a href="https://jalaramcards.com">Jalaram Cards</a>, Vadodara</p>
        </div>
      </body>
      </html>
    `);
  });

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
