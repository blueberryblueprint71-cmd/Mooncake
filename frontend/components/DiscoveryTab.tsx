import React, { useState } from 'react';
import { 
  Search, Flame, Sparkles, Users, ChevronRight, ChevronDown, 
  Play, Heart, MessageCircle, Share2, MoreHorizontal, Video
} from 'lucide-react';
import { Character, FeedPost } from '../types';
import { MOCK_CHARACTERS, CATEGORIES, MOCK_FEED } from '../constants';

interface DiscoveryTabProps {
  onStartChat: (character: Character) => void;
}

const GENDER_OPTIONS = ['All Genders', 'Female', 'Male', 'Non-binary'];
const SORT_OPTIONS = ['Trending', 'Most Liked', 'Newest'];

const DiscoveryTab: React.FC<DiscoveryTabProps> = ({ onStartChat }) => {
  const [activeView, setActiveView] = useState<'explore' | 'feed'>('explore');
  
  // Explore Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All Genders');
  const [sortBy, setSortBy] = useState('Trending');

  // Filter and Sort Logic
  const filteredCharacters = MOCK_CHARACTERS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || c.tags.includes(activeCategory);
    const matchesGender = genderFilter === 'All Genders' || c.gender === genderFilter;
    return matchesSearch && matchesCategory && matchesGender;
  }).sort((a, b) => {
    if (sortBy === 'Most Liked') return b.activeUsers - a.activeUsers;
    if (sortBy === 'Newest') return b.id.localeCompare(a.id); // Mock newest
    return 0; // Trending (default order)
  });

  const handleJumpIntoStory = (characterId: string, scenario?: string) => {
    const character = MOCK_CHARACTERS.find(c => c.id === characterId);
    if (character) {
      // In a full implementation, we would pass the scenario to the chat initialization.
      // For now, we just start the chat with the character.
      onStartChat(character);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar pb-28 relative">
      
      {/* Top Navigation Toggle (Explore vs Feed) */}
      <div className="sticky top-0 z-30 glass-panel px-4 py-3 border-b-0 rounded-b-3xl flex flex-col gap-3">
        <div className="flex justify-center">
          <div className="bg-black/30 p-1.5 rounded-full flex gap-1 border border-white/5 shadow-inner">
            <button 
              onClick={() => setActiveView('explore')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeView === 'explore' ? 'bg-gradient-to-r from-moon-pink to-moon-purple text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              Explore
            </button>
            <button 
              onClick={() => setActiveView('feed')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeView === 'feed' ? 'bg-gradient-to-r from-moon-blue to-moon-purple text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              <Video className="h-4 w-4" /> Reels & Feed
            </button>
          </div>
        </div>

        {/* Filters (Only visible in Explore view) */}
        {activeView === 'explore' && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex gap-2 mb-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-3 bg-moon-surface/80 border border-white/10 rounded-2xl leading-5 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-moon-pink/50 transition-all shadow-inner font-medium text-sm"
                  placeholder="Find a character..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Gender Filter */}
              <div className="relative w-32 flex-shrink-0">
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="block w-full h-full appearance-none bg-moon-surface/80 border border-white/10 rounded-2xl pl-3 pr-8 py-3 text-xs font-bold text-moon-pink focus:outline-none focus:ring-2 focus:ring-moon-pink/50 transition-all shadow-inner cursor-pointer"
                >
                  {GENDER_OPTIONS.map(g => (
                    <option key={g} value={g} className="bg-moon-surface text-white">{g}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-3 w-3 text-moon-pink" />
                </div>
              </div>

              {/* Sort Filter */}
              <div className="relative w-32 flex-shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full h-full appearance-none bg-moon-surface/80 border border-white/10 rounded-2xl pl-3 pr-8 py-3 text-xs font-bold text-moon-blue focus:outline-none focus:ring-2 focus:ring-moon-blue/50 transition-all shadow-inner cursor-pointer"
                >
                  {SORT_OPTIONS.map(s => (
                    <option key={s} value={s} className="bg-moon-surface text-white">{s}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-3 w-3 text-moon-blue" />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeCategory === cat 
                      ? 'bg-white text-moon-bg shadow-[0_0_10px_rgba(255,255,255,0.3)]' 
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- EXPLORE VIEW --- */}
      {activeView === 'explore' && (
        <div className="p-5 space-y-8 animate-in fade-in duration-300">
          {/* Hero Carousel */}
          {!searchQuery && activeCategory === 'All' && genderFilter === 'All Genders' && sortBy === 'Trending' && (
            <section>
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2 tracking-tight">
                  <Flame className="h-6 w-6 text-moon-yellow" /> Featured Stories 💖
                </h2>
              </div>
              <div className="flex overflow-x-auto no-scrollbar gap-4 snap-x snap-mandatory -mx-5 px-5 pb-4">
                {MOCK_CHARACTERS.slice(0, 3).map(char => (
                  <div 
                    key={`hero-${char.id}`}
                    onClick={() => onStartChat(char)}
                    className="min-w-[300px] w-[85vw] max-w-[400px] h-60 rounded-[2rem] relative overflow-hidden snap-center cursor-pointer group border border-white/10 shadow-lg"
                  >
                    <img src={char.coverUrl} alt={char.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-moon-bg via-moon-bg/40 to-transparent opacity-90"></div>
                    
                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-white border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-moon-pink animate-pulse"></div>
                      {(char.activeUsers / 1000).toFixed(1)}k
                    </div>

                    <div className="absolute bottom-0 left-0 p-6 w-full">
                      <h3 className="text-2xl font-display font-extrabold text-white mb-1 tracking-tight">{char.name}</h3>
                      <p className="text-sm text-gray-300 line-clamp-2 mb-4 font-medium">{char.description}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold px-4 py-2 rounded-xl bg-gradient-to-r ${char.themeColor} text-white shadow-lg`}>
                          Say Hello ✨
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Character Grid */}
          <section>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-xl font-display font-bold text-white flex items-center gap-2 tracking-tight">
                <Sparkles className="h-6 w-6 text-moon-purple" /> 
                {searchQuery || genderFilter !== 'All Genders' || sortBy !== 'Trending' ? 'Search Results ✨' : activeCategory === 'All' ? 'Recommended for You' : `${activeCategory} Friends`}
              </h2>
              <button className="text-sm font-bold text-moon-pink hover:text-white transition-colors flex items-center">
                See all <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {filteredCharacters.map(char => (
                <div 
                  key={char.id} 
                  onClick={() => onStartChat(char)}
                  className="bg-moon-surface/60 backdrop-blur-sm border border-white/5 rounded-[1.5rem] overflow-hidden hover:border-moon-pink/30 transition-all cursor-pointer group flex flex-col shadow-lg"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img 
                      src={char.avatarUrl} 
                      alt={char.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-moon-bg/90 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-display font-bold text-lg text-white truncate drop-shadow-md">{char.name}</h3>
                      <p className="text-xs font-medium text-gray-300 truncate drop-shadow-md">{char.tagline}</p>
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-black/20">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {char.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/10 text-gray-200 border border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" /> {(char.activeUsers / 1000).toFixed(1)}k
                      </span>
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${char.themeColor} shadow-sm`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredCharacters.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-5">
                  <Search className="h-10 w-10 text-gray-500" />
                </div>
                <h3 className="text-xl font-display font-bold text-white">No friends found</h3>
                <p className="text-gray-400 text-sm mt-2 font-medium">Try adjusting your search or filters.</p>
              </div>
            )}
          </section>
        </div>
      )}

      {/* --- FEED / REELS VIEW --- */}
      {activeView === 'feed' && (
        <div className="bg-black min-h-full animate-in fade-in duration-300">
          {MOCK_FEED.map(post => {
            const character = MOCK_CHARACTERS.find(c => c.id === post.characterId);
            if (!character) return null;

            return (
              <div key={post.id} className="bg-moon-surface/40 border-b border-white/5 pb-4 mb-2">
                {/* Header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onStartChat(character)}>
                    <div className={`p-0.5 rounded-full bg-gradient-to-tr ${character.themeColor}`}>
                      <img src={character.avatarUrl} alt={character.name} className="w-10 h-10 rounded-full border-2 border-black object-cover" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm group-hover:underline">{character.name}</h3>
                      <p className="text-xs text-moon-pink font-medium">Autonomous Memory</p>
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-white">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>

                {/* Media Content (Image or Video) */}
                <div className="w-full aspect-[4/5] bg-black relative overflow-hidden group">
                  {post.videoUrl ? (
                    <>
                      <video 
                        src={post.videoUrl} 
                        className="w-full h-full object-cover opacity-80"
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                      />
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 text-xs text-white font-bold">
                        <Video className="h-3 w-3" /> Reel
                      </div>
                    </>
                  ) : (
                    <img src={post.imageUrl} alt="Post content" className="w-full h-full object-cover" />
                  )}
                  
                  {/* Jump Into Story Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    {post.scenarioPrompt && (
                      <p className="text-white text-sm font-medium mb-4 italic drop-shadow-md">"{post.scenarioPrompt}"</p>
                    )}
                    <button 
                      onClick={() => handleJumpIntoStory(character.id, post.scenarioPrompt)}
                      className={`w-full bg-gradient-to-r ${character.themeColor} text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg`}
                    >
                      <Sparkles className="h-5 w-5" /> Jump into Story
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-5 p-4 pb-2">
                  <button className="flex items-center gap-1.5 text-white hover:text-moon-pink transition-colors group">
                    <Heart className="h-6 w-6 group-hover:fill-moon-pink" />
                    <span className="text-sm font-bold">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-white hover:text-moon-blue transition-colors">
                    <MessageCircle className="h-6 w-6" />
                    <span className="text-sm font-bold">{post.comments}</span>
                  </button>
                  <button className="text-white hover:text-moon-purple transition-colors ml-auto">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Caption */}
                <div className="px-4">
                  <p className="text-sm text-gray-200 leading-relaxed font-medium">
                    <span className="font-bold mr-2 cursor-pointer hover:underline">{character.name}</span>
                    {post.caption}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-2 uppercase tracking-wider font-bold">
                    {new Date(post.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DiscoveryTab;