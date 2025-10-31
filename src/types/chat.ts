export interface User {
  id: string;
  name: string;
  isOnline: boolean;
  avatar: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
}
