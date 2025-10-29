"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const customer_1 = require("../models/customer");
const purchase_1 = require("../models/purchase");
class CustomerService {
    constructor() {
        this.customers = [];
    }
    addCustomer(customerData) {
        const newCustomer = new customer_1.Customer(customerData);
        this.customers.push(newCustomer);
        return newCustomer;
    }
    fetchCustomers() {
        return this.customers;
    }
    getCustomerById(customerId) {
        return this.customers.find(customer => customer.id === customerId);
    }
    // Fetch all purchases for a specific user
    async getUserPurchases(userId) {
        return await purchase_1.Purchase.find({ userId });
    }
}
exports.CustomerService = CustomerService;
