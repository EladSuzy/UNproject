import axios from 'axios';
import { Purchase } from '../models/purchase';
import type { ICustomerService } from './customerService.interface';

export class CustomerService implements ICustomerService {
    private readonly apiUrl: string;

    constructor() {
        this.apiUrl = process.env.API_SERVER_URL || 'http://api-server:3000';
    }

    public async getUserPurchases(userId: string): Promise<Purchase[]> {
        try {
            const response = await axios.get(`${this.apiUrl}/api/purchases?userId=${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user purchases:', error);
            throw error;
        }
    }
}
