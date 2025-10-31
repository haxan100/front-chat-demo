import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  username: string;
  onLogout: () => void;
}

export const ChatHeader = ({ username, onLogout }: ChatHeaderProps) => {
  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-foreground">Simple Chat App</h1>
        <p className="text-sm text-muted-foreground">Real-time conversation</p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{username}</p>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onLogout}
          className="rounded-full hover:bg-destructive/10 hover:text-destructive"
          title="Keluar"
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
        </Button>
      </div>
    </header>
  );
};
