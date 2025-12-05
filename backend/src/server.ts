import { createApp } from './app.js';
import { connectDB } from './config/database.js';
import config from './config/index.js';

/**
 * Start the server
 */
async function startServer(): Promise<void> {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Database connected');

    // Create Express app
    const app = createApp();

    // Start listening
    app.listen(config.port, () => {
      console.log(`
╔══════════════════════════════════════════════════════════
║                                                          
║   🖨️  PRINTVAULT API SERVER                              
║                                                          
║   Status:  Running                                       
║   Port:    ${config.port}                                        
║   Mode:    ${config.nodeEnv.padEnd(11)}                          
║   CORS:    ${config.corsOrigin.substring(0, 25).padEnd(25)}      
║                                                          
║   Endpoints:                                             
║   • Health:     http://localhost:${config.port}/health            
║   • API Info:   http://localhost:${config.port}/api               
║   • Resources:  http://localhost:${config.port}/api/resources     
║                                                          
║   Made with ❤️ by Jalaram Cards, Vadodara                 
║                                                          
╚══════════════════════════════════════════════════════════
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  process.exit(0);
});

// Start the server
startServer();
