# Simple Chat App - Real-time Version

Aplikasi chat real-time menggunakan Node.js, Socket.IO, dan MySQL.

## 🚀 Setup Backend

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Setup Database MySQL
1. Buka phpMyAdmin atau MySQL Workbench
2. Import file `database.sql` atau jalankan query:
```sql
CREATE DATABASE simple_chat;
USE simple_chat;

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    is_online BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    username VARCHAR(50),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 3. Konfigurasi Database
Edit `server/server.js` jika perlu:
```javascript
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // sesuaikan password MySQL
    database: 'simple_chat'
};
```

### 4. Jalankan Server
```bash
cd server
npm start
# atau untuk development:
npm run dev
```

Server akan berjalan di `http://localhost:3000`

## 🌐 Setup Frontend

1. Pastikan XAMPP Apache sudah running
2. Akses `http://localhost/chat/front-chat-demo/`
3. Buka di beberapa tab/browser untuk test multi-user

## ✨ Fitur Real-time

### 🔥 **Multi-user Chat**
- Multiple users dapat chat bersamaan
- Real-time message delivery
- User join/leave notifications

### 👥 **User Management**
- Auto-register user baru
- Online/offline status real-time
- User list yang update otomatis

### ⌨️ **Typing Indicator**
- Menampilkan siapa yang sedang mengetik
- Auto-hide setelah 1 detik tidak mengetik
- Multiple users typing support

### 💾 **Database Persistence**
- Semua pesan tersimpan di MySQL
- History chat tetap ada setelah refresh
- User data persistent

### 🔄 **Real-time Updates**
- Instant message delivery
- Live user status updates
- Auto-reconnection handling

## 🛠️ Teknologi Stack

### Backend:
- **Node.js** - Runtime JavaScript
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **MySQL2** - Database driver
- **UUID** - Unique ID generation

### Frontend:
- **HTML5** - Structure
- **CSS3** - Modern styling
- **Vanilla JavaScript** - Client logic
- **Socket.IO Client** - Real-time connection

## 📡 Socket Events

### Client → Server:
- `user_login` - User masuk chat
- `send_message` - Kirim pesan
- `typing_start` - Mulai mengetik
- `typing_stop` - Berhenti mengetik

### Server → Client:
- `recent_messages` - History pesan
- `new_message` - Pesan baru
- `online_users` - Daftar user online
- `user_joined` - User bergabung
- `user_left` - User keluar
- `user_typing` - Status mengetik

## 🔧 Development

### Install Nodemon (optional):
```bash
npm install -g nodemon
```

### Environment Variables:
Buat file `.env` di folder server:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=simple_chat
```

### API Endpoints:
- `GET /api/messages` - Ambil semua pesan
- `GET /api/users` - Ambil semua user

## 🐛 Troubleshooting

### Server tidak bisa connect ke MySQL:
1. Pastikan MySQL service running
2. Check username/password di config
3. Pastikan database `simple_chat` sudah dibuat

### Socket.IO connection failed:
1. Pastikan server Node.js running di port 3000
2. Check CORS settings jika akses dari domain berbeda
3. Pastikan firewall tidak block port 3000

### Frontend tidak update real-time:
1. Check browser console untuk error
2. Pastikan Socket.IO CDN loaded
3. Test dengan multiple browser tabs

## 🚀 Production Deployment

### 1. Environment Setup:
```bash
NODE_ENV=production
PORT=3000
```

### 2. Process Manager (PM2):
```bash
npm install -g pm2
pm2 start server.js --name "chat-app"
pm2 startup
pm2 save
```

### 3. Nginx Reverse Proxy:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Database Schema

```
users
├── id (VARCHAR(36)) - Primary Key
├── username (VARCHAR(50)) - Unique
├── is_online (BOOLEAN)
├── last_seen (TIMESTAMP)
└── created_at (TIMESTAMP)

messages
├── id (VARCHAR(36)) - Primary Key
├── user_id (VARCHAR(36)) - Foreign Key
├── username (VARCHAR(50))
├── message (TEXT)
└── created_at (TIMESTAMP)
```

## 🎯 Next Features

- [ ] Private messaging
- [ ] File/image sharing
- [ ] Message reactions
- [ ] User avatars
- [ ] Chat rooms/channels
- [ ] Message encryption
- [ ] Push notifications
- [ ] Mobile app (React Native)

---

**Happy Real-time Chatting! 🎉**