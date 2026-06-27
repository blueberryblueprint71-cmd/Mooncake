import React, { useState } from 'react';
import { 
  User, Settings, Bell, Shield, Camera, LogOut, Trash2, Sparkles, Save, 
  X, Globe, Ban, Smartphone, Volume2, Bug, Lightbulb, Activity, ChevronRight,
  Crown, Lock, Edit3, Pin, MessageSquare
} from 'lucide-react';

type BotTab = 'published' | 'private' | 'drafts';

const ProfileTab: React.FC = () => {
  // User Identity State
  const [name, setName] = useState('StarBunny');
  const [handle, setHandle] = useState('@starbunny_x');
  const [bio, setBio] = useState('Cozy gamer & bot maker! 🌸 I love creating fantasy RPG scenarios and sweet slice-of-life companions. Let\'s bake some memories together! 🥮');
  
  // AI Context State
  const [persona, setPersona] = useState('I use They/Them pronouns. Please format actions using *asterisks* and keep responses relatively short and sweet. I prefer a cozy, non-violent tone.');
  
  // UI State
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeBotTab, setActiveBotTab] = useState<BotTab>('published');

  // Settings State
  const [settings, setSettings] = useState({
    streamResponses: true,
    hapticFeedback: true,
    contentFilter: false,
    notifications: true
  });

  const [advancedSettings, setAdvancedSettings] = useState({
    vibration: true,
    autoPlayVoice: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAdvancedSetting = (key: keyof typeof advancedSettings) => {
    setAdvancedSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar pb-28 p-5 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2 tracking-tight">
          <User className="h-7 w-7 text-moon-pink" /> My Profile
        </h2>
        <button 
          onClick={() => setShowSettingsModal(true)}
          className="p-2.5 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/5 shadow-sm"
        >
          <Settings className="h-5 w-5 text-gray-300" />
        </button>
      </div>

      <div className="space-y-6">
        
        {/* 1. User Identity Section */}
        <div className="bg-moon-surface/60 backdrop-blur-sm p-6 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-moon-pink/20 to-transparent pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start relative z-10">
            {/* Avatar */}
            <div className="relative group cursor-pointer flex-shrink-0">
              <img 
                src="https://picsum.photos/seed/starbunny/200/200" 
                alt="User Avatar" 
                className="w-24 h-24 rounded-full object-cover border-4 border-moon-pink shadow-[0_0_20px_rgba(255,143,179,0.4)] group-hover:opacity-50 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Name, Handle, Bio */}
            <div className="flex-1 w-full space-y-3 text-center sm:text-left">
              <div>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b border-transparent hover:border-white/20 focus:border-moon-pink text-xl font-display font-extrabold text-white outline-none transition-all text-center sm:text-left px-1" 
                  placeholder="Display Name"
                />
                <input 
                  type="text" 
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full bg-transparent border-b border-transparent hover:border-white/20 focus:border-moon-purple text-sm font-bold text-moon-blue outline-none transition-all text-center sm:text-left px-1 mt-1" 
                  placeholder="@username"
                />
              </div>
              <textarea 
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-xl p-3 text-gray-300 focus:border-moon-pink focus:ring-1 focus:ring-moon-pink outline-none transition-all text-xs font-medium resize-none custom-scrollbar" 
                placeholder="Write a short bio about yourself..."
              />
            </div>
          </div>
        </div>

        {/* 2. Account Status Section */}
        <div className="grid grid-cols-2 gap-4">
          {/* Cake Credits */}
          <div className="bg-moon-surface/60 backdrop-blur-sm p-5 rounded-[2rem] border border-white/5 shadow-xl flex flex-col items-center justify-center text-center gap-2">
            <div className="text-3xl animate-bounce-soft">🥮</div>
            <div>
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Cake Balance</p>
              <p className="text-2xl font-display font-extrabold text-white">1,250</p>
            </div>
          </div>

          {/* Subscription Tier */}
          <div className="bg-gradient-to-br from-moon-pink/20 to-moon-purple/20 backdrop-blur-sm p-5 rounded-[2rem] border border-moon-pink/30 shadow-[0_0_20px_rgba(255,143,179,0.15)] flex flex-col items-center justify-center text-center gap-2 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-20">
              <Crown className="w-24 h-24 text-moon-pink" />
            </div>
            <Crown className="h-8 w-8 text-moon-yellow drop-shadow-md z-10" />
            <div className="z-10">
              <p className="text-[10px] font-extrabold text-moon-pink uppercase tracking-wider">Current Plan</p>
              <p className="text-xl font-display font-extrabold text-white">Premium</p>
            </div>
          </div>
        </div>

        {/* 3. Global AI Instructions (User Persona) */}
        <div className="bg-moon-surface/60 backdrop-blur-sm p-6 rounded-[2rem] border border-white/5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-moon-purple" />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">Global AI Instructions</h3>
            </div>
            <button className="text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5">
              <Pin className="h-3 w-3" /> Pinned Memories
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed font-medium">
            Define your persona. The AI reads this to remember your pronouns, formatting preferences (e.g., *actions*), and desired response length across all chats.
          </p>
          <textarea 
            rows={4} 
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-moon-blue focus:border-moon-purple focus:ring-1 focus:ring-moon-purple outline-none transition-all resize-none text-sm font-mono leading-relaxed custom-scrollbar" 
            placeholder="Describe your appearance, background, and roleplay preferences..."
          />
        </div>

        {/* 4. Bot Management Section */}
        <div className="bg-moon-surface/60 backdrop-blur-sm p-6 rounded-[2rem] border border-white/5 shadow-xl">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-moon-blue" /> My Characters
          </h3>
          
          {/* Tabs */}
          <div className="flex gap-2 bg-black/30 p-1.5 rounded-2xl mb-5 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveBotTab('published')}
              className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${activeBotTab === 'published' ? 'bg-white/20 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
              <Globe className="h-3.5 w-3.5" /> Published
            </button>
            <button 
              onClick={() => setActiveBotTab('private')}
              className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${activeBotTab === 'private' ? 'bg-white/20 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
              <Lock className="h-3.5 w-3.5" /> Private
            </button>
            <button 
              onClick={() => setActiveBotTab('drafts')}
              className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${activeBotTab === 'drafts' ? 'bg-white/20 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
            >
              <Edit3 className="h-3.5 w-3.5" /> Drafts
            </button>
          </div>

          {/* Tab Content (Mock Data) */}
          <div className="space-y-3">
            {activeBotTab === 'published' && (
              <div className="bg-black/20 border border-white/5 rounded-2xl p-4 flex items-center gap-4 group cursor-pointer hover:bg-white/5 transition-colors">
                <img src="https://picsum.photos/seed/bot1/100/100" className="w-12 h-12 rounded-full object-cover border border-white/10" alt="Bot" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white group-hover:text-moon-pink transition-colors">Lumina the Star-Weaver</h4>
                  <p className="text-[10px] text-gray-400">12.4k interactions • Fantasy</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-500" />
              </div>
            )}
            
            {activeBotTab === 'private' && (
              <div className="bg-black/20 border border-white/5 rounded-2xl p-4 flex items-center gap-4 group cursor-pointer hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-full bg-moon-purple/20 flex items-center justify-center border border-moon-purple/30">
                  <Lock className="h-5 w-5 text-moon-purple" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white group-hover:text-moon-purple transition-colors">Personal Journal AI</h4>
                  <p className="text-[10px] text-gray-400">Only visible to you</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-500" />
              </div>
            )}

            {activeBotTab === 'drafts' && (
              <div className="bg-black/20 border border-white/5 rounded-2xl p-4 flex items-center gap-4 group cursor-pointer hover:bg-white/5 transition-colors border-dashed">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-600">
                  <Edit3 className="h-5 w-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white group-hover:text-moon-blue transition-colors">Untitled Cyberpunk Cop</h4>
                  <p className="text-[10px] text-gray-400">Last edited 2 days ago</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-500" />
              </div>
            )}
            
            <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-all border border-white/10 border-dashed mt-2">
              + Create New Character
            </button>
          </div>
        </div>

      </div>

      {/* Settings Modal (Kept from previous implementation) */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-moon-surface border border-white/10 rounded-[2rem] w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                <Settings className="h-6 w-6 text-moon-pink" /> Settings
              </h3>
              <button 
                onClick={() => setShowSettingsModal(false)} 
                className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-8">
              
              {/* Preferences Group */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider ml-2 mb-3">Preferences</h4>
                <SettingsLink icon={<Shield className="text-emerald-400" />} label="Content Preferences" />
                <SettingsLink icon={<Globe className="text-moon-blue" />} label="Language" value="English" />
                <SettingsLink icon={<Ban className="text-red-400" />} label="Block List" />
              </div>

              {/* Chat Experience Group */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider ml-2 mb-3">Chat Experience</h4>
                <SettingsToggle 
                  icon={<Smartphone className="text-moon-purple" />} 
                  label="New Message Vibration" 
                  active={advancedSettings.vibration} 
                  onClick={() => toggleAdvancedSetting('vibration')} 
                />
                <SettingsToggle 
                  icon={<Volume2 className="text-moon-yellow" />} 
                  label="Auto Play Voice" 
                  active={advancedSettings.autoPlayVoice} 
                  onClick={() => toggleAdvancedSetting('autoPlayVoice')} 
                />
              </div>

              {/* Support & Diagnostics Group */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider ml-2 mb-3">Support & Diagnostics</h4>
                <SettingsLink icon={<Bug className="text-orange-400" />} label="Bug Report" />
                <SettingsLink icon={<Lightbulb className="text-yellow-400" />} label="Feature Requests" />
                <SettingsLink icon={<Activity className="text-moon-pink" />} label="Network Diagnostic" />
              </div>

              {/* Danger Zone */}
              <div className="space-y-2 pt-4 border-t border-white/5">
                <button className="w-full p-4 flex items-center gap-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-colors text-left">
                  <div className="p-2.5 bg-red-500/20 rounded-xl"><Trash2 className="h-5 w-5" /></div>
                  <div>
                    <p className="text-sm font-bold">Clear Memories</p>
                    <p className="text-[11px] font-medium opacity-80">Permanently delete all local chats</p>
                  </div>
                </button>
                <button className="w-full p-4 flex items-center gap-4 text-gray-400 hover:bg-white/5 rounded-2xl transition-colors text-left mt-1">
                  <div className="p-2.5 bg-white/5 rounded-xl"><LogOut className="h-5 w-5" /></div>
                  <div>
                    <p className="text-sm font-bold">Log Out</p>
                    <p className="text-[11px] font-medium opacity-80">Disconnect from your Mooncake account</p>
                  </div>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components for Settings Modal
const SettingsLink: React.FC<{ icon: React.ReactNode, label: string, value?: string }> = ({ icon, label, value }) => (
  <button className="w-full flex items-center justify-between p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors group">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-black/20 rounded-xl group-hover:scale-110 transition-transform">
        {React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4' })}
      </div>
      <span className="text-sm font-bold text-gray-200">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-xs font-bold text-gray-500">{value}</span>}
      <ChevronRight className="h-4 w-4 text-gray-500" />
    </div>
  </button>
);

const SettingsToggle: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <div className="w-full flex items-center justify-between p-3.5 bg-white/5 rounded-2xl">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-black/20 rounded-xl">
        {React.cloneElement(icon as React.ReactElement, { className: 'h-4 w-4' })}
      </div>
      <span className="text-sm font-bold text-gray-200">{label}</span>
    </div>
    <Toggle active={active} onClick={onClick} />
  </div>
);

const Toggle: React.FC<{ active: boolean; onClick: () => void }> = ({ active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-12 h-7 rounded-full transition-colors relative flex-shrink-0 ${active ? 'bg-moon-pink' : 'bg-gray-700'}`}
  >
    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${active ? 'left-6' : 'left-1'}`}></div>
  </button>
);

export default ProfileTab;