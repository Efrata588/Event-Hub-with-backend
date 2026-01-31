const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('./models/Event');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventhub')
    .then(async () => {
        console.log('MongoDB Connected');

        let organizer = await User.findOne({ role: 'organizer' });

        if (!organizer) {
            console.log("No organizer found, attempting to find any user...");
            organizer = await User.findOne({});
        }

        if (!organizer) {
            console.error("No users found to assign event to.");
            process.exit(1);
        }

        const mockEvent = new Event({
            title: "Recap This Event - Mock Completed",
            date: new Date(Date.now() - 86400000),
            startTime: "18:00",
            endTime: "22:00",
            location: "Mock Venue, City",
            description: "This is a completed event that needs a recap. recap this.",
            category: "Music",
            imageUrl: "", // Empty or provide a valid path
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
