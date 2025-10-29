import { Request, Response } from 'express';
import axios from 'axios';
import { CustomerService } from '../services/customerService';

export class CustomerController {
    private customerService: CustomerService;

    constructor() {
        this.customerService = new CustomerService();
    }

    public async getAllPurchases(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;

        try {
            const response = await axios.get(
                `http://api-server:3000/api/purchases?userId=${userId}`
            );
            res.status(200).json(response.data);
        } catch (error) {
            console.error('Error fetching user purchases:', error);
            res.status(500).json({ error: 'Failed to fetch user purchases' });
        }
    }
}
