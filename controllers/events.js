const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

// Helper function to validate ObjectId
const isInvalidObjectId = (id) => !ObjectId.isValid(id);

// Get all events
const getAll = (req, res) => {
  try {
    mongodb
      .getDb()
      .db()
      .collection("events")
      .find()
      .toArray((err, lists) => {
        if (err) {
          return res.status(400).json({ message: err });
        }
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(lists);
      });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching events." });
  }
};

// Get single event by ID
const getSingle = (req, res) => {
  try {
    if (isInvalidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID." });
    }
    const eventId = new ObjectId(req.params.id);
    mongodb
      .getDb()
      .db()
      .collection("events")
      .find({ _id: eventId })
      .toArray((err, lists) => {
        if (err) {
          return res.status(400).json({ message: err });
        }
        if (lists.length === 0) {
          return res.status(404).json({ message: "Event not found" });
        }
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(lists[0]);
      });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching the event." });
  }
};

// Create new event
const createEvent = async (req, res) => {
  try {
    const {
      eventName,
      venueId,
      startDate,
      endDate,
      startTime,
      endTime,
      capacity,
      eventType,
      eventPrice
    } = req.body;

    if (!eventName || !venueId) {
      return res.status(400).json({ message: "Missing required fields: eventName, venueId" });
    }

    const event = {
      eventName,
      venueId,
      startDate,
      endDate,
      startTime,
      endTime,
      capacity,
      eventType,
      eventPrice
    };

    const response = await mongodb.getDb().db().collection("events").insertOne(event);

    if (response.acknowledged) {
      res.status(201).json({
        message: "Event created successfully.",
        event: { _id: response.insertedId, ...event }
      });
    } else {
      res.status(500).json({ message: "Some error occurred while creating the event." });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while creating the event." });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    if (isInvalidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID." });
    }
    const eventId = new ObjectId(req.params.id);

    const {
      eventName,
      venueId,
      startDate,
      endDate,
      startTime,
      endTime,
      capacity,
      eventType,
      eventPrice
    } = req.body;

    const event = {
      eventName,
      venueId,
      startDate,
      endDate,
      startTime,
      endTime,
      capacity,
      eventType,
      eventPrice
    };

    const response = await mongodb.getDb().db().collection("events").replaceOne({ _id: eventId }, event);

    if (response.modifiedCount > 0) {
      res.status(200).json({ message: "Event updated successfully.", ...event });
    } else {
      res.status(404).json({ message: "Event not found or no change made." });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while updating the event." });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    if (isInvalidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID." });
    }
    const eventId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection("events").deleteOne({ _id: eventId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: "Event deleted successfully." });
    } else {
      res.status(404).json({ message: "Event not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred while deleting the event." });
  }
};

module.exports = {
  getAll,
  getSingle,
  createEvent,
  updateEvent,
  deleteEvent
};
