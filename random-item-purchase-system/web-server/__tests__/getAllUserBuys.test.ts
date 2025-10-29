import request from 'supertest';
import axios from 'axios';
import { app } from '../src/index';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Kafka producer
jest.mock('../src/services/kafkaProducer', () => ({
  publishPurchase: jest.fn(),
}));

describe('GET /api/getAllUserBuys/:userId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return purchases from API server', async () => {
    const mockPurchases = [
      {
        _id: '1',
        userId: '123',
        username: 'alice',
        price: 9.99,
        timestamp: new Date(),
      },
    ];

    mockedAxios.get.mockResolvedValue({
      data: mockPurchases,
      status: 200,
    } as any);

    const response = await request(app).get('/api/getAllUserBuys/123');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(1);
    expect(mockedAxios.get).toHaveBeenCalledWith('http://api-server:3000/api/purchases/123');
  });

  it('should return 500 when API server call fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API server error'));

    const response = await request(app).get('/api/getAllUserBuys/123');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Failed to fetch user purchases');
  });
});

