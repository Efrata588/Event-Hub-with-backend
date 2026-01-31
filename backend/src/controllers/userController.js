const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        console.log('Getting profile for user ID:', req.user.id);
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate({ path: 'savedEvents', populate: { path: 'organizer', select: 'name' } })
            .populate({ path: 'participatedEvents', populate: { path: 'organizer', select: 'name' } });
        console.log('Found user:', user ? 'yes' : 'no');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error in getProfile:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.getOrganizerProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name bio role profilePicture');
        if (!user || user.role !== 'organizer') return res.status(404).json({ message: 'Organizer not found' });

        const followersCount = await User.countDocuments({ following: req.params.id });
        const eventsCount = await require('../models/Event').countDocuments({ organizer: req.params.id });

        res.json({ ...user.toObject(), followersCount, eventsCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.toggleFollow = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const organizerId = req.params.organizerId;

        // Check if already following
        const index = user.following.indexOf(organizerId);
        if (index === -1) {
            user.following.push(organizerId);
        } else {
            user.following.splice(index, 1);
        }
        await user.save();
        res.json(user.following);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.toggleSaveEvent = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const eventId = req.params.eventId;

        const index = user.savedEvents.indexOf(eventId);
        if (index === -1) {
            user.savedEvents.push(eventId);
        } else {
            user.savedEvents.splice(index, 1);
        }
        await user.save();
        res.json(user.savedEvents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.toggleParticipate = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const eventId = req.params.eventId;

        const index = user.participatedEvents.indexOf(eventId);
        if (index === -1) {
            user.participatedEvents.push(eventId);
        } else {
            user.participatedEvents.splice(index, 1);
        }
        await user.save();
        res.json(user.participatedEvents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
