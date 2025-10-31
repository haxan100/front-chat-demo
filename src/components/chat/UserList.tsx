import { User } from '@/types/chat';

interface UserListProps {
  users: User[];
}

export const UserList = ({ users }: UserListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-2">
      {users.map(user => (
        <div
          key={user.id}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-lg">
              {user.avatar}
            </div>
            <div
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-card ${
                user.isOnline ? 'bg-[hsl(var(--online-indicator))]' : 'bg-[hsl(var(--offline-indicator))]'
              }`}
            />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">
              {user.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
