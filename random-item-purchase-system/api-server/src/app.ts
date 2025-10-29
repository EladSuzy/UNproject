import express from 'express';
import mongoose from 'mongoose';
import customerRoutes from './routes/customerRoutes';
import { consumeMessages } from './services/kafkaConsumer';

export const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', customerRoutes);

// Skip MongoDB and Kafka in test environment
if (process.env.NODE_ENV !== 'test') {
  // MongoDB Connection
  mongoose.connect('mongodb://mongodb:27017/purchases')
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });

  // Start Kafka Consumer
  consumeMessages().catch((err) => console.error('Kafka Consumer Error:', err));

  // Start Server
  app.listen(PORT, () => {
    console.log(`API Server running on http://localhost:${PORT}`);
  });
}
