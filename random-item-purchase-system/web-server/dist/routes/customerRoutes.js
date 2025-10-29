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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const kafkaProducer_1 = require("../services/kafkaProducer");
const router = express_1.default.Router();
// Buy route
router.post('/buy', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield (0, kafkaProducer_1.publishPurchase)(purchaseData);
        res.status(200).json({ message: 'Purchase request sent successfully' });
    }
    catch (error) {
        console.error('Error publishing purchase:', error);
        res.status(500).json({ error: 'Failed to process purchase' });
    }
}));
// Get all purchases for a user
router.get('/user/:userId/purchases', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const response = yield axios_1.default.get(`http://api-server:3000/api/purchases?userId=${userId}`);
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error('Error fetching user purchases:', error);
        res.status(500).json({ error: 'Failed to fetch user purchases' });
    }
}));
exports.default = router;
