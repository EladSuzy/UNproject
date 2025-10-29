import { Purchase } from '../models/purchase';

export interface ICustomerService {
    getUserPurchases(userId: string): Promise<Purchase[]>;
}
