const mongoose = require("mongoose");

const HelmetConfig = new mongoose.Schema(
  {
    id: String,
    model: String,
    size: String,
    color: String,
    sensors: [String],
    camera: Boolean,
    microphone: Boolean,
    lights: {
      automatic: Boolean,
      manual: Boolean,
      continuous: Boolean,
    },
    crashes: [
      {
        time: Date,
        location: {
          latitude: String,
          longitude: String,
        },
      },
    ],
    last_location: { latitude: String, longitude: String },
    usage_history: {
      total_rides: Number,
      total_duration: Number,
      average_ride_duration: Number,
    },
    last_ride_data: {
      duration: Number,
      distance_traveled: Number,
      locations: [
        {
          speed: Number,
          latitude: String,
          longitude: String,
          time: Date,
        },
      ],
    },
    max_speed: Number,
    calories_burned: Number,
  },
  { collection: "HelmetConfig", typeKey: "$type" }
);

module.exports = mongoose.model("HelmetConfig", HelmetConfig);
