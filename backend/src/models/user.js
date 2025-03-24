
const { query } = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
async create(userData) {
    const { username, email, password } = userData;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, date_joined',
        [username, email, hashedPassword]
    );
    
    await query(
        'INSERT INTO user_preferences (user_id, theme) VALUES ($1, $2)',
        [result.rows[0].id, 'dark']
    );
    
    return result.rows[0];
},
async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
        [email]
    );
    
    return result.rows[0] || null;
},
async findByUsername(username) {
    const result = await query(
      'SELECT * FROM users WHERE username = $1',
        [username]
    );
    
    return result.rows[0] || null;
},
async findById(id) {
    const result = await query(
        'SELECT id, username, email, date_joined, last_login FROM users WHERE id = $1',
        [id]
    );
    
    return result.rows[0] || null;
},
async updateLastLogin(id) {
    await query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [id]
    );
},
async getPreferences(userId) {
    const result = await query(
      'SELECT * FROM user_preferences WHERE user_id = $1',
        [userId]
    );
    if (result.rows.length === 0) {
        const newPrefs = await query(
            'INSERT INTO user_preferences (user_id, theme) VALUES ($1, $2) RETURNING *',
            [userId, 'dark']
            );
        return newPrefs.rows[0];
    }
    
    return result.rows[0];
},
async updateTheme(userId, theme) {
    const result = await query(
        'UPDATE user_preferences SET theme = $1 WHERE user_id = $2 RETURNING *',
        [theme, userId]
    );
    
    if (result.rows.length === 0) {
        const newPrefs = await query(
        'INSERT INTO user_preferences (user_id, theme) VALUES ($1, $2) RETURNING *',
        [userId, theme]
        );
        return newPrefs.rows[0];
    }
    
    return result.rows[0];
    }
};

module.exports = User;