// model/event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  venueId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Venue" },
  startDate: { type: String }, // keeping as string per your data ("YYYY-MM-DD")
  endDate: { type: String },
  startTime: { type: String },
  endTime: { type: String },
  capacity: { type: Number },
  eventType: { type: String },
  eventPrice: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
