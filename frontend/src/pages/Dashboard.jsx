import React, { useState, useEffect } from 'react';
import api from '../api';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';
import '../styles/attendee-dashboard.css';
import '../styles/home-page/home.css'; // Reuse grid styles
import ErrorBoundary from '../components/ErrorBoundary';

const Dashboard = () => {
    const { user, setUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [activeTab, setActiveTab] = useState('saved'); // Default for attendee
    // Organizer logic
    const [orgEvents, setOrgEvents] = useState([]);
    const [orgView, setOrgView] = useState('upcoming');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/profile');
                setProfile(res.data);

                if (user.role === 'organizer') {
                    fetchOrgEvents('upcoming');
                }
            } catch (error) {
                console.error("Error fetching profile", error);
            }
        };
        fetchProfile();
    }, [user.role]);

    const fetchOrgEvents = async (type) => {
        try {
            const res = await api.get('/events', { params: { organizerId: user.id || user._id, type } });
            setOrgEvents(res.data);
            setOrgView(type);
        } catch (error) {
            console.error("Error fetching organizer events", error);
        }
    };

    // Removed handleUnfollow logic



    if (!profile) return <div>Loading...</div>;

    // Debugging log for profile structure
    console.log("Dashboard Profile Data:", profile);

    return (
        <ErrorBoundary>
            <div className="dashboard-container">
                <div className="profile-section">
                    <div className="profile-header">
                        <h1>{user.role === 'organizer' ? 'Organizer Dashboard' : 'My Dashboard'}</h1>
                    </div>
                    <div className="profile-card">
                        <div className="profile-wrap">
                            <div className="profile-avatar" style={{ width: '70px', height: '70px', borderRadius: '50%' }}>
                                <img
                                    src={profile.profilePicture ? (profile.profilePicture.startsWith('http') ? profile.profilePicture : `http://localhost:5000/${profile.profilePicture}`) : "/Images/profile-placeholder.png"}
                                    alt="Profile"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                />
                            </div>
                            <div className="profile-info">
                                <h2>{profile.name}</h2>
                                <p>{profile.email}</p>
                                {user.role === 'organizer' && profile.bio && <p>{profile.bio}</p>}
                            </div>
                        </div>

                    </div>
                </div>

                {user.role === 'attendee' && (
                    <div className="quick-actions-section">
                        <div className="section-header">
                            <div className="toggle-buttons">
                                <button className={`toggle-btn ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>Saved Events</button>
                                <button className={`toggle-btn ${activeTab === 'participated' ? 'active' : ''}`} onClick={() => setActiveTab('participated')}>Participated</button>
                            </div>
                        </div>

                        <div className="tab-content active">
                            {activeTab === 'saved' && (
                                <div className="events-grid">
                                    {profile.savedEvents?.filter(e => e).length > 0 ? profile.savedEvents.filter(e => e).map(event => (
                                        <div key={event._id} style={{ position: 'relative' }}>
                                            <EventCard event={event} />
                                            <button
                                                onClick={async (e) => {
                                                    e.preventDefault(); // Prevent card click if any
                                                    await api.put(`/users/save/${event._id}`);
                                                    setProfile(prev => ({ ...prev, savedEvents: prev.savedEvents.filter(ev => ev._id !== event._id) }));
                                                }}
                                                style={{ position: 'absolute', top: '10px', left: '10px', background: 'red', color: 'white', border: 'none', borderRadius: '5px', padding: '5px', cursor: 'pointer', zIndex: 10 }}
                                            >
                                                Unsave
                                            </button>
                                        </div>
                                    )) : <p>No saved events.</p>}
                                </div>
                            )}
                            {activeTab === 'participated' && (
                                <div className="events-grid">
                                    {profile.participatedEvents?.filter(e => e).length > 0 ? profile.participatedEvents.filter(e => e).map(event => (
                                        <div key={event._id} style={{ position: 'relative' }}>
                                            <EventCard event={event} />
                                            <button
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    await api.put(`/users/participate/${event._id}`);
                                                    setProfile(prev => ({ ...prev, participatedEvents: prev.participatedEvents.filter(ev => ev._id !== event._id) }));
                                                }}
                                                style={{ position: 'absolute', top: '10px', left: '10px', background: 'red', color: 'white', border: 'none', borderRadius: '5px', padding: '5px', cursor: 'pointer', zIndex: 10 }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )) : <p>No participated events.</p>}
                                </div>
                            )}
                            {/* Removed Following Tab Content */}
                        </div>
                    </div>
                )}

                {user.role === 'organizer' && (
                    <div className="org-events-section">
                        <div className="section-header">
                            <h2>My Events</h2>
                            <div className="toggle-buttons">
                                <button className={`toggle-btn ${orgView === 'upcoming' ? 'active' : ''}`} onClick={() => fetchOrgEvents('upcoming')}>Upcoming</button>
                                <button className={`toggle-btn ${orgView === 'past' ? 'active' : ''}`} onClick={() => fetchOrgEvents('past')}>Past</button>
                            </div>
                        </div>
                        <div className="events-grid">
                            {orgEvents?.filter(e => e).length > 0 ? orgEvents.filter(e => e).map(event => (
                                <EventCard key={event._id} event={event} />
                            )) : <p>No events found.</p>}
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default Dashboard;
