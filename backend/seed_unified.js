const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config({ path: "./backend/.env" });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["organizer", "attendee"], default: "attendee" },
  profilePicture: { type: String, default: "" },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followersCount: { type: Number, default: 0 },
});
const User = mongoose.model("User", userSchema);

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  price: { type: Number, default: 0 },
  image: { type: String },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
const Event = mongoose.model("Event", eventSchema);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for Seeding");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    console.log("Data Cleared");

    // Create Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const organizer1 = await User.create({
      name: "Tech Events Inc",
      email: "organizer@test.com",
      password: hashedPassword,
      role: "organizer",
      profilePicture: "", // Placeholder
      followersCount: 10,
    });

    const organizer2 = await User.create({
      name: "Music Masters",
      email: "music@test.com",
      password: hashedPassword,
      role: "organizer",
      profilePicture: "",
      followersCount: 5,
    });

    const attendee1 = await User.create({
      name: "John Doe",
      email: "attendee@test.com",
      password: hashedPassword,
      role: "attendee",
    });

    console.log("Users Created");

    // Helpers for dates
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const lastMonth = new Date(now);
    lastMonth.setDate(now.getDate() - 30);

    // Create Events
    const events = [
      // UPCOMING EVENTS (Organizer 1)
      {
        title: "Tech Summit 2026",
        description:
          "The biggest tech conference of the year. Join us for amazing talks.",
        date: nextWeek,
        location: "Convention Center",
        category: "Technology",
        organizer: organizer1._id,
        price: 100,
        image: "",
      },
      {
        title: "React Workshop",
        description: "Learn React from scratch in this hands-on workshop.",
        date: tomorrow,
        location: "Tech Hub, Room 101",
        category: "Technology",
        organizer: organizer1._id,
        price: 50,
        image: "",
      },
      // PAST EVENTS (Organizer 1)
      {
        title: "Legacy Code Retreat",
        description: "A weekend dealing with legacy code.",
        date: lastMonth,
        location: "Old Town Hall",
        category: "Technology",
        organizer: organizer1._id,
        price: 20,
        image: "",
      },

      // UPCOMING EVENTS (Organizer 2)
      {
        title: "Summer Jazz Festival",
        description: "Smooth jazz all night long.",
        date: nextWeek,
        location: "Central Park",
        category: "Music",
        organizer: organizer2._id,
        price: 0, // Free
        image: "",
      },
      // PAST EVENTS (Organizer 2)
      {
        title: "Winter Symphony",
        description: "Classical music evening.",
        date: yesterday,
        location: "Opera House",
        category: "Music",
        organizer: organizer2._id,
        price: 150,
        image: "",
      },
    ];

    await Event.insertMany(events);
    console.log("Events Created (Past & Upcoming)");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
