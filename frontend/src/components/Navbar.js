// src/components/Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <nav className="navbar">
        <div className="navbar-brand">
            <Link to="/" className="navbar-logo">Batman Universe Explorer</Link>
        </div>
        
        <div className="navbar-menu">
            <Link to="/characters" className="navbar-item">Characters</Link>
            
            {user ? (
            <>
                <Link to="/favorites" className="navbar-item">My Favorites</Link>
                <div className="navbar-item">
                <span>Welcome, {user.username}</span>
                </div>
                <button onClick={logout} className="navbar-button">Logout</button>
            </>
            ) : (
            <>
                <Link to="/login" className="navbar-item">Login</Link>
                <Link to="/register" className="navbar-item">Register</Link>
            </>
            )}
            <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            title={theme === 'batman' ? 'Switch to Joker Theme' : 'Switch to Batman Theme'}
            >
            {theme === 'batman' ? '🃏' : '🦇'}
            </button>
        </div>
        </nav>
    );
};

export default Navbar;