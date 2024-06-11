// models/Campaign.js
const mongoose = require('mongoose');
const customer= require("./customer")

const campaignSchema = new mongoose.Schema({
  customers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'customer' }],
  userEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;