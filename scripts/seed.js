// scripts/seed.js
// Seed script using mongoose. Adjust model require paths if your folder is 'model' (singular) instead of 'models'.
require("dotenv").config();
const mongoose = require("mongoose");

// Adjust these paths if your models are in '../model/venue' etc.
const Venue = require("../model/venue");
const Customer = require("../model/customer");
const Event = require("../model/events");
const Ticket = require("../model/tickets");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🔗 Connected to MongoDB for seeding");

    // Clear existing documents
    await Venue.deleteMany({});
    await Customer.deleteMany({});
    await Event.deleteMany({});
    await Ticket.deleteMany({});
    console.log("🧹 Cleared existing collections");

    // ===== Venues =====
    const venues = [
      { venueName: "Stadium A", city: "Paris", country: "France", address: "123 Boulevard Saint-Germain", gpsCoordinates: "48.8566,2.3522" },
      { venueName: "Arena B", city: "Los Angeles", country: "USA", address: "456 Sunset Blvd", gpsCoordinates: "34.0522,-118.2437" },
      { venueName: "Concert Hall C", city: "London", country: "UK", address: "789 King's Road", gpsCoordinates: "51.5074,-0.1278" },
      { venueName: "Opera House D", city: "Sydney", country: "Australia", address: "1 Macquarie St", gpsCoordinates: "-33.8568,151.2153" },
      { venueName: "Festival Grounds E", city: "Berlin", country: "Germany", address: "101 Unter den Linden", gpsCoordinates: "52.5200,13.4050" }
    ];
    const insertedVenues = await Venue.insertMany(venues);
    console.log(`✅ Inserted ${insertedVenues.length} venues`);

    // ===== Customers =====
    const customers = [
      { firstName: "Alice", lastName: "Smith", email: "alice@example.com", phoneNumber: "123-456-7890", gender: "F" },
      { firstName: "Bob", lastName: "Johnson", email: "bob.johnson@example.com", phoneNumber: "234-567-8901", gender: "M" },
      { firstName: "Carol", lastName: "Williams", email: "carol.williams@example.com", phoneNumber: "345-678-9012", gender: "F" },
      { firstName: "Dave", lastName: "Brown", email: "dave.brown@example.com", phoneNumber: "456-789-0123", gender: "M" },
      { firstName: "Eve", lastName: "Davis", email: "eve.davis@example.com", phoneNumber: "567-890-1234", gender: "F" }
    ];
    const insertedCustomers = await Customer.insertMany(customers);
    console.log(`✅ Inserted ${insertedCustomers.length} customers`);

    // ===== Events =====
    // We create events mapping to the inserted venues by index to ensure valid venueId.
    const events = [
      { eventName: "Rock Concert", startDate: "2025-09-01", endDate: "2025-09-01", startTime: "20:00", endTime: "23:00", capacity: 5000, eventType: "Concert", eventPrice: 120, venueId: insertedVenues[0]._id },
      { eventName: "Football Match", startDate: "2025-09-10", endDate: "2025-09-10", startTime: "18:30", endTime: "21:00", capacity: 40000, eventType: "Sports", eventPrice: 75, venueId: insertedVenues[1]._id },
      { eventName: "Theater Play", startDate: "2025-09-15", endDate: "2025-09-15", startTime: "19:00", endTime: "21:30", capacity: 1200, eventType: "Theater", eventPrice: 50, venueId: insertedVenues[2]._id },
      { eventName: "Opera Night", startDate: "2025-09-20", endDate: "2025-09-20", startTime: "20:00", endTime: "23:30", capacity: 2000, eventType: "Opera", eventPrice: 90, venueId: insertedVenues[3]._id },
      { eventName: "Music Festival", startDate: "2025-09-25", endDate: "2025-09-27", startTime: "16:00", endTime: "02:00", capacity: 80000, eventType: "Festival", eventPrice: 150, venueId: insertedVenues[4]._id }
    ];
    const insertedEvents = await Event.insertMany(events);
    console.log(`✅ Inserted ${insertedEvents.length} events`);

    // ===== Tickets =====
    // We create tickets that reference insertedEvents and insertedCustomers
    const tickets = [
      { customerId: insertedCustomers[0]._id, eventId: insertedEvents[0]._id, ticketStatus: "active", amountPaid: 120, purchaseDate: new Date("2025-08-01T10:00:00Z"), paymentMethod: "Credit Card" },
      { customerId: insertedCustomers[1]._id, eventId: insertedEvents[0]._id, ticketStatus: "active", amountPaid: 120, purchaseDate: new Date("2025-08-02T15:00:00Z"), paymentMethod: "PayPal" },
      { customerId: insertedCustomers[2]._id, eventId: insertedEvents[1]._id, ticketStatus: "active", amountPaid: 75, purchaseDate: new Date("2025-08-03T09:00:00Z"), paymentMethod: "Credit Card" },
      { customerId: insertedCustomers[3]._id, eventId: insertedEvents[1]._id, ticketStatus: "used", amountPaid: 75, purchaseDate: new Date("2025-08-04T13:30:00Z"), paymentMethod: "Debit Card" },
      { customerId: insertedCustomers[4]._id, eventId: insertedEvents[2]._id, ticketStatus: "cancelled", amountPaid: 50, purchaseDate: new Date("2025-08-05T11:00:00Z"), paymentMethod: "Credit Card" },
      { customerId: insertedCustomers[2]._id, eventId: insertedEvents[2]._id, ticketStatus: "active", amountPaid: 50, purchaseDate: new Date("2025-08-06T18:00:00Z"), paymentMethod: "Cash" },
      { customerId: insertedCustomers[3]._id, eventId: insertedEvents[3]._id, ticketStatus: "active", amountPaid: 90, purchaseDate: new Date("2025-08-07T17:00:00Z"), paymentMethod: "Credit Card" },
      { customerId: insertedCustomers[0]._id, eventId: insertedEvents[3]._id, ticketStatus: "used", amountPaid: 90, purchaseDate: new Date("2025-08-08T16:00:00Z"), paymentMethod: "Debit Card" },
      { customerId: insertedCustomers[1]._id, eventId: insertedEvents[4]._id, ticketStatus: "active", amountPaid: 150, purchaseDate: new Date("2025-08-09T14:00:00Z"), paymentMethod: "Credit Card" },
      { customerId: insertedCustomers[4]._id, eventId: insertedEvents[4]._id, ticketStatus: "active", amountPaid: 150, purchaseDate: new Date("2025-08-10T12:00:00Z"), paymentMethod: "PayPal" }
    ];
    const insertedTickets = await Ticket.insertMany(tickets);
    console.log(`✅ Inserted ${insertedTickets.length} tickets`);

    console.log("🎉 Seeding complete");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
