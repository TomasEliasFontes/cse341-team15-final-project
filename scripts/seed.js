// scripts/seed.js
// This script populates the 'venues' and 'customers' collections with sample data.
require('dotenv').config();
const mongoose = require('mongoose');
const Venue    = require('../model/venue');
const Customer = require('../model/customer');

async function seed() {
  try {
    // Connect to MongoDB using the URI in your .env file
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('🔗 Connected to MongoDB for seeding');

    // Clear existing documents
    await Venue.deleteMany();
    await Customer.deleteMany();

    // Insert 5 sample venues
    const venues = [
      { venueName: "Stadium A", city: "Paris", country: "France", address: "123 Boulevard Saint-Germain", gpsCoordinates: "48.8566,2.3522" },
      { venueName: "Arena B", city: "Los Angeles", country: "USA", address: "456 Sunset Blvd", gpsCoordinates: "34.0522,-118.2437" },
      { venueName: "Concert Hall C", city: "London", country: "UK", address: "789 King\'s Road", gpsCoordinates: "51.5074,-0.1278" },
      { venueName: "Opera House D", city: "Sydney", country: "Australia", address: "1 Macquarie St", gpsCoordinates: "-33.8568,151.2153" },
      { venueName: "Festival Grounds E", city: "Berlin", country: "Germany", address: "101 Unter den Linden", gpsCoordinates: "52.5200,13.4050" }
    ];
    await Venue.insertMany(venues);
    console.log(`✅ Inserted ${venues.length} venues`);

    // Insert 5 sample customers
    const customers = [
      { firstName: "Alice", lastName: "Smith", email: "alice@example.com", phoneNumber: "123-456-7890", gender: "F" },
      { firstName: "Bob", lastName: "Johnson", email: "bob.johnson@example.com", phoneNumber: "234-567-8901", gender: "M" },
      { firstName: "Carol", lastName: "Williams", email: "carol.williams@example.com", phoneNumber: "345-678-9012", gender: "F" },
      { firstName: "Dave", lastName: "Brown", email: "dave.brown@example.com", phoneNumber: "456-789-0123", gender: "M" },
      { firstName: "Eve", lastName: "Davis", email: "eve.davis@example.com", phoneNumber: "567-890-1234", gender: "F" }
    ];
    await Customer.insertMany(customers);
    console.log(`✅ Inserted ${customers.length} customers`);

    console.log('🎉 Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
