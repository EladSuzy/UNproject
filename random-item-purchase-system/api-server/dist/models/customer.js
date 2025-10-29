"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const crypto_1 = require("crypto");
class Customer {
    constructor(data) {
        this.id = data.id || (0, crypto_1.randomUUID)();
        this.username = data.username || '';
        this.email = data.email || '';
        this.createdAt = data.createdAt || new Date();
    }
}
exports.Customer = Customer;
