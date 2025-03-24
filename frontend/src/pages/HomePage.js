import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
    const { user } = useContext(AuthContext);
    
    return (
        <div className="home-page">
        <div className="hero">
            <h1>Batman Universe Explorer</h1>
            <p>Discover and explore characters from the Batman universe</p>
            
            <div className="hero-buttons">
            <Link to="/characters" className="button primary">Browse Characters</Link>
            {!user ? (
                <Link to="/register" className="button secondary">Create Account</Link>
            ) : (
                <Link to="/favorites" className="button secondary">View Favorites</Link>
            )}
            </div>
        </div>
        
        <div className="features">
            <div className="feature-card">
            <h2>Character Profiles</h2>
            <p>Explore detailed profiles of Batman characters including heroes, villains, and allies.</p>
            </div>
            
            <div className="feature-card">
            <h2>Favorites System</h2>
            <p>Create your personal collection of favorite Batman characters.</p>
            </div>
            
            <div className="feature-card">
            <h2>Ratings</h2>
            <p>Rate characters on a five-star scale and keep track of your ratings.</p>
            </div>
        </div>
        
        <div className="about-section">
            <h2>About This Project</h2>
            <p>This capstone project demonstrates full-stack development skills using:</p>
            <ul>
            <li>React for the frontend user interface</li>
            <li>Node.js and Express for the backend server</li>
            <li>PostgreSQL for the database</li>
            <li>RESTful API integration</li>
            <li>User authentication with JWT</li>
            </ul>
        </div>
        </div>
    );
};

export default HomePage;