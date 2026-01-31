const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./backend/models/Event');
const User = require('./backend/models/User'); // Need a user to assign as organizer

dotenv.config({ path: './backend/.env' });

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventhub')
    .then(async () => {
        console.log('MongoDB Connected');

        // Find an organizer (or create one if none - but usually seed assumes some data or we pick the first one)
        let organizer = await User.findOne({ role: 'organizer' });

        if (!organizer) {
            console.log("No organizer found, creating a mock one...");
            // Create a mock organizer if needed for the script to run standalone
            // In this environment, we likely have one.
            // If not, we skip or error.
            organizer = await User.findOne({}); // Fallback to any user
        }

        if (!organizer) {
            console.error("No users found to assign event to.");
            process.exit(1);
        }

        const mockEvent = new Event({
            title: "Recap This Event - Mock Completed",
            date: new Date(Date.now() - 86400000), // Yesterday
            startTime: "18:00",
            endTime: "22:00",
            location: "Mock Venue, City",
            description: "This is a completed event that needs a recap. recap this.",
            category: "Music",
            imageUrl: "",
            organizer: organizer._id,
            status: "past",
            eventType: "in-person",
            shortDescription: "A past event ready for recap.",
            availablePrice: 50,
            availableTickets: 0
        });

        await mockEvent.save();
        console.log("Mock completed event created:", mockEvent.title);

        mongoose.disconnect();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
