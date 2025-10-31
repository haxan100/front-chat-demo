// Application State
let currentUser = '';
let currentUserId = '';
let messages = [];
let onlineUsers = [];
let availableGroups = [];
let currentRoom = 'general-group';
let currentRoomType = 'group'; // 'group' or 'direct'
let currentDirectUser = null;
let socket = null;
let isTyping = false;
let typingUsers = new Set();
let typingTimeout = null;

// DOM Elements
const landingPage = document.getElementById('landing-page');
const loginPage = document.getElementById('login-page');
const chatPage = document.getElementById('chat-page');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const currentUsernameEl = document.getElementById('current-username');
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const chatForm = document.getElementById('chat-form');
const userList = document.getElementById('user-list');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Setup event listeners
    setupEventListeners();
    
    // Check if user is already logged in
    const savedUsername = localStorage.getItem('chat-username');
    if (savedUsername) {
        currentUser = savedUsername;
        connectSocket();
        showChat();
    } else {
        showLanding();
    }
});

// Socket.IO Connection
function connectSocket() {
    socket = io('http://localhost:3000');
    
    socket.on('connect', () => {
        console.log('Connected to server');
        if (currentUser) {
            socket.emit('user_login', currentUser);
        }
    });
    
    socket.on('login_success', (userData) => {
        currentUserId = userData.id;
        console.log('Login successful:', userData);
    });
    
    socket.on('recent_messages', (msgs) => {
        messages = msgs.map(msg => ({
            id: msg.id,
            senderId: msg.user_id,
            senderName: msg.username,
            text: msg.message,
            timestamp: new Date(msg.created_at),
            type: msg.message_type || 'group'
        }));
        renderMessages();
        scrollToBottom();
    });
    
    socket.on('available_groups', (groups) => {
        availableGroups = groups;
        populateGroupList();
    });
    
    socket.on('current_group', (group) => {
        document.getElementById('chat-title').textContent = group.name;
        document.getElementById('chat-subtitle').textContent = 'Group chat';
        currentRoomType = 'group';
        currentDirectUser = null;
    });
    
    socket.on('new_message', (msg) => {
        if (currentRoomType === 'group') {
            const message = {
                id: msg.id,
                senderId: msg.user_id,
                senderName: msg.username,
                text: msg.message,
                timestamp: new Date(msg.created_at),
                type: 'group'
            };
            messages.push(message);
            renderMessages();
            scrollToBottom();
        }
    });
    
    socket.on('new_direct_message', (msg) => {
        if (currentRoomType === 'direct' && currentDirectUser &&
            ((msg.user_id === currentUserId && msg.recipient_id === currentDirectUser.id) ||
             (msg.user_id === currentDirectUser.id && msg.recipient_id === currentUserId))) {
            const message = {
                id: msg.id,
                senderId: msg.user_id,
                senderName: msg.username,
                text: msg.message,
                timestamp: new Date(msg.created_at),
                type: 'direct'
            };
            messages.push(message);
            renderMessages();
            scrollToBottom();
        }
    });
    
    socket.on('direct_messages', (data) => {
        if (currentRoomType === 'direct' && currentDirectUser && data.otherUserId === currentDirectUser.id) {
            messages = data.messages.map(msg => ({
                id: msg.id,
                senderId: msg.user_id,
                senderName: msg.username,
                text: msg.message,
                timestamp: new Date(msg.created_at),
                type: 'direct'
            }));
            renderMessages();
            scrollToBottom();
        }
    });
    
    socket.on('online_users', (users) => {
        onlineUsers = users;
        populateUserList();
    });
    
    socket.on('user_joined', (data) => {
        showToast(`${data.username} bergabung ke chat`, 'success');
    });
    
    socket.on('user_left', (data) => {
        showToast(`${data.username} meninggalkan chat`, 'info');
    });
    
    socket.on('user_typing', (data) => {
        if (data.isTyping) {
            typingUsers.add(data.username);
        } else {
            typingUsers.delete(data.username);
        }
        updateTypingIndicator();
    });
    
    socket.on('error', (error) => {
        console.error('Socket error:', error);
        showToast(error, 'error');
    });
    
    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        showToast('Tidak dapat terhubung ke server', 'error');
    });
    
    socket.on('disconnect', () => {
        showToast('Koneksi terputus', 'error');
    });
}

// Event Listeners
function setupEventListeners() {
    // Login form
    loginForm.addEventListener('submit', handleLogin);
    
    // Chat form
    chatForm.addEventListener('submit', handleSendMessage);
    
    // Message input
    messageInput.addEventListener('input', function() {
        sendBtn.disabled = !this.value.trim();
        
        // Typing indicator
        if (socket && this.value.trim()) {
            if (currentRoomType === 'group') {
                socket.emit('typing_start');
                clearTimeout(typingTimeout);
                typingTimeout = setTimeout(() => {
                    socket.emit('typing_stop');
                }, 1000);
            } else if (currentRoomType === 'direct' && currentDirectUser) {
                socket.emit('typing_direct_start', currentDirectUser.id);
                clearTimeout(typingTimeout);
                typingTimeout = setTimeout(() => {
                    socket.emit('typing_direct_stop', currentDirectUser.id);
                }, 1000);
            }
        } else if (socket) {
            if (currentRoomType === 'group') {
                socket.emit('typing_stop');
            } else if (currentRoomType === 'direct' && currentDirectUser) {
                socket.emit('typing_direct_stop', currentDirectUser.id);
            }
        }
    });
    
    // Enter key for login
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin(e);
        }
    });
}

// Page Navigation
function showLanding() {
    hideAllPages();
    landingPage.classList.add('active');
}

function showLogin() {
    hideAllPages();
    loginPage.classList.add('active');
    setTimeout(() => usernameInput.focus(), 100);
}

function showChat() {
    hideAllPages();
    chatPage.classList.add('active');
    currentUsernameEl.textContent = currentUser;
    renderMessages();
    scrollToBottom();
    setTimeout(() => messageInput.focus(), 100);
}

function hideAllPages() {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
}

// Login Handler
function handleLogin(e) {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    
    if (username.length < 2) {
        showToast('Username terlalu pendek. Masukkan minimal 2 karakter.', 'error');
        return;
    }
    
    currentUser = username;
    localStorage.setItem('chat-username', username);
    
    connectSocket();
    showToast(`Selamat datang, ${username}!`, 'success');
    
    setTimeout(() => {
        showChat();
    }, 1000);
}

// Logout Handler
function logout() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
    localStorage.removeItem('chat-username');
    currentUser = '';
    messages = [];
    onlineUsers = [];
    typingUsers.clear();
    
    showToast('Anda telah keluar dari chat.', 'success');
    
    setTimeout(() => {
        showLanding();
    }, 1000);
}

// Message Handlers
function handleSendMessage(e) {
    e.preventDefault();
    
    const text = messageInput.value.trim();
    if (!text || !socket) return;
    
    if (currentRoomType === 'group') {
        socket.emit('send_group_message', { text });
        socket.emit('typing_stop');
    } else if (currentRoomType === 'direct' && currentDirectUser) {
        socket.emit('send_direct_message', { 
            text, 
            recipientId: currentDirectUser.id 
        });
        socket.emit('typing_direct_stop', currentDirectUser.id);
    }
    
    messageInput.value = '';
    sendBtn.disabled = true;
    clearTimeout(typingTimeout);
}

// Group Functions
function joinGroup(groupId) {
    if (currentRoom === groupId) return;
    
    currentRoom = groupId;
    currentRoomType = 'group';
    currentDirectUser = null;
    messages = [];
    typingUsers.clear();
    
    socket.emit('join_group', groupId);
    
    // Update active group in UI
    document.querySelectorAll('.group-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-group-id="${groupId}"]`)?.classList.add('active');
}

// Direct Message Functions
function startDirectMessage(user) {
    if (currentDirectUser?.id === user.id) return;
    
    currentDirectUser = user;
    currentRoomType = 'direct';
    messages = [];
    typingUsers.clear();
    
    // Update UI
    document.getElementById('chat-title').textContent = user.username;
    document.getElementById('chat-subtitle').textContent = 'Direct message';
    
    // Remove active group
    document.querySelectorAll('.group-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Get direct messages
    socket.emit('get_direct_messages', user.id);
}

// Render Functions
function renderMessages() {
    messagesContainer.innerHTML = '';
    
    messages.forEach(message => {
        const messageEl = createMessageElement(message);
        messagesContainer.appendChild(messageEl);
    });
    
    // Update typing indicators
    updateTypingIndicator();
}

function createMessageElement(message) {
    const isSent = message.senderId === currentUserId;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Add sender name for received messages (only in group chat)
    if (!isSent && currentRoomType === 'group') {
        const senderDiv = document.createElement('div');
        senderDiv.className = 'message-sender';
        senderDiv.textContent = message.senderName;
        contentDiv.appendChild(senderDiv);
    }
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = message.text;
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = formatTime(message.timestamp);
    
    bubbleDiv.appendChild(textDiv);
    bubbleDiv.appendChild(timeDiv);
    contentDiv.appendChild(bubbleDiv);
    messageDiv.appendChild(contentDiv);
    
    return messageDiv;
}

function createTypingIndicator(username) {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'typing-content';
    
    const senderDiv = document.createElement('div');
    senderDiv.className = 'message-sender';
    senderDiv.textContent = username;
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'typing-bubble';
    
    const dotsDiv = document.createElement('div');
    dotsDiv.className = 'typing-dots';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        dotsDiv.appendChild(dot);
    }
    
    bubbleDiv.appendChild(dotsDiv);
    contentDiv.appendChild(senderDiv);
    contentDiv.appendChild(bubbleDiv);
    typingDiv.appendChild(contentDiv);
    
    return typingDiv;
}

function populateGroupList() {
    const groupList = document.getElementById('group-list');
    groupList.innerHTML = '';
    
    availableGroups.forEach(group => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group-item';
        groupDiv.setAttribute('data-group-id', group.id);
        
        if (group.id === currentRoom && currentRoomType === 'group') {
            groupDiv.classList.add('active');
        }
        
        const groupIcon = group.name.charAt(0).toUpperCase();
        
        groupDiv.innerHTML = `
            <div class="group-icon">
                ${groupIcon}
            </div>
            <div class="user-details">
                <h4>${group.name}</h4>
                <p>${group.description || 'Group chat'}</p>
            </div>
        `;
        
        groupDiv.addEventListener('click', () => joinGroup(group.id));
        groupList.appendChild(groupDiv);
    });
}

function populateUserList() {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    
    // Update online count
    const onlineCount = onlineUsers.filter(user => user.is_online).length;
    document.querySelector('.online-count').textContent = `${onlineCount} online`;
    
    onlineUsers.forEach(user => {
        // Skip current user
        if (user.username === currentUser) return;
        
        const userDiv = document.createElement('div');
        userDiv.className = 'user-item';
        
        const avatar = user.username.charAt(0).toUpperCase();
        
        userDiv.innerHTML = `
            <div class="user-avatar">
                ${avatar}
                <div class="user-status ${user.is_online ? 'online' : 'offline'}"></div>
            </div>
            <div class="user-details">
                <h4>${user.username}</h4>
                <p>${user.is_online ? 'Online' : 'Offline'}</p>
            </div>
        `;
        
        userDiv.addEventListener('click', () => startDirectMessage(user));
        userList.appendChild(userDiv);
    });
}

function updateTypingIndicator() {
    // Remove existing typing indicators
    const existingIndicators = document.querySelectorAll('.typing-indicator');
    existingIndicators.forEach(indicator => indicator.remove());
    
    // Add typing indicators for users who are typing
    typingUsers.forEach(username => {
        if (username !== currentUser) {
            const typingEl = createTypingIndicator(username);
            messagesContainer.appendChild(typingEl);
        }
    });
    
    scrollToBottom();
}

// Utility Functions
function formatTime(date) {
    return new Date(date).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function scrollToBottom() {
    setTimeout(() => {
        const container = document.querySelector('.messages-container');
        container.scrollTop = container.scrollHeight;
    }, 100);
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Set content
    toastMessage.textContent = message;
    
    // Set icon and style based on type
    if (type === 'success') {
        toastIcon.className = 'toast-icon fas fa-check-circle';
        toast.className = 'toast success';
    } else if (type === 'error') {
        toastIcon.className = 'toast-icon fas fa-exclamation-circle';
        toast.className = 'toast error';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}



// Handle window resize for responsive design
window.addEventListener('resize', function() {
    if (chatPage.classList.contains('active')) {
        scrollToBottom();
    }
});

// Prevent form submission on empty message
messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (this.value.trim()) {
            handleSendMessage(e);
        }
    }
});

// Add focus styles for accessibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}