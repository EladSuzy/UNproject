import express from 'express';
import { Purchase } from '../models/purchase';

const router = express.Router();

// Get all purchases for a user
router.get('/purchases/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const purchases = await Purchase.find({ userId });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
});

export default router;
