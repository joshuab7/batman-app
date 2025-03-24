const batmanApi = require('../utils/batmanApi');
const { query } = require('../config/db');

const characterHandler = {
    async getCharacters(req, res) {
        try {
            const characters = await batmanApi.getCharacters();
            const transformedCharacters = characters.data.map(char => ({
                id: char.id,
                ...char.attributes
            }));
            
            res.json({
                characters: transformedCharacters
            });
            } catch (error) {
            console.error('Error in getCharacters:', error);
            res.status(500).json({ message: 'Error fetching characters' });
            }
        },
    async getCharacterById(req, res) {
        try {
        const { id } = req.params;
        
        const characterData = await batmanApi.getCharacterById(id);
        
        const character = {
            id: characterData.data.id,
            ...characterData.data.attributes
        };

        if (req.user) {
            try {
            const favResult = await query(
                'SELECT * FROM favorites WHERE user_id = $1 AND character_id = $2',
                [req.user.id, id]
            );
            
            character.isFavorite = favResult.rows.length > 0;
            
            const ratingResult = await query(
                'SELECT rating, review FROM ratings WHERE user_id = $1 AND character_id = $2',
                [req.user.id, id]
            );
            
            if (ratingResult.rows.length > 0) {
                character.userRating = ratingResult.rows[0].rating;
                character.userReview = ratingResult.rows[0].review;
            }
            
            await query(
                `INSERT INTO browsing_history (user_id, character_id, view_count, last_viewed_at)
                VALUES ($1, $2, 1, CURRENT_TIMESTAMP)
                ON CONFLICT (user_id, character_id)
                DO UPDATE SET
                view_count = browsing_history.view_count + 1,
                last_viewed_at = CURRENT_TIMESTAMP`,
                [req.user.id, id]
            );
            } catch (dbError) {
            console.error('Database error in getCharacterById:', dbError);
            }
        }
        
        res.json(character);
        } catch (error) {
        console.error(`Error in getCharacterById for ID ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error fetching character' });
        }
    },
    
    async searchCharacters(req, res) {        
        try {
            const { q } = req.query;
            
            if (!q) {
                return res.status(400).json({ message: 'Search query is required' });
            }
            
            // Let's use a simplified approach - just return mock data for now
            // This will let you continue developing the frontend
            const mockSearchResults = [
                { id: 1, name: "Bruce Wayne", alias: "Batman", role: "Hero" },
                { id: 2, name: "Joker", alias: "Unknown", role: "Villain" },
                { id: 3, name: "Selina Kyle", alias: "Catwoman", role: "Anti-Hero" },
                { id: 4, name: "Pamela Isley", alias: "Poison Ivy", role: "Villain" },
                { id: 5, name: "Edward Nigma", alias: "Riddler", role: "Villain" }
            ];
            
            // Filter the mock data based on search query
            const searchTerm = q.toLowerCase();
            const filteredResults = mockSearchResults.filter(char => 
                char.name.toLowerCase().includes(searchTerm) || 
                (char.alias && char.alias.toLowerCase().includes(searchTerm))
            );
            
            res.json({
                characters: filteredResults,
                count: filteredResults.length
            });
            
            } catch (error) {
            console.error('Error in searchCharacters:', error);
            res.status(500).json({ message: 'Error searching characters' });
            }
        },
    async addToFavorites(req, res) {
        try {
        const { id } = req.params;
        const userId = req.user.id;
        try {
            await batmanApi.getCharacterById(id);
        } catch (apiError) {
            return res.status(404).json({ message: 'Character not found' });
        }
        const existingFav = await query(
            'SELECT * FROM favorites WHERE user_id = $1 AND character_id = $2',
            [userId, id]
        );
        
        if (existingFav.rows.length > 0) {
            return res.status(400).json({ message: 'Character already in favorites' });
        }
    
        await query(
            'INSERT INTO favorites (user_id, character_id) VALUES ($1, $2)',
            [userId, id]
        );
        
        res.status(201).json({ message: 'Character added to favorites' });
        } catch (error) {
        console.error('Error in addToFavorites:', error);
        res.status(500).json({ message: 'Error adding character to favorites' });
        }
    },
    
    
    async removeFromFavorites(req, res) {
        try {
        const { id } = req.params;
        const userId = req.user.id;
        const result = await query(
            'DELETE FROM favorites WHERE user_id = $1 AND character_id = $2',
            [userId, id]
        );
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Character not found in favorites' });
        }
        
        res.json({ message: 'Character removed from favorites' });
        } catch (error) {
        console.error('Error in removeFromFavorites:', error);
        res.status(500).json({ message: 'Error removing character from favorites' });
        }
    },

    async getFavorites(req, res) {
        try {
        const userId = req.user.id;
        const favoritesResult = await query(
            'SELECT character_id FROM favorites WHERE user_id = $1 ORDER BY date_added DESC',
            [userId]
        );
        if (favoritesResult.rows.length === 0) {
            return res.json({ favorites: [] });
        }
        const favorites = [];
        
        for (const row of favoritesResult.rows) {
            try {
            const characterData = await batmanApi.getCharacterById(row.character_id);
            const character = {
                id: characterData.data.id,
                ...characterData.data.attributes,
                isFavorite: true
            };
            
            favorites.push(character);
            } catch (apiError) {
            console.error(`Could not fetch character ${row.character_id}:`, apiError);
            }
        }
        
        res.json({ favorites });
        } catch (error) {
        console.error('Error in getFavorites:', error);
        res.status(500).json({ message: 'Error fetching favorites' });
        }
    },
    
    async rateCharacter(req, res) {
        try {
        const { id } = req.params;
        const { rating, review } = req.body;
        const userId = req.user.id;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        
        // Check if character exists
        try {
            await batmanApi.getCharacterById(id);
        } catch (apiError) {
            return res.status(404).json({ message: 'Character not found' });
        }
        
        // Check if already rated
        const existingRating = await query(
            'SELECT * FROM ratings WHERE user_id = $1 AND character_id = $2',
            [userId, id]
        );
        
        if (existingRating.rows.length > 0) {
            await query(
            `UPDATE ratings 
            SET rating = $1, review = $2, date_modified = CURRENT_TIMESTAMP
            WHERE user_id = $3 AND character_id = $4`,
            [rating, review || null, userId, id]
            );
            
            return res.json({ message: 'Rating updated successfully' });
        }
        await query(
            'INSERT INTO ratings (user_id, character_id, rating, review) VALUES ($1, $2, $3, $4)',
            [userId, id, rating, review || null]
        );
        
        res.status(201).json({ message: 'Character rated successfully' });
        } catch (error) {
        console.error('Error in rateCharacter:', error);
        res.status(500).json({ message: 'Error rating character' });
        }
    },
async getRecommendations(req, res) {
        try {
        const userId = req.user.id;
        const allCharacters = await batmanApi.getCharacters({ pageSize: 100 });
        const randomCharacters = allCharacters.data
            .sort(() => 0.5 - Math.random()) 
            .slice(0, 5)
            .map(char => ({
            id: char.id,
            ...char.attributes
            }));
    
        res.json({
            recommendations: randomCharacters,
            type: 'suggested'
        });
        } catch (error) {
        console.error('Error in getRecommendations:', error);
        res.status(500).json({ message: 'Error getting recommendations' });
        }
    }
}


module.exports = characterHandler;