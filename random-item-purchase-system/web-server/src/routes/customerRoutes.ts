import express from 'express';
import axios from 'axios';
import { publishPurchase } from '../services/kafkaProducer';

const router = express.Router();

// Buy route
router.post('/buy', async (req, res) => {
  const { username, userId, price } = req.body;

  if (!username || !userId || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const purchaseData = {
    username,
    userId,
    price,
    timestamp: new Date().toISOString(),
  };

  try {
    await publishPurchase(purchaseData);
    res.status(200).json({ message: 'Purchase request sent successfully' });
  } catch (error) {
    console.error('Error publishing purchase:', error);
    res.status(500).json({ error: 'Failed to process purchase' });
  }
});

// Get all purchases for a user
router.get('/getAllUserBuys/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const response = await axios.get(
      `http://api-server:3000/api/purchases/${userId}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    res.status(500).json({ error: 'Failed to fetch user purchases' });
  }
});

export default router;
