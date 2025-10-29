import { randomUUID } from 'crypto';

export class Customer {
    public id: string;
    public username: string;
    public email: string;
    public createdAt: Date;

    constructor(data: Partial<Customer>) {
        this.id = data.id || randomUUID();
        this.username = data.username || '';
        this.email = data.email || '';
        this.createdAt = data.createdAt || new Date();
    }
}
