const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

// Helper to check ObjectId
const isInvalidObjectId = (id) => !ObjectId.isValid(id);

// Mark ticket as used
const markTicketAsUsed = async (req, res) => {
  try {
    if (isInvalidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Ticket ID" });
    }
    const ticketId = new ObjectId(req.params.id);
    const db = mongodb.getDb().db();

    const ticket = await db.collection("tickets").findOne({ _id: ticketId });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    if (ticket.ticketStatus === "used") {
      return res.status(400).json({ message: "Ticket has already been used" });
    }

    const result = await db
      .collection("tickets")
      .updateOne({ _id: ticketId }, { $set: { ticketStatus: "used" } });

    if (result.modifiedCount > 0) {
      return res.status(200).json({ message: "Ticket marked as used" });
    }
    return res.status(500).json({ message: "Error updating ticket status" });
  } catch (err) {
    console.error("Error in markTicketAsUsed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all tickets
const getAll = async (req, res) => {
  try {
    const db = mongodb.getDb().db();
    const tickets = await db.collection("tickets").find().toArray();
    res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tickets" });
  }
};

// Get single ticket
const getSingle = async (req, res) => {
  try {
    if (isInvalidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Ticket ID" });
    }
    const ticketId = new ObjectId(req.params.id);
    const db = mongodb.getDb().db();
    const ticket = await db.collection("tickets").findOne({ _id: ticketId });
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.status(200).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching ticket" });
  }
};

// Create ticket
const createTicket = async (req, res) => {
  try {
    // Basic field extraction
    let { customerId, eventId, ticketStatus, amountPaid, purchaseDate, paymentMethod } = req.body;

    // Required fields check
    if (!customerId || !eventId) {
      return res.status(400).json({ message: "customerId and eventId are required" });
    }

    if (isInvalidObjectId(customerId) || isInvalidObjectId(eventId)) {
      return res.status(400).json({ message: "customerId or eventId is not a valid ObjectId" });
    }

    // Convert to ObjectId for storage (optional but recommended)
    customerId = new ObjectId(customerId);
    eventId = new ObjectId(eventId);

    // Defaults
    ticketStatus = ticketStatus || "active";
    purchaseDate = purchaseDate ? new Date(purchaseDate) : new Date();

    const ticketObj = {
      customerId,
      eventId,
      ticketStatus,
      amountPaid: amountPaid ?? 0,
      purchaseDate,
      paymentMethod: paymentMethod || null,
    };

    const db = mongodb.getDb().db();
    const response = await db.collection("tickets").insertOne(ticketObj);

    if (response.acknowledged) {
      // return inserted document id as string for client convenience
      res.status(201).json({ _id: response.insertedId.toString(), ...ticketObj });
    } else {
      res.status(500).json({ message: "Error creating ticket" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update ticket (full replace)
const updateTicket = async (req, res) => {
  try {
    if (isInvalidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Ticket ID" });
    }
    const ticketId = new ObjectId(req.params.id);

    let { customerId, eventId, ticketStatus, amountPaid, purchaseDate, paymentMethod } = req.body;

    if (!customerId || !eventId) {
      return res.status(400).json({ message: "customerId and eventId are required" });
    }
    if (isInvalidObjectId(customerId) || isInvalidObjectId(eventId)) {
      return res.status(400).json({ message: "customerId or eventId is not a valid ObjectId" });
    }

    customerId = new ObjectId(customerId);
    eventId = new ObjectId(eventId);
    purchaseDate = purchaseDate ? new Date(purchaseDate) : new Date();

    const updateDoc = { customerId, eventId, ticketStatus: ticketStatus || "active", amountPaid: amountPaid ?? 0, purchaseDate, paymentMethod: paymentMethod || null };

    const db = mongodb.getDb().db();
    const result = await db.collection("tickets").replaceOne({ _id: ticketId }, updateDoc);

    if (result.modifiedCount > 0) {
      res.status(200).json({ _id: req.params.id, ...updateDoc });
    } else {
      res.status(404).json({ message: "Ticket not found or no change" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete ticket
const deleteTicket = async (req, res) => {
  try {
    if (isInvalidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Ticket ID" });
    }
    const ticketId = new ObjectId(req.params.id);
    const db = mongodb.getDb().db();
    const result = await db.collection("tickets").deleteOne({ _id: ticketId });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Ticket deleted" });
    } else {
      res.status(404).json({ message: "Ticket not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  markTicketAsUsed,
  getAll,
  getSingle,
  createTicket,
  updateTicket,
  deleteTicket,
};
