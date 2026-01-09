export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  coverPhoto?: string;
  bio?: string;
  dateOfBirth: string;
  gender?: 'male' | 'female' | 'other';
  location?: string;
  website?: string;
  isVerified: boolean;
  isOnline: boolean;
  lastSeen?: string;
  friends: string[];
  followers: string[];
  following: string[];
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface Post {
  _id: string;
  user: User;
  content: string;
  media?: Array<{ type: 'image' | 'video'; url: string }>;
  visibility: 'public' | 'friends' | 'private';
  feeling?: string;
  location?: string;
  taggedUsers?: string[];
  reactionCount: number;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  isPinned?: boolean;
  isArchived?: boolean;
  createdAt: string;
}

export interface Comment {
  _id: string;
  user: User;
  content: string;
  replyCount: number;
  reactionCount: number;
  createdAt: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: User;
  content?: string;
  media?: { type: 'image' | 'video'; url: string };
  reactions: Array<{ user: string; emoji: string }>;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount?: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  sender: User;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Story {
  _id: string;
  user: User;
  media: { type: 'image' | 'video'; url: string };
  caption?: string;
  viewerCount: number;
  reactionCount: number;
  expiresAt: string;
  createdAt: string;
}

export interface Group {
  _id: string;
  name: string;
  description: string;
  avatar?: string;
  creator: User;
  admins: string[];
  members: string[];
  memberCount: number;
  privacy: 'public' | 'private' | 'secret';
  createdAt: string;
}
