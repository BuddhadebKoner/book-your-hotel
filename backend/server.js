import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Import database connection
import connectDB, { getDBStatus } from './src/config/database.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Trust proxy for rate limiting (if behind proxy/load balancer)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({
   contentSecurityPolicy: {
      directives: {
         defaultSrc: ["'self'"],
         styleSrc: ["'self'", "'unsafe-inline'"],
         scriptSrc: ["'self'"],
         imgSrc: ["'self'", "data:", "https:"],
      },
   },
}));

// Rate limiting
const limiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutes
   max: 100, // limit each IP to 100 requests per windowMs
   message: 'Too many requests from this IP, please try again later.',
   standardHeaders: true,
   legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
   origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:3000', // For testing
   ],
   credentials: true,
   optionsSuccessStatus: 200,
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
   allowedHeaders: ['Content-Type', 'Authorization', 'x-clerk-auth-token'],
};
app.use(cors(corsOptions));

// Body parsing middleware
// Note: Large file uploads are handled by multer with memory storage
// These limits are for JSON/form data only
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
// Temporarily disabled due to Express 5 compatibility issue
// app.use(mongoSanitize());

// Manual sanitization function as alternative
const sanitizeObject = (obj) => {
   if (obj && typeof obj === 'object') {
      for (let key in obj) {
         if (typeof key === 'string' && key.startsWith('$')) {
            delete obj[key];
         } else if (typeof obj[key] === 'object') {
            sanitizeObject(obj[key]);
         }
      }
   }
};

// Custom sanitization middleware
app.use((req, res, next) => {
   sanitizeObject(req.body);
   sanitizeObject(req.query);
   sanitizeObject(req.params);
   next();
});

// Prevent parameter pollution
app.use(hpp());


// HTTP request logger
if (process.env.NODE_ENV === 'development') {
   app.use(morgan('combined'));
}

// Health check endpoint
app.get('/', (req, res) => {
   const dbStatus = getDBStatus();
   res.status(200).json({
      success: true,
      message: 'Server is running!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: {
         isConnected: dbStatus.isConnected,
         readyState: dbStatus.readyState,
         host: dbStatus.host,
         database: dbStatus.databaseName,
      },
   });
});

// Mount routes


// Global error handler
app.use((err, req, res, next) => {
   console.error(err.stack);

   // Default error
   let error = { ...err };
   error.message = err.message;

   // Mongoose bad ObjectId
   if (err.name === 'CastError') {
      const message = 'Resource not found';
      error = { message, statusCode: 404 };
   }

   // Mongoose duplicate key
   if (err.code === 11000) {
      const message = 'Duplicate field value entered';
      error = { message, statusCode: 400 };
   }

   // Mongoose validation error
   if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message);
      error = { message, statusCode: 400 };
   }

   res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error'
   });
});

// Handle 404 routes
app.use((req, res) => {
   res.status(404).json({
      success: false,
      message: 'Route not found'
   });
});

const PORT = process.env.PORT || 3000;

// Start server function
const startServer = async () => {
   try {
      // Connect to database
      await connectDB();

      // Start listening
      const server = app.listen(PORT, () => {
         console.log(`Server running on port ${PORT}`);
      });

      // Set server timeout to 6 minutes for large file uploads (increased for production)
      // This accounts for:
      // - File upload time (network)
      // - Google Drive processing
      // - Database operations
      server.timeout = 360000; // 6 minutes
      server.keepAliveTimeout = 360000; // 6 minutes
      server.headersTimeout = 370000; // Slightly higher than keepAliveTimeout
      server.requestTimeout = 360000; // 6 minutes for individual requests

      return server;
   } catch (error) {
      console.error('Failed to start server:', error.message);
      if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
         process.exit(1);
      }
   }
};

// Start the server
let serverInstance;
startServer().then(server => {
   serverInstance = server;
}).catch(error => {
   console.error('Failed to start server:', error);
   process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
   console.error('Unhandled Rejection:', err);
   if (serverInstance) {
      serverInstance.close(() => {
         process.exit(1);
      });
   } else {
      process.exit(1);
   }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
   console.error('Uncaught Exception:', err);
   process.exit(1);
});

export default app;