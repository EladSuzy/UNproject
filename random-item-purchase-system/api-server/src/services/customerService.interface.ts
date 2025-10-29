export interface CustomerServiceInterface {
    getUserPurchases(userId: string): Promise<any[]>;
    getCustomerById(customerId: string): Promise<any>;
}
