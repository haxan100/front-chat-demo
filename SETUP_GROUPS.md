# Setup Groups & Direct Messages

## 🚀 Quick Setup

### 1. Update Database
```bash
# Import database_v2.sql ke MySQL
# Atau jalankan query berikut:
```

```sql
-- Tambah tables baru
CREATE TABLE IF NOT EXISTS groups (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_private BOOLEAN DEFAULT FALSE,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS group_members (
    id VARCHAR(36) PRIMARY KEY,
    group_id VARCHAR(36),
    user_id VARCHAR(36),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Update messages table
ALTER TABLE messages 
ADD COLUMN group_id VARCHAR(36) NULL,
ADD COLUMN recipient_id VARCHAR(36) NULL,
ADD COLUMN message_type ENUM('group', 'direct') DEFAULT 'group';

-- Default groups
INSERT INTO groups (id, name, description) VALUES 
('general-group', 'General', 'General discussion for everyone'),
('random-group', 'Random', 'Random chat and fun topics');
```

### 2. Restart Server
```bash
cd server
npm start
```

### 3. Test Features
- Buka multiple browser tabs
- Login dengan username berbeda
- Test group chat dan direct messages

## ✨ New Features

### 🏠 **Group Chat**
- **Multiple Groups**: General, Random, dll
- **Group Switching**: Click group untuk pindah
- **Group Messages**: Pesan hanya terlihat di group tersebut
- **Active Indicator**: Group aktif ditandai dengan highlight

### 💬 **Direct Messages**
- **Private Chat**: Click user untuk chat pribadi
- **1-on-1 Conversation**: Hanya sender dan recipient yang bisa lihat
- **Message History**: Riwayat chat tersimpan per user
- **Real-time**: Instant delivery seperti group chat

### ⌨️ **Enhanced Typing**
- **Group Typing**: Typing indicator per group
- **Direct Typing**: Typing indicator untuk DM
- **Multiple Users**: Support multiple users typing

## 🎯 How to Use

### Group Chat:
1. Login ke aplikasi
2. Sidebar kiri menampilkan daftar groups
3. Click group untuk join
4. Ketik pesan dan kirim
5. Semua member group akan menerima pesan

### Direct Message:
1. Login ke aplikasi
2. Sidebar kiri menampilkan daftar users online
3. Click username untuk mulai DM
4. Chat header berubah jadi "Direct message"
5. Hanya Anda dan user tersebut yang bisa lihat pesan

## 🔧 UI Changes

### Sidebar Layout:
```
┌─────────────────┐
│ Groups          │
├─────────────────┤
│ • General   [*] │ <- Active group
│ • Random        │
├─────────────────┤
│ Users (3 online)│
├─────────────────┤
│ • John     [●]  │ <- Online user
│ • Jane     [●]  │
│ • Bob      [○]  │ <- Offline user
└─────────────────┘
```

### Chat Header:
- **Group**: "General - Group chat"
- **DM**: "John - Direct message"

## 🛠️ Technical Details

### Database Schema:
```
groups
├── id (VARCHAR(36))
├── name (VARCHAR(100))
├── description (TEXT)
└── created_at (TIMESTAMP)

messages
├── id (VARCHAR(36))
├── user_id (VARCHAR(36))
├── username (VARCHAR(50))
├── message (TEXT)
├── group_id (VARCHAR(36)) <- NULL for DM
├── recipient_id (VARCHAR(36)) <- NULL for group
├── message_type (ENUM: 'group', 'direct')
└── created_at (TIMESTAMP)
```

### Socket Events:
```javascript
// Groups
socket.emit('join_group', groupId)
socket.emit('send_group_message', { text })

// Direct Messages  
socket.emit('send_direct_message', { text, recipientId })
socket.emit('get_direct_messages', otherUserId)

// Typing
socket.emit('typing_start') // for groups
socket.emit('typing_direct_start', recipientId) // for DM
```

## 🎉 Demo Flow

1. **User A** login → Join "General" group
2. **User B** login → Join "General" group  
3. **User A** kirim pesan di General → **User B** terima
4. **User A** click **User B** di sidebar → Mulai DM
5. **User A** kirim DM → Hanya **User B** yang terima
6. **User B** balas DM → Hanya **User A** yang terima
7. **User A** switch ke "Random" group → Chat terpisah dari General

---

**Multi-user Group & DM Chat Ready! 🎊**