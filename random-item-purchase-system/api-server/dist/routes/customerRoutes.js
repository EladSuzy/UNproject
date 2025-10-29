"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const purchase_1 = require("../models/purchase");
const router = express_1.default.Router();
// Get all purchases for a user
router.get('/purchases', async (req, res) => {
    const { userId } = req.query;
    try {
        const purchases = await purchase_1.Purchase.find({ userId });
        res.json(purchases);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch purchases' });
    }
});
exports.default = router;
