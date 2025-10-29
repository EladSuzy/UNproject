import express from 'express';
import customerRoutes from './routes/customerRoutes';

export const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', customerRoutes);

// Start Server (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Web Server running on http://localhost:${PORT}`);
  });
}
