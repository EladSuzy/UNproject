"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purchase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const purchaseSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true },
    userId: { type: String, required: true },
    price: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});
exports.Purchase = mongoose_1.default.model('Purchase', purchaseSchema);
