import express from 'express';
import customerRoutes from './routes/customerRoutes';

const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', customerRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Web Server running on http://localhost:${PORT}`);
});
