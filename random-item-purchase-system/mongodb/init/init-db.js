# Initialize MongoDB collections and indexes

// Create collections
db.createCollection('customers');
db.createCollection('purchases');

// Create indexes for better query performance
db.purchases.createIndex({ userId: 1 });
db.purchases.createIndex({ timestamp: -1 });
db.customers.createIndex({ username: 1 }, { unique: true });
