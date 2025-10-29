import request from 'supertest';
import { app } from '../src/app';
import { Purchase } from '../src/models/purchase';

// Mock Mongoose model
jest.mock('../src/models/purchase');
// Mock Kafka consumer to avoid actual Kafka connections
jest.mock('../src/services/kafkaConsumer', () => ({
  consumeMessages: jest.fn().mockResolvedValue(undefined),
}));

const mockPurchase = Purchase as jest.Mocked<typeof Purchase>;

describe('GET /api/purchases/:userId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return purchases for a valid userId', async () => {
    const mockPurchases = [
      {
        _id: '1',
        userId: '123',
        username: 'alice',
        price: 9.99,
        timestamp: new Date(),
      },
      {
        _id: '2',
        userId: '123',
        username: 'alice',
        price: 19.99,
        timestamp: new Date(),
      },
    ];

    mockPurchase.find = jest.fn().mockResolvedValue(mockPurchases);

    const response = await request(app).get('/api/purchases/123');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty('userId', '123');
    expect(mockPurchase.find).toHaveBeenCalledWith({ userId: '123' });
  });

  it('should return empty array when no purchases found', async () => {
    mockPurchase.find = jest.fn().mockResolvedValue([]);

    const response = await request(app).get('/api/purchases/999');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(0);
  });

  it('should return 500 on database error', async () => {
    mockPurchase.find = jest.fn().mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/api/purchases/123');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Failed to fetch purchases');
  });
});

