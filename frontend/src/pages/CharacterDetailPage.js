import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { characters } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import StarRating from '../components/StarRating';

const CharacterDetailPage = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [character, setCharacter] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [userRating, setUserRating] = useState(0);
    useEffect(() => {
        const fetchCharacter = async () => {
        try {
            setIsLoading(true);
            console.log(`Fetching character with ID: ${id}`);
            const response = await characters.getById(id);
            if (response.data && (response.data.data || response.data)) {
            let characterData;
            if (response.data.data) {
                characterData = {
                id: response.data.data.id,
                ...response.data.data.attributes
                };
            } else {
                characterData = response.data;
            }
            
            setCharacter(characterData);
            if (characterData.isFavorite !== undefined) {
                setIsFavorite(characterData.isFavorite);
            }
            if (characterData.userRating !== undefined) {
                setUserRating(characterData.userRating);
            }
            }
        } catch (err) {
            console.error("Error fetching character:", err);
            setError('Failed to load character details. Please try again later.');
        } finally {
            setIsLoading(false);
        }
        };

        fetchCharacter();
    }, [id]);
    const toggleFavorite = async () => {
        if (!user) {
        navigate('/login');
        return;
        }
        
        try {
        if (isFavorite) {
            await characters.removeFromFavorites(id);
        } else {
            await characters.addToFavorites(id);
        }
        setIsFavorite(!isFavorite);
        } catch (err) {
        console.error('Error toggling favorite status:', err);
        }
    };
    const handleRating = async (rating) => {
        if (!user) {
            navigate('/login');
            return;
            }
            setUserRating(rating);
            
            try {
            await characters.rateCharacter(id, { rating });
            } catch (err) {
            console.error('Error rating character:', err);
            }
        };
    
    if (isLoading) {
        return <div className="loading">Loading character details...</div>;
    }
    
    if (error) {
        return <div className="error-message">{error}</div>;
    }
    
    if (!character) {
        return <div className="not-found">Character not found</div>;
    }
    
    return (
        <div className="character-detail-page">
        <Link to="/characters" className="back-link">← Back to Characters</Link>
        
        <div className="character-header">
            <h1>{character.name || 'Unknown Character'}</h1>
            {character.alias && <h2 className="character-alias">{character.alias}</h2>}
        </div>
        
        <div className="character-content">
            <div className="character-image-container">
            {character.image_url ? (
                <img 
                src={character.image_url} 
                alt={character.name} 
                className="character-detail-image"
                />
            ) : (
                <div className="character-detail-image-placeholder">
                {character.alias?.[0] || character.name?.[0] || '?'}
                </div>
            )}
            <button 
                onClick={toggleFavorite}
                className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
            >
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
            <div className="rating-container">
            <h3>Rate this character:</h3>
            <StarRating 
                initialRating={userRating} 
                onRatingChange={handleRating} 
            />
            </div>
            </div>
            
            <div className="character-info">
            <div className="info-section">
                <h3>Status</h3>
                <p>{character.alive ? 'Alive' : 'Deceased'}</p>
            </div>
            
            <div className="info-section">
                <h3>Role</h3>
                <p>{character.role || 'Unknown'}</p>
            </div>
            
            <div className="info-section">
                <h3>Description</h3>
                <p>{character.description || 'No description available.'}</p>
            </div>
            
            {character.abilities && character.abilities.length > 0 && (
                <div className="info-section">
                <h3>Abilities</h3>
                <ul className="abilities-list">
                    {character.abilities.map((ability, index) => (
                    <li key={index}>{ability}</li>
                    ))}
                </ul>
                </div>
            )}
            
            <div className="info-section">
                <h3>First Appearance</h3>
                <p>{character.first_appearance || 'Unknown'}</p>
            </div>
            
            <div className="info-section">
                <h3>Creator</h3>
                <p>{character.creator || 'Unknown'}</p>
            </div>
            </div>
        </div>
        </div>
    );
};

export default CharacterDetailPage;