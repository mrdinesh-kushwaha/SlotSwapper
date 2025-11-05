const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  responder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mySlot: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  theirSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING' }
}, { timestamps: true });

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
