import React from 'react';
import { MessageSquare, Clock, Trash2, Rabbit } from 'lucide-react';
import { ChatSession, Character } from '../types';
import { MOCK_CHARACTERS } from '../constants';

interface ChatDeckTabProps {
  sessions: ChatSession[];
  onResumeChat: (session: ChatSession, character: Character) => void;
  onDeleteSession: (sessionId: string) => void;
}

const ChatDeckTab: React.FC<ChatDeckTabProps> = ({ sessions, onResumeChat, onDeleteSession }) => {
  
  const getCharacter = (id: string) => MOCK_CHARACTERS.find(c => c.id === id);

  if (sessions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center h-full">
        <div className="w-28 h-28 rounded-full bg-moon-surface flex items-center justify-center mb-6 border border-white/5 shadow-[0_0_40px_rgba(255,143,179,0.1)]">
          <Rabbit className="h-12 w-12 text-moon-pink opacity-80" />
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-3 tracking-tight">No Chats Yet! 🐰</h2>
        <p className="text-gray-400 max-w-xs font-medium leading-relaxed">Your inbox is looking a little empty. Go find some new friends in the Discovery hub!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar pb-28 p-5">
      <div className="flex justify-between items-end mb-6 px-1">
        <h2 className="text-2xl font-display font-bold text-white tracking-tight">Your Chats</h2>
        <span className="text-sm text-moon-pink font-bold bg-moon-pink/10 px-3 py-1 rounded-full">{sessions.length} Active</span>
      </div>
      
      <div className="space-y-4">
        {sessions.sort((a, b) => b.lastUpdated - a.lastUpdated).map(session => {
          const character = getCharacter(session.characterId);
          if (!character) return null;
          
          const lastMessage = session.messages[session.messages.length - 1];
          const timeString = new Date(session.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const isUnread = lastMessage?.role === 'model';

          return (
            <div 
              key={session.id}
              className="group relative flex items-center gap-4 p-4 bg-moon-surface/80 backdrop-blur-md border border-white/5 rounded-[1.5rem] hover:bg-white/5 transition-all cursor-pointer overflow-hidden shadow-sm"
              onClick={() => onResumeChat(session, character)}
            >
              {/* Left Accent Line */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${character.themeColor} opacity-60 group-hover:opacity-100 transition-opacity`}></div>

              <div className="relative flex-shrink-0 ml-1">
                <img src={character.avatarUrl} alt={character.name} className="w-16 h-16 rounded-full object-cover border-2 border-white/10 shadow-md" />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-moon-surface rounded-full"></div>
              </div>
              
              <div className="flex-1 min-w-0 py-1">
                <div className="flex justify-between items-center mb-1.5">
                  <h3 className={`font-display font-bold text-lg truncate pr-2 ${isUnread ? 'text-white' : 'text-gray-300'}`}>
                    {character.name}
                  </h3>
                  <span className="text-xs text-gray-500 flex-shrink-0 font-bold">
                    {timeString}
                  </span>
                </div>
                <p className={`text-sm truncate ${isUnread ? 'text-gray-200 font-bold' : 'text-gray-500 font-medium'}`}>
                  {lastMessage?.role === 'user' ? <span className="text-gray-500">You: </span> : ''}
                  {lastMessage?.text || 'Connection established...'}
                </p>
              </div>

              {/* Unread Dot */}
              {isUnread && (
                <div className="w-3 h-3 rounded-full bg-moon-pink shadow-[0_0_10px_rgba(255,143,179,0.8)] flex-shrink-0 mr-2"></div>
              )}

              {/* Delete Action (Hover/Focus) */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="absolute right-4 p-2.5 bg-red-500/20 text-red-400 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all transform translate-x-4 group-hover:translate-x-0"
                title="Delete Chat"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatDeckTab;