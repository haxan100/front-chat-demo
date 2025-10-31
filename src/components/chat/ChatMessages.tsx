import { Message } from '@/types/chat';

interface ChatMessagesProps {
  messages: Message[];
  currentUsername: string;
  isTyping: boolean;
  typingUser: string;
}

export const ChatMessages = ({ messages, currentUsername, isTyping, typingUser }: ChatMessagesProps) => {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {messages.map((message) => {
        const isSent = message.senderName === currentUsername;
        
        return (
          <div
            key={message.id}
            className={`flex ${isSent ? 'justify-end' : 'justify-start'} animate-slide-in-up`}
          >
            <div className={`max-w-[70%] ${isSent ? 'order-2' : 'order-1'}`}>
              {!isSent && (
                <p className="text-xs text-muted-foreground mb-1 px-1 font-medium">
                  {message.senderName}
                </p>
              )}
              <div
                className={`rounded-2xl px-4 py-2.5 shadow-md ${
                  isSent
                    ? 'bg-[hsl(var(--chat-bubble-sent))] text-white rounded-br-sm'
                    : 'bg-[hsl(var(--chat-bubble-received))] text-foreground rounded-bl-sm border border-border'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${isSent ? 'text-white/70' : 'text-muted-foreground'}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      
      {isTyping && (
        <div className="flex justify-start animate-slide-in-up">
          <div className="max-w-[70%]">
            <p className="text-xs text-muted-foreground mb-1 px-1 font-medium">
              {typingUser}
            </p>
            <div className="bg-[hsl(var(--chat-bubble-received))] border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[hsl(var(--typing-indicator))] rounded-full animate-pulse-dot" style={{ animationDelay: '0s' }} />
                <span className="w-2 h-2 bg-[hsl(var(--typing-indicator))] rounded-full animate-pulse-dot" style={{ animationDelay: '0.2s' }} />
                <span className="w-2 h-2 bg-[hsl(var(--typing-indicator))] rounded-full animate-pulse-dot" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
