// src/pages/FavoritesPage.js

import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { characters } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const FavoritesPage = () => {
    const { user } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    if (!user) {
        return <Navigate to="/login" />;
    }
    useEffect(() => {
        const fetchFavorites = async () => {
        try {
            setIsLoading(true);
            const response = await characters.getFavorites();
            setFavorites(response.data.favorites);
        } catch (err) {
            setError('Failed to load favorites. Please try again later.');
            console.error('Error fetching favorites:', err);
        } finally {
            setIsLoading(false);
        }
        };
        
        fetchFavorites();
    }, []);
    
    const handleRemove = async (id) => {
        try {
        await characters.removeFromFavorites(id);
        setFavorites(prevFavorites => 
            prevFavorites.filter(char => char.id !== id)
        );
        } catch (err) {
        console.error('Error removing from favorites:', err);
        }
    };
    
    if (isLoading) {
        return <div className="loading">Loading favorites...</div>;
    }
    
    return (
        <div className="favorites-page">
        <h1>My Favorite Characters</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        {favorites.length === 0 ? (
            <div className="no-favorites">
            <p>You haven't added any characters to your favorites yet.</p>
            <Link to="/characters" className="button">Explore Characters</Link>
            </div>
        ) : (
            <div className="favorites-list">
            {favorites.map(character => (
                <div key={character.id} className="favorite-item">
                <div className="favorite-content">
                    <Link to={`/characters/${character.id}`} className="favorite-link">
                    <div className="favorite-image-container">
                        {character.image_url ? (
                        <img 
                            src={character.image_url} 
                            alt={character.name} 
                            className="favorite-image"
                        />
                        ) : (
                        <div className="favorite-image-placeholder">
                            {character.alias?.[0] || character.name?.[0] || '?'}
                        </div>
                        )}
                    </div>
                    
                    <div className="favorite-details">
                        <h3 className="favorite-name">{character.name}</h3>
                        {character.alias && <h4 className="favorite-alias">{character.alias}</h4>}
                        <p className="favorite-role">{character.role || 'Unknown role'}</p>
                    </div>
                    </Link>
                    
                    <button 
                    onClick={() => handleRemove(character.id)}
                    className="remove-favorite-button"
                    >
                    Remove
                    </button>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
    );
};

export default FavoritesPage;