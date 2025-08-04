const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  venueName: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  address: { type: String, required: true },
  gpsCoordinates: { type: String, required: true }
});

module.exports = mongoose.model('Venue', venueSchema);
