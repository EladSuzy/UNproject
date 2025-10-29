"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeMessages = void 0;
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    clientId: 'api-server',
    brokers: ['kafka:9092'],
});
const consumer = kafka.consumer({ groupId: 'purchase-group' });
const consumeMessages = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'USER_PURCHASES', fromBeginning: true });
    // await consumer.run({
    //   eachMessage: async ({ message }) => {
    //     if (message.value) {
    //       const purchaseData = JSON.parse(message.value.toString());
    //       const purchase = new Purchase(purchaseData);
    //       await purchase.save();
    //       console.log('Purchase saved:', purchase);
    //     }
    //   },
    // });
};
exports.consumeMessages = consumeMessages;
