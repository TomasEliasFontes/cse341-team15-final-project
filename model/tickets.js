// model/ticket.js
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Customer" },
  eventId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Event" },
  ticketStatus: { type: String, enum: ["active", "used", "cancelled"], default: "active" },
  amountPaid: { type: Number, default: 0 },
  purchaseDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);
