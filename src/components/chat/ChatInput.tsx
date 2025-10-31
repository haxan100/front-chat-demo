import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

export const ChatInput = ({ onSendMessage }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-card border-t border-border p-4"
    >
      <div className="flex gap-2 max-w-4xl mx-auto">
        <Input
          type="text"
          placeholder="Ketik pesan..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 h-12 rounded-xl border-2 focus:border-primary transition-all"
        />
        <Button
          type="submit"
          size="icon"
          className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
          disabled={!message.trim()}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </Button>
      </div>
    </form>
  );
};
