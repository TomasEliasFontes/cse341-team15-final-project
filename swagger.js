const swaggerAutogen = require("swagger-autogen")();
require("dotenv").config();

const doc = {
  info: {
    title: 'Event Ticketing - CSE341 Final Project"',
    description: "API for ticketing data (Events, Venues, Customers, Tickets)"
  },
  host: process.env.SWAGGER_HOST,
  schemes: process.env.SWAGGER_SCHEMES
    ? process.env.SWAGGER_SCHEMES.split(",")
    : ["http", "https"],
  definitions: {
    Venue: {
      venueName: "Madison Square Garden",
      city: "New York",
      country: "United States",
      address: "4 Pennsylvania Plaza",
      gpsCoordinates: "40.7505,-73.9934"
    },
    Customer: {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@email.com",
      phoneNumber: "+1-555-0101",
      gender: "M"
    },
    Event: {
      eventName: "Rock Concert",
      startDate: "2025-09-01",
      endDate: "2025-09-01",
      startTime: "20:00",
      endTime: "23:00",
      capacity: 5000,
      eventType: "Concert",
      eventPrice: 120,
      venueId: "6890b8efd801e1a85b254a29"
    },
    Ticket: {
      customerId: "6890b8efd801e1a85b254a2f",
      eventId: "68940c4315d95a5bac729f04",
      ticketStatus: "active",
      amountPaid: 120,
      purchaseDate: "2025-08-01T10:00:00Z",
      paymentMethod: "Credit Card"
    },
  }
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js"];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);

// Run server after it gets generated
// swaggerAutogen(outputFile, endpointsFiles, doc).then(async () => {
//   await import('./index.js');
// });
