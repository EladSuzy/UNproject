"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishPurchase = void 0;
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    clientId: 'web-server',
    brokers: ['kafka:9092'],
});
const producer = kafka.producer();
const publishPurchase = (purchaseData) => __awaiter(void 0, void 0, void 0, function* () {
    yield producer.connect();
    yield producer.send({
        topic: 'USER_PURCHASES',
        messages: [{ value: JSON.stringify(purchaseData) }],
    });
    console.log('Purchase published to Kafka:', purchaseData);
});
exports.publishPurchase = publishPurchase;
