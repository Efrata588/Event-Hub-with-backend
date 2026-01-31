import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import '../styles/organizer-only-pages/create-event-form.css';
import '../styles/common/back-button.css';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '', date: '', startTime: '', endTime: '', location: '', description: '', category: 'Music', shortDescription: '', availablePrice: '', availableTickets: ''
    });
    const [poster, setPoster] = useState(null);
    const [eventType, setEventType] = useState('in-person');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTypeChange = (e) => {
        setEventType(e.target.value);
        setFormData({ ...formData, location: '' }); // Reset location/link on toggle
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedDate = new Date(formData.date);
        const now = new Date();

        if (selectedDate < now.setHours(0, 0, 0, 0)) {
            setError('Cannot create event in the past.');
            return;
        }

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            data.append('eventType', eventType);
            if (poster) {
                data.append('imageUrl', poster);
            }

            await api.post('/events', data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create event');
        }
    };

    return (
        <div className="create-event-page-wrapper">
            <Link className="back" to="/"><span>&#11013;</span> Back</Link>

            <form className="create-form" onSubmit={handleSubmit}>
                <h1 className="title">Create New Event</h1>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                <div className="section">
                    <h2>Basic Information</h2>

                    <label>Event Title</label>
                    <input type="text" name="title" placeholder="Summer Music Festival" value={formData.title} onChange={handleChange} required />

                    <label>Short Description</label>
                    <input type="text" name="shortDescription" placeholder="A short one-line description" value={formData.shortDescription} onChange={handleChange} />

                    <label>About This Event</label>
                    <input type="text" name="description" className="long-input" placeholder="Full description of the event" value={formData.description} onChange={handleChange} required />

                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '10px', marginTop: '5px', marginBottom: '15px' }}>
                        <option value="Music">Music</option>
                        <option value="Technology">Technology</option>
                        <option value="Art">Art</option>
                        <option value="Business">Business</option>
                        <option value="Health">Health</option>
                    </select>

                    {eventType === 'in-person' && (
                        <div className="double">
                            <div>
                                <label>Available Price ($)</label>
                                <input type="number" name="availablePrice" placeholder="0" value={formData.availablePrice} onChange={handleChange} min="0" />
                            </div>
                            <div>
                                <label>Available Tickets</label>
                                <input type="number" name="availableTickets" placeholder="100" value={formData.availableTickets} onChange={handleChange} min="0" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="section">
                    <h2>Date & Time</h2>

                    <label>Date</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} required />

                    <div className="double">
                        <div>
                            <label>Start Time</label>
                            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
                        </div>
                        <div>
                            <label>End Time</label>
                            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
                        </div>
                    </div>
                </div>

                <div className="section">
                    <h2>Location</h2>

                    <label>Event Location</label>
                    <div className="location-type">
                        <label>
                            In-Person
                            <input
                                type="radio"
                                name="event-type"
                                value="in-person"
                                checked={eventType === 'in-person'}
                                onChange={handleTypeChange}
                            />
                        </label>
                        <label>
                            Online
                            <input
                                type="radio"
                                name="event-type"
                                value="online"
                                checked={eventType === 'online'}
                                onChange={handleTypeChange}
                            />
                        </label>
                    </div>
                    <input
                        type="text"
                        name="location"
                        placeholder={eventType === 'online' ? "Event Link (Zoom, Meet, etc.)" : "Central Park, New York"}
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="section">
                    <h2>Event Poster</h2>
                    <p className="note">Upload event poster.</p>
                    <input type="file" onChange={(e) => setPoster(e.target.files[0])} accept="image/*" />
                </div>

                <button type="submit" className="post-event">Post Event</button>
            </form>
        </div>
    );
};

export default CreateEvent;
