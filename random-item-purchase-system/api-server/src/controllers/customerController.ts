import { Request, Response } from 'express';
import { CustomerService } from '../services/customerService';
import { Purchase } from '../models/purchase';

export class CustomerController {
    private customerService: CustomerService;

    constructor() {
        this.customerService = new CustomerService();
    }

    public async getPurchases(req: Request, res: Response): Promise<void> {
        const { userId } = req.query;

        try {
            const purchases = await this.customerService.getUserPurchases(userId as string);
            res.json(purchases);
        } catch (error) {
            console.error('Error fetching purchases:', error);
            res.status(500).json({ error: 'Failed to fetch purchases' });
        }
    }

    public async getCustomer(req: Request, res: Response): Promise<void> {
        const { customerId } = req.params;

        try {
            const customer = this.customerService.getCustomerById(customerId);
            if (customer) {
                res.json(customer);
            } else {
                res.status(404).json({ error: 'Customer not found' });
            }
        } catch (error) {
            console.error('Error fetching customer:', error);
            res.status(500).json({ error: 'Failed to fetch customer' });
        }
    }
}
