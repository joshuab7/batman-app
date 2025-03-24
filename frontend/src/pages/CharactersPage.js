// src/pages/CharactersPage.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { characters } from '../services/api';

const CharactersPage = () => {
        const [characterList, setCharacterList] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState('');
        const [searchQuery, setSearchQuery] = useState('');
        
        // Fetch all characters (no pagination)
        const fetchCharacters = async () => {
            try {
            setIsLoading(true);
            const response = await characters.getAll();
            setCharacterList(response.data.characters);
            } catch (err) {
            setError('Failed to load characters. Please try again.');
            console.error('Error fetching characters:', err);
            } finally {
            setIsLoading(false);
            }
        };
        
        // Load characters when component mounts
        useEffect(() => {
            if (!searchQuery) {
            fetchCharacters();
            }
        }, [searchQuery]);
        
        // Handle search
        const handleSearch = async (e) => {
            e.preventDefault();
            
            if (!searchQuery.trim()) {
            return;
            }
            
            try {
            setIsLoading(true);
            const response = await characters.search(searchQuery);
            setCharacterList(response.data.characters);
            } catch (err) {
            setError('Search failed. Please try again.');
            console.error('Error searching characters:', err);
            } finally {
            setIsLoading(false);
            }
        };
        
        // Reset search
        const resetSearch = () => {
            setSearchQuery('');
            // fetchCharacters will be called by the useEffect
        };
        
        return (
            <div className="characters-page">
            <h1>Batman Characters</h1>
            
            <div className="search-container">
                <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search Batman characters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">Search</button>
                {searchQuery && (
                    <button type="button" onClick={resetSearch} className="reset-button">
                    Reset
                    </button>
                )}
                </form>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            {isLoading ? (
                <div className="loading">Loading characters...</div>
            ) : (
                <div className="character-grid">
                {characterList.length > 0 ? (
                    characterList.map(character => (
                    <div key={character.id} className="character-card">
                        <Link to={`/characters/${character.id}`}>
                        <div className="character-image-placeholder">
                            {character.alias?.[0] || character.name?.[0] || '?'}
                        </div>
                        <h3 className="character-name">{character.name}</h3>
                        {character.alias && <h4 className="character-alias">{character.alias}</h4>}
                        </Link>
                    </div>
                    ))
                ) : (
                    <div className="no-results">No characters found</div>
                )}
                </div>
            )}
            </div>
        );
};

export default CharactersPage;