import { Customer } from '../models/customer';
import { Purchase } from '../models/purchase';

export class CustomerService {
    private customers: Customer[] = [];

    public addCustomer(customerData: Partial<Customer>): Customer {
        const newCustomer = new Customer(customerData);
        this.customers.push(newCustomer);
        return newCustomer;
    }

    public fetchCustomers(): Customer[] {
        return this.customers;
    }

    public getCustomerById(customerId: string): Customer | undefined {
        return this.customers.find(customer => customer.id === customerId);
    }

    // Fetch all purchases for a specific user
    public async getUserPurchases(userId: string): Promise<ReturnType<typeof Purchase.find>> {
        return await Purchase.find({ userId });
    }
}
