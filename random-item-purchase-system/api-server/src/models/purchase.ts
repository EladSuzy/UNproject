import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  username: { type: String, required: true },
  userId: { type: String, required: true },
  price: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const Purchase = mongoose.model('Purchase', purchaseSchema);
