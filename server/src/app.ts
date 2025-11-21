import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Server is running' });
});

// API Routes
app.use('/api', routes);

// 404 Handler - must be after all routes
app.use(notFoundHandler);

// Error Handler - must be last
app.use(errorHandler);

export default app;
