"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
const kafkaConsumer_1 = require("./services/kafkaConsumer");
const app = (0, express_1.default)();
const PORT = 3000;
// Middleware
app.use(express_1.default.json());
// MongoDB Connection
mongoose_1.default.connect('mongodb://mongodb:27017/purchases')
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((err) => {
    console.error('MongoDB connection error:', err);
});
// Routes
app.use('/api', customerRoutes_1.default);
// Start Kafka Consumer
(0, kafkaConsumer_1.consumeMessages)().catch((err) => console.error('Kafka Consumer Error:', err));
// Start Server
app.listen(PORT, () => {
    console.log(`API Server running on http://localhost:${PORT}`);
});
