// utilities/schemas.js
const Joi = require("joi");

// Event schema
const eventSchema = Joi.object({
  eventName: Joi.string().required(),
  venueId: Joi.string().length(24).required(),
  startDate: Joi.string().isoDate().allow(null, ""), // allow string dates like "2025-09-01"
  endDate: Joi.string().isoDate().allow(null, ""),
  startTime: Joi.string().allow(null, ""),
  endTime: Joi.string().allow(null, ""),
  capacity: Joi.number().integer().min(0).optional(),
  eventType: Joi.string().optional(),
  eventPrice: Joi.number().precision(2).optional()
});

// Ticket schema
const ticketSchema = Joi.object({
  customerId: Joi.string().length(24).required(),
  eventId: Joi.string().length(24).required(),
  ticketStatus: Joi.string().valid("active", "used", "cancelled").optional().default("active"),
  amountPaid: Joi.number().precision(2).optional().default(0),
  purchaseDate: Joi.date().iso().optional(),
  paymentMethod: Joi.string().optional().allow("", null)
});

module.exports = {
  eventSchema,
  ticketSchema
};
