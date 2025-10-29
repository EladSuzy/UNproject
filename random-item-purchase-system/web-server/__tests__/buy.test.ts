import request from 'supertest';
import { app } from '../src/index';
import { publishPurchase } from '../src/services/kafkaProducer';

// Mock Kafka producer
jest.mock('../src/services/kafkaProducer', () => ({
  publishPurchase: jest.fn(),
}));

// Mock axios for API calls
jest.mock('axios', () => ({
  get: jest.fn(),
}));

const mockPublishPurchase = publishPurchase as jest.MockedFunction<typeof publishPurchase>;

describe('POST /api/buy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 with success message for valid purchase', async () => {
    mockPublishPurchase.mockResolvedValue(undefined);

    const purchaseData = {
      username: 'alice',
      userId: '123',
      price: 9.99,
    };

    const response = await request(app)
      .post('/api/buy')
      .send(purchaseData)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Purchase request sent successfully');
    expect(mockPublishPurchase).toHaveBeenCalledTimes(1);
    expect(mockPublishPurchase).toHaveBeenCalledWith(
      expect.objectContaining({
        username: 'alice',
        userId: '123',
        price: 9.99,
        timestamp: expect.any(String),
      })
    );
  });

  it('should return 400 when username is missing', async () => {
    const response = await request(app)
      .post('/api/buy')
      .send({
        userId: '123',
        price: 9.99,
      })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields');
    expect(mockPublishPurchase).not.toHaveBeenCalled();
  });

  it('should return 400 when userId is missing', async () => {
    const response = await request(app)
      .post('/api/buy')
      .send({
        username: 'alice',
        price: 9.99,
      })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields');
    expect(mockPublishPurchase).not.toHaveBeenCalled();
  });

  it('should return 400 when price is missing', async () => {
    const response = await request(app)
      .post('/api/buy')
      .send({
        username: 'alice',
        userId: '123',
      })
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields');
    expect(mockPublishPurchase).not.toHaveBeenCalled();
  });

  it('should return 500 when Kafka publish fails', async () => {
    mockPublishPurchase.mockRejectedValue(new Error('Kafka connection failed'));

    const purchaseData = {
      username: 'alice',
      userId: '123',
      price: 9.99,
    };

    const response = await request(app)
      .post('/api/buy')
      .send(purchaseData)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Failed to process purchase');
  });
});

