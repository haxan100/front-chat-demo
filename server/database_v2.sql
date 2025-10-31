-- Updated database schema with groups and DM support
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

-- Groups/Rooms table
CREATE TABLE IF NOT EXISTS groups (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_private BOOLEAN DEFAULT FALSE,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Group members
CREATE TABLE IF NOT EXISTS group_members (
    id VARCHAR(36) PRIMARY KEY,
    group_id VARCHAR(36),
    user_id VARCHAR(36),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_membership (group_id, user_id)
);

-- Messages table (updated)
CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    username VARCHAR(50),
    message TEXT NOT NULL,
    group_id VARCHAR(36) NULL,
    recipient_id VARCHAR(36) NULL,
    message_type ENUM('group', 'direct') DEFAULT 'group',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_messages_group ON messages(group_id, created_at);
CREATE INDEX idx_messages_direct ON messages(user_id, recipient_id, created_at);
CREATE INDEX idx_users_online ON users(is_online);

-- Default groups
INSERT IGNORE INTO groups (id, name, description, created_by) VALUES 
('general-group', 'General', 'General discussion for everyone', NULL),
('random-group', 'Random', 'Random chat and fun topics', NULL);

-- Sample data
INSERT IGNORE INTO users (id, username, is_online) VALUES 
('admin-user', 'Admin', FALSE),
('bot-user', 'ChatBot', FALSE);

INSERT IGNORE INTO messages (id, user_id, username, message, group_id, message_type) VALUES 
('welcome-msg', 'admin-user', 'Admin', 'Selamat datang di Simple Chat App! 🎉', 'general-group', 'group'),
('bot-msg', 'bot-user', 'ChatBot', 'Halo! Saya ChatBot. Ketik /help untuk bantuan.', 'general-group', 'group');