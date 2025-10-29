import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'web-server',
  brokers: ['kafka:9092'],
});

const producer = kafka.producer();

export const publishPurchase = async (purchaseData: {
  username: string;
  userId: string;
  price: number;
  timestamp: string;
}) => {
  await producer.connect();
  await producer.send({
    topic: 'USER_PURCHASES',
    messages: [{ value: JSON.stringify(purchaseData) }],
  });
  console.log('Purchase published to Kafka:', purchaseData);
};
