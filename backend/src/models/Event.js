const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // e.g. "18:00"
    endTime: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String }, // Path or URL
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: { type: String, enum: ["upcoming", "past"], default: "upcoming" },
    eventType: {
      type: String,
      enum: ["in-person", "online"],
      default: "in-person",
    },
    shortDescription: { type: String },
    availablePrice: { type: Number },
    availableTickets: { type: Number },
    logged: { type: Boolean, default: false }, // Recap logged
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", EventSchema);
