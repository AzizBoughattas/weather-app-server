const mongoose = require("mongoose");

const Temperature = mongoose.model(
  "Temperature",
  new mongoose.Schema({
    values: { type: [Number], required: true },
    unit: { type: String, required: true, enum: ["metric", "imperial"] },
    ville: { type: String, required: true },
  })
);

exports.Temperature = Temperature;
