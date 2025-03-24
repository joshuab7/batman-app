
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  character_id INTEGER NOT NULL,
  date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS ratings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  character_id INTEGER NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modified TIMESTAMP,
  UNIQUE(user_id, character_id)
);
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  theme VARCHAR(20) DEFAULT 'light'
);

CREATE TABLE IF NOT EXISTS preferred_categories (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  UNIQUE(user_id, category)
);
CREATE TABLE IF NOT EXISTS custom_lists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  list_name VARCHAR(100) NOT NULL,
  description TEXT,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modified TIMESTAMP,
  UNIQUE(user_id, list_name)
);
CREATE TABLE IF NOT EXISTS custom_list_items (
  id SERIAL PRIMARY KEY,
  list_id INTEGER REFERENCES custom_lists(id) ON DELETE CASCADE,
  character_id INTEGER NOT NULL,
  date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(list_id, character_id)
);
CREATE TABLE IF NOT EXISTS browsing_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  character_id INTEGER NOT NULL,
  view_count INTEGER DEFAULT 1,
  last_viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS character_connections (
  id SERIAL PRIMARY KEY,
  character_id_1 INTEGER NOT NULL,
  character_id_2 INTEGER NOT NULL,
  relationship_type VARCHAR(50),
  description TEXT,
  UNIQUE(character_id_1, character_id_2)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_character_id ON favorites(character_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_character_id ON ratings(character_id);
CREATE INDEX IF NOT EXISTS idx_browsing_user_id ON browsing_history(user_id);
CREATE INDEX IF NOT EXISTS idx_browsing_character_id ON browsing_history(character_id);
CREATE INDEX IF NOT EXISTS idx_connections_char1 ON character_connections(character_id_1);
CREATE INDEX IF NOT EXISTS idx_connections_char2 ON character_connections(character_id_2);