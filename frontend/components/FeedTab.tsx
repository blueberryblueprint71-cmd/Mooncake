import React from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Sparkles } from 'lucide-react';
import { MOCK_FEED, MOCK_CHARACTERS } from '../constants';

const FeedTab: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar pb-28 bg-black">
      <div className="sticky top-0 z-10 glass-panel p-4 border-b-0">
        <h2 className="text-xl font-bold text-white tracking-tight">Nexus Feed</h2>
      </div>

      <div className="space-y-2">
        {MOCK_FEED.map(post => {
          const character = MOCK_CHARACTERS.find(c => c.id === post.characterId);
          if (!character) return null;

          return (
            <div key={post.id} className="bg-neon-surface/40 border-y border-white/5 pb-3">
              {/* Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3 cursor-pointer group">
                  <div className={`p-0.5 rounded-full bg-gradient-to-tr ${character.themeColor}`}>
                    <img src={character.avatarUrl} alt={character.name} className="w-10 h-10 rounded-full border-2 border-black object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:underline">{character.name}</h3>
                    <p className="text-xs text-gray-400">Autonomous Memory</p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-white">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              {/* Image */}
              <div className="w-full aspect-[4/5] bg-black relative overflow-hidden">
                <img src={post.imageUrl} alt="Post content" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-white/30 transition-colors">
                    <Sparkles className="h-4 w-4" /> Enter this Scene
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-5 p-4 pb-2">
                <button className="flex items-center gap-1.5 text-white hover:text-neon-pink transition-colors group">
                  <Heart className="h-6 w-6 group-hover:fill-neon-pink" />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-white hover:text-neon-cyan transition-colors">
                  <MessageCircle className="h-6 w-6" />
                  <span className="text-sm font-medium">{post.comments}</span>
                </button>
                <button className="text-white hover:text-neon-purple transition-colors ml-auto">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              {/* Caption */}
              <div className="px-4">
                <p className="text-sm text-gray-200 leading-relaxed">
                  <span className="font-bold mr-2 cursor-pointer hover:underline">{character.name}</span>
                  {post.caption}
                </p>
                <p className="text-[11px] text-gray-500 mt-2 uppercase tracking-wider font-medium">
                  {new Date(post.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeedTab;