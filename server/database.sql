-- Create database
CREATE DATABASE IF NOT EXISTS simple_chat;
USE simple_chat;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    is_online BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    username VARCHAR(50),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for better performance
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_users_online ON users(is_online);

-- Sample data (optional)
INSERT IGNORE INTO users (id, username, is_online) VALUES 
('sample-1', 'Admin', FALSE),
('sample-2', 'Bot', FALSE);

INSERT IGNORE INTO messages (id, user_id, username, message) VALUES 
('msg-1', 'sample-1', 'Admin', 'Selamat datang di Simple Chat App!'),
('msg-2', 'sample-2', 'Bot', 'Halo semua! Saya adalah bot chat.');