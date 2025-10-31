import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { UserList } from '@/components/chat/UserList';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { ChatInput } from '@/components/chat/ChatInput';
import { Message, User } from '@/types/chat';

const DUMMY_USERS: User[] = [
  { id: '1', name: 'Andi', isOnline: true, avatar: 'A' },
  { id: '2', name: 'Budi', isOnline: true, avatar: 'B' },
  { id: '3', name: 'Sinta', isOnline: false, avatar: 'S' },
];

const INITIAL_MESSAGES: Message[] = [
  { id: '1', senderId: '1', senderName: 'Andi', text: 'Halo semuanya!', timestamp: new Date(Date.now() - 300000) },
  { id: '2', senderId: '2', senderName: 'Budi', text: 'Hai Andi! Apa kabar?', timestamp: new Date(Date.now() - 240000) },
  { id: '3', senderId: '1', senderName: 'Andi', text: 'Baik! Lagi ngapain nih?', timestamp: new Date(Date.now() - 180000) },
];

const Chat = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('chat-username');
    if (!storedUsername) {
      navigate('/login');
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderName: username,
      text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);

    // Simulate response from random user after 2-4 seconds
    const randomDelay = Math.random() * 2000 + 2000;
    const randomUser = DUMMY_USERS[Math.floor(Math.random() * DUMMY_USERS.length)];
    
    setTimeout(() => {
      setTypingUser(randomUser.name);
      setIsTyping(true);
      
      setTimeout(() => {
        setIsTyping(false);
        setTypingUser('');
        
        const responses = [
          'Setuju banget!',
          'Haha lucu ya',
          'Iya nih, betul',
          'Wah menarik!',
          'Boleh juga idenya',
        ];
        
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          senderId: randomUser.id,
          senderName: randomUser.name,
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, responseMessage]);
      }, 1500);
    }, randomDelay);
  };

  const handleLogout = () => {
    localStorage.removeItem('chat-username');
    navigate('/login');
  };

  if (!username) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-card border-r border-border flex-shrink-0 hidden md:flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-lg text-foreground">Pengguna</h2>
          <p className="text-sm text-muted-foreground">{DUMMY_USERS.filter(u => u.isOnline).length} online</p>
        </div>
        <UserList users={DUMMY_USERS} />
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        <ChatHeader username={username} onLogout={handleLogout} />
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <ChatMessages 
            messages={messages} 
            currentUsername={username}
            isTyping={isTyping}
            typingUser={typingUser}
          />
          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSendMessage={handleSendMessage} />
      </main>
    </div>
  );
};

export default Chat;
