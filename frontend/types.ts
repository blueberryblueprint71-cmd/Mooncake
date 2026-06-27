export interface Character {
  id: string;
  name: string;
  tagline: string;
  avatarUrl: string;
  coverUrl: string;
  description: string;
  systemPrompt: string;
  greeting: string;
  tags: string[];
  activeUsers: number;
  themeColor: string; // Tailwind gradient class
  voiceId?: string;
  traits: { name: string; value: number }[]; // 0-100
  gender: 'Female' | 'Male' | 'Non-binary' | 'Other';
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  imageUrl?: string;
  timestamp: number;
  isError?: boolean;
  status?: 'sending' | 'sent' | 'error';
}

export interface ChatSession {
  id: string;
  characterId: string;
  messages: Message[];
  lastUpdated: number;
}

export interface FeedPost {
  id: string;
  characterId: string;
  imageUrl?: string;
  videoUrl?: string; // For Reels/Videos
  caption: string;
  likes: number;
  comments: number;
  timestamp: number;
  scenarioPrompt?: string; // The hook for "Jump into Story"
}