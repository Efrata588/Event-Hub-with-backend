const Event = require("../models/Event");
// const Recap = require("../models/Recap");
const User = require("../models/User");

exports.getEvents = async (req, res) => {
  const { type, organizerId, search, category } = req.query; // type: 'upcoming' | 'past'
  const now = new Date();

  // Helper to combine date and time
  const getEventDateTime = (event) => {
    const eventDate = new Date(event.date);
    if (event.startTime) {
      const [hours, minutes] = event.startTime.split(":");
      eventDate.setHours(hours, minutes, 0, 0);
    }
    return eventDate;
  };

  let query = {};

  if (organizerId) {
    query.organizer = organizerId;
  }

  if (category && category !== "All") {
    query.category = category;
  }

  if (search) {
    const organizers = await User.find({
      name: { $regex: search, $options: "i" },
      role: "organizer",
    }).select("_id");
    const organizerIds = organizers.map((o) => o._id);

    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { organizer: { $in: organizerIds } },
    ];
  }

  try {
    // Fetch all potential events matching other criteria
    let events = await Event.find(query)
      .populate("organizer", "name _id")
      .sort({ date: 1 });

    // Filter in memory for precise Date+Time
    // Filter in memory for precise Date+Time
    // console.log(`Filtering events. Type: ${type}, Found: ${events.length}`); // DEBUG
    if (type === "upcoming") {
      events = events.filter((event) => {
        const dt = getEventDateTime(event);
        console.log(
          `Event: ${event.title}, Date: ${dt}, Now: ${now}, Keep: ${dt >= now}`,
        ); // DEBUG
        return dt >= now;
      });
    } else if (type === "past") {
      events = events.filter((event) => getEventDateTime(event) < now);
    }

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizer",
      "name _id bio",
    );
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createEvent = async (req, res) => {
  if (req.user.role !== "organizer")
    return res.status(403).json({ message: "Access denied" });

  const {
    title,
    date,
    startTime,
    endTime,
    location,
    description,
    category,
    eventType,
    shortDescription,
    availablePrice,
    availableTickets,
  } = req.body;

  if (new Date(date) < new Date()) {
    return res.status(400).json({ message: "Cannot create event in the past" });
  }

  try {
    let imageUrl = "";
    if (req.file) {
      imageUrl = req.file.path.replace(/\\/g, "/");
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    const newEvent = new Event({
      title,
      date,
      startTime,
      endTime,
      location,
      description,
      category,
      imageUrl,
      eventType,
      shortDescription,
      availablePrice,
      availableTickets,
      organizer: req.user.id,
      status: "upcoming",
    });
    const event = await newEvent.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
