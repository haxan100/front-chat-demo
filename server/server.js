const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Database connection
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'simple_chat'
};

let db;

// Initialize database
async function initDB() {
    try {
        // Connect without database first
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password
        });
        
        // Create database if not exists
        await connection.execute('CREATE DATABASE IF NOT EXISTS simple_chat');
        await connection.end();
        
        // Connect to the database
        db = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL database');
        
        // Create tables
        await createTables();
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

async function createTables() {
    try {
        // Users table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(36) PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                is_online BOOLEAN DEFAULT FALSE,
                last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Groups table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS \`groups\` (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                is_private BOOLEAN DEFAULT FALSE,
                created_by VARCHAR(36),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Messages table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS messages (
                id VARCHAR(36) PRIMARY KEY,
                user_id VARCHAR(36),
                username VARCHAR(50),
                message TEXT NOT NULL,
                group_id VARCHAR(36) NULL,
                recipient_id VARCHAR(36) NULL,
                message_type ENUM('group', 'direct') DEFAULT 'group',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        // Insert default groups
        await db.execute(`
            INSERT IGNORE INTO \`groups\` (id, name, description) VALUES 
            ('general-group', 'General', 'General discussion for everyone'),
            ('random-group', 'Random', 'Random chat and fun topics')
        `);
        
        console.log('Database tables created/verified');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
}

// Store connected users and their current rooms
const connectedUsers = new Map();
const userRooms = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    // User login
    socket.on('user_login', async (username) => {
        try {
            if (!db) {
                socket.emit('error', 'Database not connected');
                return;
            }
            
            // Check if user exists, if not create
            let [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
            let user;
            
            if (users.length === 0) {
                const userId = uuidv4();
                await db.execute(
                    'INSERT INTO users (id, username, is_online) VALUES (?, ?, TRUE)',
                    [userId, username]
                );
                user = { id: userId, username, is_online: true };
            } else {
                user = users[0];
                await db.execute('UPDATE users SET is_online = TRUE WHERE id = ?', [user.id]);
                user.is_online = true;
            }
            
            // Store user connection
            connectedUsers.set(socket.id, user);
            socket.userId = user.id;
            socket.username = username;
            
            // Join general group by default
            socket.join('general-group');
            userRooms.set(socket.id, 'general-group');
            
            // Send success response first
            socket.emit('login_success', { id: user.id, username: user.username });
            
            // Send available groups
            const [groups] = await db.execute('SELECT * FROM `groups` ORDER BY name');
            socket.emit('available_groups', groups);
            
            // Send online users to all clients
            const [onlineUsers] = await db.execute('SELECT * FROM users WHERE is_online = TRUE');
            io.emit('online_users', onlineUsers);
            
            // Send recent messages for general group
            const [messages] = await db.execute(
                'SELECT * FROM messages WHERE group_id = ? ORDER BY created_at DESC LIMIT 50',
                ['general-group']
            );
            socket.emit('recent_messages', messages.reverse());
            
            // Notify others in the group
            socket.to('general-group').emit('user_joined', { username, userId: user.id });
            
            console.log(`${username} logged in successfully`);
        } catch (error) {
            console.error('Login error:', error);
            socket.emit('error', `Login failed: ${error.message}`);
        }
    });
    
    // Join group
    socket.on('join_group', async (groupId) => {
        try {
            const user = connectedUsers.get(socket.id);
            if (!user) return;
            
            // Leave current room
            const currentRoom = userRooms.get(socket.id);
            if (currentRoom) {
                socket.leave(currentRoom);
            }
            
            // Join new room
            socket.join(groupId);
            userRooms.set(socket.id, groupId);
            
            // Send recent messages for this group
            const [messages] = await db.execute(
                'SELECT * FROM messages WHERE group_id = ? ORDER BY created_at DESC LIMIT 50',
                [groupId]
            );
            socket.emit('recent_messages', messages.reverse());
            
            // Get group info
            const [groups] = await db.execute('SELECT * FROM `groups` WHERE id = ?', [groupId]);
            socket.emit('current_group', groups[0]);
            
        } catch (error) {
            console.error('Join group error:', error);
        }
    });
    
    // Send group message
    socket.on('send_group_message', async (messageData) => {
        try {
            const user = connectedUsers.get(socket.id);
            const currentRoom = userRooms.get(socket.id);
            if (!user || !currentRoom) return;
            
            const messageId = uuidv4();
            const message = {
                id: messageId,
                user_id: user.id,
                username: user.username,
                message: messageData.text,
                group_id: currentRoom,
                message_type: 'group',
                created_at: new Date()
            };
            
            // Save to database
            await db.execute(
                'INSERT INTO messages (id, user_id, username, message, group_id, message_type) VALUES (?, ?, ?, ?, ?, ?)',
                [messageId, user.id, user.username, messageData.text, currentRoom, 'group']
            );
            
            // Broadcast to group members
            io.to(currentRoom).emit('new_message', message);
            
        } catch (error) {
            console.error('Send group message error:', error);
        }
    });
    
    // Send direct message
    socket.on('send_direct_message', async (messageData) => {
        try {
            const user = connectedUsers.get(socket.id);
            if (!user) return;
            
            const messageId = uuidv4();
            const message = {
                id: messageId,
                user_id: user.id,
                username: user.username,
                message: messageData.text,
                recipient_id: messageData.recipientId,
                message_type: 'direct',
                created_at: new Date()
            };
            
            // Save to database
            await db.execute(
                'INSERT INTO messages (id, user_id, username, message, recipient_id, message_type) VALUES (?, ?, ?, ?, ?, ?)',
                [messageId, user.id, user.username, messageData.text, messageData.recipientId, 'direct']
            );
            
            // Send to recipient and sender
            const recipientSocket = [...connectedUsers.entries()]
                .find(([_, u]) => u.id === messageData.recipientId)?.[0];
            
            if (recipientSocket) {
                io.to(recipientSocket).emit('new_direct_message', message);
            }
            socket.emit('new_direct_message', message);
            
        } catch (error) {
            console.error('Send direct message error:', error);
        }
    });
    
    // Get direct messages
    socket.on('get_direct_messages', async (otherUserId) => {
        try {
            const user = connectedUsers.get(socket.id);
            if (!user) return;
            
            const [messages] = await db.execute(
                `SELECT * FROM messages 
                 WHERE message_type = 'direct' 
                 AND ((user_id = ? AND recipient_id = ?) OR (user_id = ? AND recipient_id = ?))
                 ORDER BY created_at ASC`,
                [user.id, otherUserId, otherUserId, user.id]
            );
            
            socket.emit('direct_messages', { otherUserId, messages });
            
        } catch (error) {
            console.error('Get direct messages error:', error);
        }
    });
    
    // Typing indicator for groups
    socket.on('typing_start', () => {
        const user = connectedUsers.get(socket.id);
        const currentRoom = userRooms.get(socket.id);
        if (user && currentRoom) {
            socket.to(currentRoom).emit('user_typing', { username: user.username, isTyping: true });
        }
    });
    
    socket.on('typing_stop', () => {
        const user = connectedUsers.get(socket.id);
        const currentRoom = userRooms.get(socket.id);
        if (user && currentRoom) {
            socket.to(currentRoom).emit('user_typing', { username: user.username, isTyping: false });
        }
    });
    
    // Typing indicator for direct messages
    socket.on('typing_direct_start', (recipientId) => {
        const user = connectedUsers.get(socket.id);
        if (user) {
            const recipientSocket = [...connectedUsers.entries()]
                .find(([_, u]) => u.id === recipientId)?.[0];
            if (recipientSocket) {
                io.to(recipientSocket).emit('user_typing_direct', { 
                    username: user.username, 
                    userId: user.id,
                    isTyping: true 
                });
            }
        }
    });
    
    socket.on('typing_direct_stop', (recipientId) => {
        const user = connectedUsers.get(socket.id);
        if (user) {
            const recipientSocket = [...connectedUsers.entries()]
                .find(([_, u]) => u.id === recipientId)?.[0];
            if (recipientSocket) {
                io.to(recipientSocket).emit('user_typing_direct', { 
                    username: user.username, 
                    userId: user.id,
                    isTyping: false 
                });
            }
        }
    });
    
    // Disconnect
    socket.on('disconnect', async () => {
        const user = connectedUsers.get(socket.id);
        if (user) {
            try {
                // Update user offline status
                await db.execute('UPDATE users SET is_online = FALSE WHERE id = ?', [user.id]);
                
                // Remove from connected users and rooms
                connectedUsers.delete(socket.id);
                userRooms.delete(socket.id);
                
                // Notify others
                socket.broadcast.emit('user_left', { username: user.username, userId: user.id });
                
                // Send updated online users
                const [onlineUsers] = await db.execute('SELECT * FROM users WHERE is_online = TRUE');
                io.emit('online_users', onlineUsers);
                
                console.log(`${user.username} disconnected`);
            } catch (error) {
                console.error('Disconnect error:', error);
            }
        }
    });
});

// API Routes
app.get('/api/messages', async (req, res) => {
    try {
        const [messages] = await db.execute('SELECT * FROM messages ORDER BY created_at ASC');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, username, is_online, last_seen FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

const PORT = process.env.PORT || 3000;

// Initialize and start server
initDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});