const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');
const Recap = require('./models/Recap');
const bcrypt = require('bcryptjs');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventhub')
    .then(() => {
        console.log('MongoDB Connected for Seeding');
        seedData();
    })
    .catch(err => console.log(err));

const seedData = async () => {
    try {
        await User.deleteMany({});
        await Event.deleteMany({});
        await Recap.deleteMany({});

        console.log('Cleared Database');

        // Create Users
        const hashedPassword = await bcrypt.hash('password123', 10);

        const organizers = [];
        for (let i = 1; i <= 3; i++) {
            const user = await User.create({
                name: `Organizer ${i}`,
                email: `organizer${i}@test.com`,
                password: hashedPassword,
                role: 'organizer',
                bio: `This is the bio for Organizer ${i}`
            });
            organizers.push(user);
        }

        const attendees = [];
        for (let i = 1; i <= 5; i++) {
            const user = await User.create({
                name: `Attendee ${i}`,
                email: `attendee${i}@test.com`,
                password: hashedPassword,
                role: 'attendee'
            });
            attendees.push(user);
        }

        console.log('Created Users');

        const events = [];
        const CATEGORIES = ['Music', 'Technology', 'Art', 'Business', 'Health'];
        const LOCATIONS = ['New York', 'London', 'Berlin', 'Tokyo', 'Addis Ababa'];

        // 30 Upcoming/Ongoing Events (Date >= Now)
        for (let i = 0; i < 30; i++) {
            events.push({
                title: `Upcoming Event ${i + 1}`,
                date: new Date(Date.now() + (i + 1) * 86400000), // Future dates
                startTime: '10:00',
                endTime: '12:00',
                location: LOCATIONS[i % LOCATIONS.length],
                description: 'This is an upcoming event description.',
                category: CATEGORIES[i % CATEGORIES.length],
                imageUrl: '/Images/festival.png',
                organizer: organizers[i % organizers.length]._id,
                status: 'upcoming',
                logged: false
            });
        }

        // 10 Recapped Events (Status: Past, Logged: True)
        const recappedEvents = [];
        for (let i = 0; i < 10; i++) {
            const event = await Event.create({
                title: `Past Recapped Event ${i + 1}`,
                date: new Date(Date.now() - (i + 1) * 86400000), // Past dates
                startTime: '10:00',
                endTime: '12:00',
                location: LOCATIONS[i % LOCATIONS.length],
                description: 'This was a great event.',
                category: CATEGORIES[i % CATEGORIES.length],
                imageUrl: '/Images/tech-conference.png',
                organizer: organizers[i % organizers.length]._id,
                status: 'past',
                logged: true
            });

            // Create Recap
            await Recap.create({
                event: event._id,
                content: `Recap for ${event.title}. It was amazing!`,
                averageRating: 4.5,
                feedbacks: [
                    {
                        user: attendees[0]._id,
                        rating: 5,
                        comment: 'Loved it!',
                        date: new Date()
                    },
                    {
                        user: attendees[1]._id,
                        rating: 4,
                        comment: 'Good, but crowded.',
                        date: new Date()
                    }
                ]
            });
        }

        // 5 Completed Events w/o Recap (Status: Past, Logged: False)
        for (let i = 0; i < 5; i++) {
            events.push({
                title: `Past No-Recap Event ${i + 1}`,
                date: new Date(Date.now() - (16 + i) * 86400000), // Further past
                startTime: '14:00',
                endTime: '16:00',
                location: LOCATIONS[i % LOCATIONS.length],
                description: 'This event happened but no recap yet.',
                category: CATEGORIES[i % CATEGORIES.length],
                imageUrl: '/Images/art-and wine.jpg',
                organizer: organizers[i % organizers.length]._id,
                status: 'past',
                logged: false
            });
        }

        await Event.insertMany(events);

        console.log('Seeding Complete. 50 Events Created.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
