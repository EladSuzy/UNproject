import { Kafka } from 'kafkajs';
import { Purchase } from '../models/purchase';

const kafka = new Kafka({
  clientId: 'api-server',
  brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'purchase-group' });

export const consumeMessages = async () => {
  await consumer.connect();
  // do we need to remove the fromBeginning?
  await consumer.subscribe({ topic: 'USER_PURCHASES', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (message.value) {
        const purchaseData = JSON.parse(message.value.toString());
        const purchase = new Purchase(purchaseData);
        await purchase.save();
        console.log('Purchase saved:', purchase);
      }
    },
  });
};
