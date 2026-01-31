const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["attendee", "organizer"],
      default: "attendee",
    },
    // Attendee specific
    savedEvents: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Event", default: [] },
    ],
    participatedEvents: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Event", default: [] },
    ],
    // following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }], // Following organizers
    // Organizer specific
    // bio: { type: String, default: '' },
    profilePicture: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
