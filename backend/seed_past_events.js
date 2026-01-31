const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Event = require("./models/Event");
const User = require("./models/User");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventhub")
  .then(async () => {
    console.log("MongoDB Connected");

    // Find the specific organizer
    const email = "hhhu@gmail.com";
    let organizer = await User.findOne({ email: email });

    if (!organizer) {
      console.log(`User ${email} not found. Creating...`);
      organizer = new User({
        name: "Huhu Organizer",
        email: email,
        password: "password123", // Basic password
        role: "organizer",
        profilePicture: "uploads/mock-profile.jpg", // Placeholder
      });
      await organizer.save();
      console.log(`User ${email} created.`);
    }

    // Create Past Events
    const eventsToCreate = [
      {
        title: "Past Morning Yoga",
        description:
          "A refreshing morning yoga session that happened last week.",
        location: "Central Park",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        startTime: "07:00",
        endTime: "08:00",
        category: "Health",
        status: "past",
        logged: false,
      },
      {
        title: "Past Coding Bootcamp",
        description: "Intensive coding session completed yesterday.",
        location: "Tech Hub",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        startTime: "10:00",
        endTime: "16:00",
        category: "Education",
        status: "past",
        logged: false,
      },
      {
        title: "Completed Art Workshop",
        description: "Painting and wine event.",
        location: "Art Studio",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        startTime: "18:00",
        endTime: "20:00",
        category: "Art",
        status: "past",
        logged: false,
      },
    ];

    for (const evt of eventsToCreate) {
      const newEvent = new Event({
        ...evt,
        organizer: organizer._id,
        eventType: "in-person",
        shortDescription: evt.description,
        imageUrl: "",
        availablePrice: 10,
        availableTickets: 0,
      });
      await newEvent.save();
      console.log(`Created event: ${evt.title}`);
    }

    console.log("Seed completed.");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
