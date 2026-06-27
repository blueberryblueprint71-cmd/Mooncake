import React, { useState, useEffect, useCallback } from 'react';
import { Compass, Rabbit, PenTool, User as UserIcon, AlertCircle } from 'lucide-react';
import DiscoveryTab from './components/DiscoveryTab';
import ChatDeckTab from './components/ChatDeckTab';
import StudioTab from './components/StudioTab';
import ProfileTab from './components/ProfileTab';
import ChatInterface from './components/ChatInterface';
import SplashScreen from './components/SplashScreen';
import { Character, ChatSession } from './types';

type Tab = 'discovery' | 'chats' | 'studio' | 'profile';

const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('discovery');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeChat, setActiveChat] = useState<{ character: Character, session: ChatSession | null } | null>(null);

  // Daily Limit State
  const [messageCount, setMessageCount] = useState(0);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const DAILY_LIMIT = 5; // Mock limit for demonstration

  // Safely load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('mooncake_sessions');
      if (saved) {
        setSessions(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Preview Environment: Could not access localStorage to load sessions.", e);
    }
  }, []);

  // Safely save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mooncake_sessions', JSON.stringify(sessions));
    } catch (e) {
      console.warn("Preview Environment: Could not access localStorage to save sessions.", e);
    }
  }, [sessions]);

  const handleSplashFinish = useCallback(() => {
    setIsAppLoading(false);
  }, []);

  const handleStartChat = (character: Character) => {
    const existingSession = sessions.find(s => s.characterId === character.id);
    setActiveChat({ character, session: existingSession || null });
  };

  const handleUpdateSession = (updatedSession: ChatSession) => {
    setSessions(prev => {
      const exists = prev.findIndex(s => s.id === updatedSession.id);
      if (exists >= 0) {
        const newSessions = [...prev];
        newSessions[exists] = updatedSession;
        return newSessions;
      }
      return [...prev, updatedSession];
    });
    
    if (activeChat && activeChat.character.id === updatedSession.characterId) {
      setActiveChat({ character: activeChat.character, session: updatedSession });
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const handleCheckLimit = () => {
    if (messageCount >= DAILY_LIMIT) {
      setShowLimitPopup(true);
      return false;
    }
    setMessageCount(prev => prev + 1);
    return true;
  };

  return (
    <div className="h-full w-full flex flex-col bg-moon-bg text-gray-100 font-sans relative overflow-hidden">
      
      {/* Splash Screen Overlay */}
      {isAppLoading && <SplashScreen onFinish={handleSplashFinish} />}

      {/* Top Bar */}
      <header className="flex justify-between items-center p-5 z-10">
        <h1 className="text-3xl font-display font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-moon-pink via-moon-purple to-moon-blue tracking-tight drop-shadow-sm flex items-center gap-2">
          Mooncake <span className="text-2xl animate-bounce-soft">🥮</span>
        </h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col relative z-0">
        {activeTab === 'discovery' && <DiscoveryTab onStartChat={handleStartChat} />}
        {activeTab === 'chats' && <ChatDeckTab sessions={sessions} onResumeChat={(s, c) => setActiveChat({ character: c, session: s })} onDeleteSession={handleDeleteSession} />}
        {activeTab === 'studio' && <StudioTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <div className="absolute bottom-6 left-4 right-4 z-20 flex justify-center pointer-events-none">
        <nav className="glass-panel rounded-[2rem] px-2 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] pointer-events-auto max-w-md w-full border border-white/10">
          <div className="flex justify-around items-center">
            <NavButton 
              icon={<Compass />} 
              label="Discover" 
              isActive={activeTab === 'discovery'} 
              onClick={() => setActiveTab('discovery')} 
            />
            <NavButton 
              icon={<Rabbit />} 
              label="Chats" 
              isActive={activeTab === 'chats'} 
              onClick={() => setActiveTab('chats')} 
              badge={sessions.length > 0 ? sessions.length : undefined}
            />
            <NavButton 
              icon={<PenTool />} 
              label="Studio" 
              isActive={activeTab === 'studio'} 
              onClick={() => setActiveTab('studio')} 
            />
            <NavButton 
              icon={<UserIcon />} 
              label="Profile" 
              isActive={activeTab === 'profile'} 
              onClick={() => setActiveTab('profile')} 
            />
          </div>
        </nav>
      </div>

      {/* Chat Interface Overlay */}
      {activeChat && (
        <ChatInterface 
          character={activeChat.character} 
          session={activeChat.session} 
          onClose={() => setActiveChat(null)}
          onUpdateSession={handleUpdateSession}
          onCheckLimit={handleCheckLimit}
        />
      )}

      {/* Limit Exceeded Popup */}
      {showLimitPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-moon-surface border-2 border-moon-pink/30 rounded-[2rem] p-8 max-w-sm w-full shadow-[0_0_50px_rgba(255,143,179,0.2)] flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-moon-pink/20 rounded-full flex items-center justify-center mb-5">
              <AlertCircle className="h-10 w-10 text-moon-pink" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-3">Oh no! Out of Energy 🥺</h2>
            <p className="text-gray-300 mb-8 text-sm leading-relaxed font-medium">
              You've used up all your magic energy for today! Take a little break, or upgrade to Mooncake Premium for unlimited chats. ✨
            </p>
            <button 
              onClick={() => setShowLimitPopup(false)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-moon-pink to-moon-purple text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg"
            >
              Got it! 💖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for Nav Buttons
const NavButton: React.FC<{ icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void, badge?: number }> = ({ icon, label, isActive, onClick, badge }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-16 h-14 relative transition-all duration-300 ${isActive ? 'text-moon-pink' : 'text-gray-400 hover:text-gray-200'}`}
  >
    <div className={`mb-1 transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_10px_rgba(255,143,179,0.6)]' : 'scale-100'}`}>
      {React.cloneElement(icon as React.ReactElement, { className: 'h-6 w-6' })}
    </div>
    <span className={`text-[11px] font-bold transition-all ${isActive ? 'opacity-100' : 'opacity-0 translate-y-1 absolute bottom-0'}`}>
      {label}
    </span>
    {badge !== undefined && (
      <span className="absolute top-0 right-2 bg-moon-blue text-moon-bg text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border-2 border-moon-surface shadow-sm">
        {badge}
      </span>
    )}
  </button>
);

export default App;