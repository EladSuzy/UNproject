"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const customerService_1 = require("../services/customerService");
class CustomerController {
    constructor() {
        this.customerService = new customerService_1.CustomerService();
    }
    async getPurchases(req, res) {
        const { userId } = req.query;
        try {
            const purchases = await this.customerService.getUserPurchases(userId);
            res.json(purchases);
        }
        catch (error) {
            console.error('Error fetching purchases:', error);
            res.status(500).json({ error: 'Failed to fetch purchases' });
        }
    }
    async getCustomer(req, res) {
        const { customerId } = req.params;
        try {
            const customer = this.customerService.getCustomerById(customerId);
            if (customer) {
                res.json(customer);
            }
            else {
                res.status(404).json({ error: 'Customer not found' });
            }
        }
        catch (error) {
            console.error('Error fetching customer:', error);
            res.status(500).json({ error: 'Failed to fetch customer' });
        }
    }
}
exports.CustomerController = CustomerController;
