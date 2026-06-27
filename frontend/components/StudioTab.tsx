import React, { useState } from 'react';
import { 
  Wand2, Save, Image as ImageIcon, Sparkles, Globe, Lock, EyeOff, 
  MessageSquare, BrainCircuit, Settings, Mic, Palette, Loader2
} from 'lucide-react';

const AVAILABLE_TAGS = ['Anime', 'RPG', 'Romance', 'Fantasy', 'Sci-Fi', 'Slice of Life', 'Idol', 'School'];

const StudioTab: React.FC = () => {
  // 1. Basic Information State
  const [name, setName] = useState('');
  const [catchphrase, setCatchphrase] = useState('');
  const [visibility, setVisibility] = useState<'Public' | 'Unlisted' | 'Private'>('Public');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  // 2. Advanced AI Definition State
  const [greeting, setGreeting] = useState('');
  const [personality, setPersonality] = useState('');
  const [scenario, setScenario] = useState('');

  // 3. Model & Generation Controls State
  const [constraints, setConstraints] = useState('');
  const [voice, setVoice] = useState('Zephyr (Smooth, Calm)');
  const [imageStyle, setImageStyle] = useState('Anime Sketch');

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      if (selectedTags.length < 3) {
        setSelectedTags([...selectedTags, tag]);
      }
    }
  };

  const handleGenerateAvatar = () => {
    if (!name) return;
    setIsGeneratingAvatar(true);
    // Simulate AI generation delay
    setTimeout(() => {
      const randomSeed = Math.floor(Math.random() * 1000);
      setAvatarUrl(`https://image.pollinations.ai/prompt/cute%20anime%20avatar%20portrait%20${encodeURIComponent(name)}?seed=${randomSeed}&width=256&height=256&nologo=true`);
      setIsGeneratingAvatar(false);
    }, 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar pb-28 p-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2 tracking-tight">
          <Wand2 className="h-7 w-7 text-moon-pink" /> Magic Studio ✨
        </h2>
      </div>

      <div className="space-y-6">
        
        {/* 1. Basic Information (The Shell) */}
        <div className="bg-moon-surface/60 backdrop-blur-sm p-6 rounded-[2rem] border border-white/5 shadow-xl">
          <div className="flex items-center gap-2 mb-5 border-b border-white/5 pb-3">
            <div className="p-2 bg-moon-pink/20 rounded-xl"><Sparkles className="h-5 w-5 text-moon-pink" /></div>
            <h3 className="text-lg font-display font-bold text-white">1. Basic Information <span className="text-gray-400 text-sm font-sans font-medium">(The Shell)</span></h3>
          </div>

          <div className="space-y-5">
            {/* Avatar Upload / Generate */}
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <div className="relative w-28 h-28 flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-moon-pink/30 rounded-[1.5rem] bg-black/20 hover:bg-white/5 transition-colors cursor-pointer group overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8 text-moon-pink/50 group-hover:text-moon-pink mb-2 transition-colors" />
                    <span className="text-[10px] text-gray-400 font-bold text-center px-2">Upload Avatar</span>
                  </>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1 w-full space-y-2">
                <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider ml-1">Character Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl p-3.5 text-white focus:border-moon-pink focus:ring-1 focus:ring-moon-pink outline-none transition-all font-bold" 
                  placeholder="e.g., Lumina the Star-Weaver" 
                />
                <button 
                  onClick={handleGenerateAvatar}
                  disabled={!name || isGeneratingAvatar}
                  className="w-full py-2.5 rounded-xl bg-moon-purple/20 text-moon-purple font-bold text-xs hover:bg-moon-purple/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGeneratingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {isGeneratingAvatar ? 'Generating...' : 'Generate Avatar with AI'}
                </button>
              </div>
            </div>

            {/* Catchphrase */}
            <div>
              <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2 ml-1">Short Description / Catchphrase</label>
              <input 
                type="text" 
                value={catchphrase}
                onChange={(e) => setCatchphrase(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-2xl p-3.5 text-white focus:border-moon-pink focus:ring-1 focus:ring-moon-pink outline-none transition-all font-medium text-sm" 
                placeholder="A one-sentence hook for the Discovery Hub..." 
              />
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2 ml-1">Visibility / Privacy</label>
              <div className="grid grid-cols-3 gap-2 bg-black/30 p-1.5 rounded-2xl">
                {(['Public', 'Unlisted', 'Private'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setVisibility(v)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      visibility === v 
                        ? 'bg-white/20 text-white shadow-sm' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {v === 'Public' && <Globe className="h-3.5 w-3.5" />}
                    {v === 'Unlisted' && <EyeOff className="h-3.5 w-3.5" />}
                    {v === 'Private' && <Lock className="h-3.5 w-3.5" />}
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Tags */}
            <div>
              <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2 ml-1">Category Tags (Max 3)</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      selectedTags.includes(tag)
                        ? 'bg-moon-pink/20 border-moon-pink text-moon-pink'
                        : 'bg-black/30 border-white/10 text-gray-400 hover:border-white/30'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Advanced AI Definition (The Brain) */}
        <div className="bg-moon-surface/60 backdrop-blur-sm p-6 rounded-[2rem] border border-white/5 shadow-xl">
          <div className="flex items-center gap-2 mb-5 border-b border-white/5 pb-3">
            <div className="p-2 bg-moon-blue/20 rounded-xl"><BrainCircuit className="h-5 w-5 text-moon-blue" /></div>
            <h3 className="text-lg font-display font-bold text-white">2. Advanced AI Definition <span className="text-gray-400 text-sm font-sans font-medium">(The Brain)</span></h3>
          </div>

          <div className="space-y-5">
            {/* Greeting */}
            <div>
              <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2 ml-1 flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" /> Greeting / First Message
              </label>
              <textarea 
                rows={3} 
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-white focus:border-moon-blue focus:ring-1 focus:ring-moon-blue outline-none transition-all resize-none font-medium text-sm custom-scrollbar" 
                placeholder="*Steps out of the shadows* Who goes there? Establish the initial setting or cliffhanger here..."
              />
            </div>

            {/* Personality Prompt */}
            <div>
              <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2 ml-1">Character Definition / Personality</label>
              <p className="text-[10px] text-gray-500 mb-2 ml-1 font-medium">Define traits, appearance, and behavior. Use W++ or Bracketed formats for token efficiency.</p>
              <textarea 
                rows={5} 
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-moon-blue focus:border-moon-blue focus:ring-1 focus:ring-moon-blue outline-none font-mono text-xs leading-relaxed resize-none custom-scrollbar" 
                placeholder={`[{Name("Lisa") + Age("19") + Personality("Sarcastic" + "Loyal")}]\nOR\nName[Lisa] Appearance[Blue eyes, black hair] Vibe[Mysterious]`}
              />
            </div>

            {/* Scenario */}
            <div>
              <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2 ml-1">Scenario / World Setting</label>
              <textarea 
                rows={3} 
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-white focus:border-moon-blue focus:ring-1 focus:ring-moon-blue outline-none transition-all resize-none font-medium text-sm custom-scrollbar" 
                placeholder="Outline the current scene, plot boundaries, or lore constraints of the world..."
              />
            </div>
          </div>
        </div>

        {/* 3. Model & Generation Controls */}
        <div className="bg-moon-surface/60 backdrop-blur-sm p-6 rounded-[2rem] border border-white/5 shadow-xl">
          <div className="flex items-center gap-2 mb-5 border-b border-white/5 pb-3">
            <div className="p-2 bg-moon-purple/20 rounded-xl"><Settings className="h-5 w-5 text-moon-purple" /></div>
            <h3 className="text-lg font-display font-bold text-white">3. Model & Controls <span className="text-gray-400 text-sm font-sans font-medium">(The Engine)</span></h3>
          </div>

          <div className="space-y-5">
            {/* System Constraints */}
            <div>
              <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2 ml-1">System Prompt Constraints</label>
              <p className="text-[10px] text-gray-500 mb-2 ml-1 font-medium">{`Enforce boundaries (e.g., "{{char}} is strictly forbidden from speaking on behalf of {{user}}").`}</p>
              <textarea 
                rows={3} 
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-moon-purple focus:border-moon-purple focus:ring-1 focus:ring-moon-purple outline-none font-mono text-xs leading-relaxed resize-none custom-scrollbar" 
                placeholder="{{char}} will not write dialogue for {{user}}. Keep responses under 3 paragraphs."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Voice Model */}
              <div>
                <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2 ml-1 flex items-center gap-1.5">
                  <Mic className="h-3.5 w-3.5" /> Voice Model (TTS)
                </label>
                <select 
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl p-3.5 text-sm font-bold text-white focus:border-moon-purple outline-none appearance-none cursor-pointer"
                >
                  <option className="bg-moon-surface">Zephyr (Smooth, Calm)</option>
                  <option className="bg-moon-surface">Puck (Energetic, Youthful)</option>
                  <option className="bg-moon-surface">Charon (Deep, Gritty)</option>
                  <option className="bg-moon-surface">Kore (Soft, Ethereal)</option>
                </select>
              </div>

              {/* Image Style */}
              <div>
                <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2 ml-1 flex items-center gap-1.5">
                  <Palette className="h-3.5 w-3.5" /> Image Generation Style
                </label>
                <select 
                  value={imageStyle}
                  onChange={(e) => setImageStyle(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-2xl p-3.5 text-sm font-bold text-white focus:border-moon-purple outline-none appearance-none cursor-pointer"
                >
                  <option className="bg-moon-surface">Anime Sketch</option>
                  <option className="bg-moon-surface">Cinematic Realistic</option>
                  <option className="bg-moon-surface">Watercolor Fantasy</option>
                  <option className="bg-moon-surface">Cyberpunk Neon</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button className="w-full py-4 rounded-[1.5rem] bg-gradient-to-r from-moon-pink via-moon-purple to-moon-blue text-white font-display font-bold text-lg hover:scale-[1.02] transition-all shadow-[0_5px_20px_rgba(181,156,255,0.4)] mt-6">
          <div className="flex items-center justify-center gap-2">
            <Save className="h-6 w-6" /> Publish Character! 🌟
          </div>
        </button>
      </div>
    </div>
  );
};

export default StudioTab;