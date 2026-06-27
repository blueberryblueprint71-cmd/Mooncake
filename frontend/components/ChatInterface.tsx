import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, MoreVertical, Send, Mic, Image as ImageIcon, Sparkles, 
  RefreshCw, Edit2, Play, BookOpen, Grid, X, RotateCcw, Trash2, 
  Check, Volume2, VolumeX, AlignLeft, AlignJustify, Settings2, Square
} from 'lucide-react';
import { Character, Message, ChatSession } from '../types';
import { generateChatResponse, generateImageResponse } from '../services/geminiService';

interface ChatInterfaceProps {
  character: Character;
  session: ChatSession | null;
  onClose: () => void;
  onUpdateSession: (session: ChatSession) => void;
  onCheckLimit: () => boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ character, session, onClose, onUpdateSession, onCheckLimit }) => {
  // Core Chat State
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // UI Overlays State
  const [showAlbum, setShowAlbum] = useState(false);
  const [showChatSettings, setShowChatSettings] = useState(false);
  
  // Inline Edit State
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Context & Generation Settings
  const [oocInstruction, setOocInstruction] = useState('');
  const [replyLength, setReplyLength] = useState<'short' | 'long'>('short');
  const [voiceMode, setVoiceMode] = useState(false);

  // TTS State
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [voicePitch, setVoicePitch] = useState(1);
  const [voiceRate, setVoiceRate] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize or load session
  useEffect(() => {
    if (session && session.messages.length > 0) {
      setMessages(session.messages);
    } else {
      const initialMessage: Message = {
        id: Date.now().toString(),
        role: 'model',
        text: character.greeting,
        timestamp: Date.now()
      };
      setMessages([initialMessage]);
    }
  }, [session, character]);

  // Load TTS Voices
  useEffect(() => {
    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoiceURI) {
        // Try to find a good default voice
        const defaultVoice = availableVoices.find(v => v.name.includes('Female') || v.name.includes('Google')) || availableVoices[0];
        setSelectedVoiceURI(defaultVoice.voiceURI);
      }
    };
    
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [selectedVoiceURI]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (!showAlbum && !editingMessageId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, showAlbum, editingMessageId]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  // Build Dynamic System Prompt
  const getDynamicSystemPrompt = () => {
    return `
      ${character.systemPrompt}
      
      [SYSTEM INSTRUCTIONS FOR THIS SESSION]
      Response Length: ${replyLength === 'long' ? 'Write long, descriptive, paragraph-heavy responses.' : 'Write short, snappy, concise responses.'}
      ${oocInstruction ? `User OOC Override: ${oocInstruction}` : ''}
    `;
  };

  // TTS Playback Logic
  const handlePlayAudio = (text: string) => {
    window.speechSynthesis.cancel();
    
    // Strip markdown asterisks for speech so it doesn't read out actions awkwardly
    const cleanText = text.replace(/\*[^*]+\*/g, '').trim(); 
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
    if (voice) utterance.voice = voice;
    utterance.pitch = voicePitch;
    utterance.rate = voiceRate;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText !== undefined ? customText : inputText.trim();
    if (!textToSend && !isTyping) return;
    
    if (!onCheckLimit()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      timestamp: Date.now(),
      status: 'sent'
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (customText === undefined) setInputText('');
    setIsTyping(true);

    try {
      const validHistory = messages.filter(msg => msg.role === 'user' || msg.role === 'model');
      
      const responseText = await generateChatResponse(
        getDynamicSystemPrompt(),
        validHistory,
        userMsg.text
      );

      const modelMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };

      const updatedMessages = [...newMessages, modelMsg];
      setMessages(updatedMessages);
      
      onUpdateSession({
        id: session?.id || `session_${Date.now()}`,
        characterId: character.id,
        messages: updatedMessages,
        lastUpdated: Date.now()
      });

      // Auto-play voice if enabled
      if (voiceMode) {
        handlePlayAudio(responseText);
      }

    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        text: "System Error: Connection lost. Please try again.",
        timestamp: Date.now(),
        isError: true
      };
      setMessages([...newMessages, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- INLINE ACTIONS ---

  const handleReroll = async (msgId: string) => {
    if (isTyping) return;
    if (!onCheckLimit()) return;

    const msgIndex = messages.findIndex(m => m.id === msgId);
    if (msgIndex <= 0) return; // Can't reroll the first greeting easily

    // Get history up to the message we want to reroll
    const historyBefore = messages.slice(0, msgIndex);
    const lastMsg = historyBefore[historyBefore.length - 1];

    let validHistory = historyBefore;
    let promptText = "Continue the story.";

    // If the message before the AI's message was a user message, use it as the prompt
    if (lastMsg && lastMsg.role === 'user') {
      validHistory = historyBefore.slice(0, -1);
      promptText = lastMsg.text;
    }

    setMessages(historyBefore);
    setIsTyping(true);

    try {
      const filteredHistory = validHistory.filter(msg => msg.role === 'user' || msg.role === 'model');
      const responseText = await generateChatResponse(
        getDynamicSystemPrompt(),
        filteredHistory,
        promptText
      );

      const modelMsg: Message = {
        id: Date.now().toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };

      const updatedMessages = [...historyBefore, modelMsg];
      setMessages(updatedMessages);
      
      onUpdateSession({
        id: session?.id || `session_${Date.now()}`,
        characterId: character.id,
        messages: updatedMessages,
        lastUpdated: Date.now()
      });

      if (voiceMode) {
        handlePlayAudio(responseText);
      }
    } catch (error) {
      console.error(error);
      setIsTyping(false);
    }
  };

  const handleRewind = (msgId: string) => {
    const msgIndex = messages.findIndex(m => m.id === msgId);
    if (msgIndex === -1) return;
    
    // Keep messages strictly BEFORE the selected message
    const newMessages = messages.slice(0, msgIndex);
    setMessages(newMessages);
    
    onUpdateSession({
      id: session?.id || `session_${Date.now()}`,
      characterId: character.id,
      messages: newMessages,
      lastUpdated: Date.now()
    });
  };

  const startEdit = (msg: Message) => {
    setEditingMessageId(msg.id);
    setEditContent(msg.text);
  };

  const handleSaveEdit = (msgId: string) => {
    const updatedMessages = messages.map(m => 
      m.id === msgId ? { ...m, text: editContent } : m
    );
    setMessages(updatedMessages);
    setEditingMessageId(null);
    
    onUpdateSession({
      id: session?.id || `session_${Date.now()}`,
      characterId: character.id,
      messages: updatedMessages,
      lastUpdated: Date.now()
    });
  };

  // --- HEADER ACTIONS ---

  const handleClearChat = () => {
    const initialMessage: Message = {
      id: Date.now().toString(),
      role: 'model',
      text: character.greeting,
      timestamp: Date.now()
    };
    setMessages([initialMessage]);
    setShowChatSettings(false);
    
    onUpdateSession({
      id: session?.id || `session_${Date.now()}`,
      characterId: character.id,
      messages: [initialMessage],
      lastUpdated: Date.now()
    });
  };

  // --- MULTI-MODAL ---

  const handleRequestImage = async () => {
    if (isTyping) return;
    if (!onCheckLimit()) return;
    
    setIsTyping(true);
    try {
      const recentContext = messages.slice(-4).map(m => m.text).join(" ");
      const prompt = `Generate an image representing this scene: ${recentContext}. Style: Cute Anime/Illustration, high quality, matching the character ${character.name}.`;
      
      const imageUrl = await generateImageResponse(prompt);
      
      const modelMsg: Message = {
        id: Date.now().toString(),
        role: 'model',
        text: "*Shares a visual memory*",
        imageUrl: imageUrl,
        timestamp: Date.now()
      };

      const updatedMessages = [...messages, modelMsg];
      setMessages(updatedMessages);
      
      onUpdateSession({
        id: session?.id || `session_${Date.now()}`,
        characterId: character.id,
        messages: updatedMessages,
        lastUpdated: Date.now()
      });

    } catch (error) {
       console.error(error);
       const errorMsg: Message = {
        id: Date.now().toString(),
        role: 'system',
        text: "Failed to generate visual data.",
        timestamp: Date.now(),
        isError: true
      };
      setMessages([...messages, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const albumImages = messages.filter(m => m.imageUrl);

  return (
    <div className="fixed inset-0 z-50 bg-moon-bg flex flex-col animate-in slide-in-from-bottom-full duration-300 ease-out">
      
      {/* Dynamic Background Glow based on character theme */}
      <div className={`absolute top-0 left-0 w-full h-64 bg-gradient-to-b ${character.themeColor} opacity-10 pointer-events-none`}></div>

      {/* Header */}
      <div className="glass-panel flex items-center justify-between p-4 z-20 border-b border-white/5 rounded-b-3xl relative">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 -ml-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="relative">
            <img src={character.avatarUrl} alt={character.name} className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-lg" />
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-moon-surface rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <h2 className="font-display font-bold text-white leading-tight text-lg">{character.name}</h2>
            <p className="text-[11px] text-moon-pink font-bold tracking-wide uppercase">
              {isTyping ? 'Writing...' : 'Online'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowAlbum(true)} className="p-2.5 text-gray-400 hover:text-moon-pink rounded-full hover:bg-white/10 transition-colors relative" title="Memory Album">
            <Grid className="h-5 w-5" />
            {albumImages.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-moon-pink rounded-full border-2 border-moon-surface"></span>
            )}
          </button>
          <button 
            onClick={() => setShowChatSettings(!showChatSettings)} 
            className={`p-2.5 rounded-full transition-colors ${showChatSettings ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
            title="Chat Settings"
          >
            <Settings2 className="h-5 w-5" />
          </button>
        </div>

        {/* Header Settings Dropdown */}
        {showChatSettings && (
          <div className="absolute top-20 right-4 w-80 max-h-[75vh] overflow-y-auto custom-scrollbar bg-moon-surface/95 backdrop-blur-xl border border-white/10 rounded-[2rem] p-5 shadow-2xl z-50 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-white flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-moon-purple" /> Session Config
              </h3>
              <button onClick={() => setShowChatSettings(false)} className="text-gray-400 hover:text-white"><X className="h-5 w-5"/></button>
            </div>
            
            <div className="space-y-5">
              {/* OOC Override */}
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">OOC / System Override</label>
                <textarea 
                  value={oocInstruction}
                  onChange={(e) => setOocInstruction(e.target.value)}
                  placeholder="e.g., [AI, change the setting to a rainy cafe]"
                  className="w-full bg-black/30 border border-white/10 rounded-2xl p-3 text-white focus:border-moon-purple focus:ring-1 focus:ring-moon-purple outline-none text-xs font-mono resize-none custom-scrollbar"
                  rows={3}
                />
              </div>

              {/* Pacing Switcher */}
              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Reply Length / Pacing</label>
                <div className="flex bg-black/30 p-1 rounded-xl">
                  <button 
                    onClick={() => setReplyLength('short')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${replyLength === 'short' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    <AlignLeft className="h-3.5 w-3.5" /> Snappy
                  </button>
                  <button 
                    onClick={() => setReplyLength('long')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${replyLength === 'long' ? 'bg-white/20 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    <AlignJustify className="h-3.5 w-3.5" /> Descriptive
                  </button>
                </div>
              </div>

              {/* Voice Customization */}
              <div className="pt-4 border-t border-white/5">
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2 ml-1">Voice Customization</label>
                <select 
                  value={selectedVoiceURI}
                  onChange={(e) => setSelectedVoiceURI(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-2.5 text-white focus:border-moon-purple outline-none text-xs mb-3 custom-scrollbar"
                >
                  {voices.map(v => (
                    <option key={v.voiceURI} value={v.voiceURI} className="bg-moon-surface">
                      {v.name}
                    </option>
                  ))}
                </select>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>Pitch</span><span>{voicePitch.toFixed(1)}</span>
                    </div>
                    <input type="range" min="0.5" max="2" step="0.1" value={voicePitch} onChange={(e) => setVoicePitch(parseFloat(e.target.value))} className="w-full accent-moon-pink" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>Speed</span><span>{voiceRate.toFixed(1)}</span>
                    </div>
                    <input type="range" min="0.5" max="2" step="0.1" value={voiceRate} onChange={(e) => setVoiceRate(parseFloat(e.target.value))} className="w-full accent-moon-blue" />
                  </div>
                </div>
              </div>

              {/* Clear Chat */}
              <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={handleClearChat}
                  className="w-full py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" /> Reset Storyline
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Album Overlay */}
      {showAlbum && (
        <div className="absolute inset-0 z-50 bg-moon-bg/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-200">
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              <Grid className="h-6 w-6 text-moon-pink" /> Memory Album
            </h2>
            <button onClick={() => setShowAlbum(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            {albumImages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <ImageIcon className="h-16 w-16 mb-4 opacity-30" />
                <p className="font-display font-bold text-lg text-white mb-1">No memories yet!</p>
                <p className="text-sm font-medium text-center max-w-xs">
                  Ask {character.name} to share a picture or use the sparkle button to generate a scene.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {albumImages.map((msg, idx) => (
                  <div key={idx} className="relative aspect-square rounded-[1.5rem] overflow-hidden border border-white/10 group shadow-lg">
                    <img src={msg.imageUrl} alt="Memory" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-xs text-white font-bold truncate">{new Date(msg.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 relative z-0" onClick={() => setShowChatSettings(false)}>
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          const isSystem = msg.role === 'system';
          const isEditing = editingMessageId === msg.id;

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-4">
                <span className={`text-xs font-bold px-4 py-1.5 rounded-full border ${msg.isError ? 'bg-red-900/30 border-red-500/30 text-red-400' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[85%] relative ${
                isUser 
                  ? `bg-gradient-to-br ${character.themeColor} text-white rounded-[2rem] rounded-tr-sm shadow-lg p-4` 
                  : 'bg-moon-surface/90 backdrop-blur-md border border-white/10 text-gray-100 rounded-[2rem] rounded-tl-sm p-4 shadow-md'
              }`}>
                
                {msg.imageUrl && (
                  <div className="mb-3 rounded-2xl overflow-hidden border border-white/10 relative group/img">
                    <img src={msg.imageUrl} alt="Generated" className="w-full h-auto object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <Sparkles className="text-white h-8 w-8" />
                    </div>
                  </div>
                )}
                
                {isEditing ? (
                  <div className="w-full flex flex-col gap-3 min-w-[200px]">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-black/40 text-white p-3 rounded-xl outline-none focus:ring-1 focus:ring-white/50 text-sm custom-scrollbar resize-none"
                      rows={4}
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingMessageId(null)} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"><X className="h-4 w-4"/></button>
                      <button onClick={() => handleSaveEdit(msg.id)} className="p-2 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors"><Check className="h-4 w-4"/></button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Render text with basic markdown-like styling for actions (e.g., *smiles*) */}
                    <p className="whitespace-pre-wrap leading-relaxed text-[15px] font-medium">
                      {msg.text.split(/(\*[^*]+\*)/g).map((part, i) => 
                        part.startsWith('*') && part.endsWith('*') 
                          ? <span key={i} className={`italic ${isUser ? 'text-white/80' : 'text-moon-pink/90'}`}>{part}</span> 
                          : part
                      )}
                    </p>
                    
                    {/* Inline Action Tray (Hover) */}
                    <div className={`absolute -bottom-12 ${isUser ? 'right-0' : 'left-0'} opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1.5 bg-black/80 backdrop-blur-md rounded-xl p-1.5 border border-white/10 shadow-xl z-10`}>
                      {!isUser && (
                        <>
                          <button onClick={() => handleReroll(msg.id)} className="p-2 text-gray-400 hover:text-moon-blue rounded-lg hover:bg-white/10 transition-colors" title="Reroll / Swipe"><RefreshCw className="h-4 w-4" /></button>
                          <button onClick={() => isPlaying ? stopAudio() : handlePlayAudio(msg.text)} className="p-2 text-gray-400 hover:text-moon-pink rounded-lg hover:bg-white/10 transition-colors" title={isPlaying ? "Stop Audio" : "Play Audio"}>
                            {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </button>
                        </>
                      )}
                      <button onClick={() => startEdit(msg)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors" title="Edit Message"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleRewind(msg.id)} className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-white/10 transition-colors" title="Delete / Rewind from here"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </>
                )}
              </div>
              <span className="text-[10px] text-gray-500 mt-2 px-2 font-bold">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
        
        {isTyping && (
          <div className="flex items-start animate-in fade-in">
            <div className="bg-moon-surface/90 backdrop-blur-md border border-white/10 rounded-[2rem] rounded-tl-sm p-5 flex gap-2 items-center shadow-md">
              <div className="w-2.5 h-2.5 bg-moon-pink rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2.5 h-2.5 bg-moon-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2.5 h-2.5 bg-moon-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-12" />
      </div>

      {/* Input Area */}
      <div className="glass-panel p-4 pb-safe z-20 border-t border-white/5 rounded-t-[2rem]">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          
          {/* Left Actions */}
          <div className="flex gap-1 pb-1">
            <button 
              onClick={() => setVoiceMode(!voiceMode)}
              className={`p-3 rounded-full transition-colors ${voiceMode ? 'text-moon-pink bg-moon-pink/10' : 'text-gray-400 hover:text-moon-pink hover:bg-white/10'}`}
              title="Toggle Voice Mode (TTS)"
            >
              {voiceMode ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
            </button>
            <button className="p-3 text-gray-400 hover:text-moon-blue rounded-full hover:bg-white/10 transition-colors hidden sm:block">
              <Mic className="h-6 w-6" />
            </button>
          </div>
          
          {/* Text Input */}
          <div className="flex-1 bg-black/40 border border-white/10 rounded-[2rem] relative flex items-end focus-within:border-moon-pink/50 focus-within:ring-2 focus-within:ring-moon-pink/30 transition-all shadow-inner">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message or *action*..."
              className="w-full bg-transparent text-white px-5 py-4 max-h-32 min-h-[56px] resize-none outline-none text-[15px] font-medium custom-scrollbar"
              rows={1}
            />
            <button 
              onClick={handleRequestImage}
              disabled={isTyping}
              className="p-3 m-1.5 text-moon-purple hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 flex-shrink-0"
              title="Request Scene Image"
            >
              <Sparkles className="h-6 w-6" />
            </button>
          </div>

          {/* Send Button */}
          <button 
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isTyping}
            className={`p-4 rounded-full transition-all flex-shrink-0 mb-0.5 shadow-lg ${
              !inputText.trim() || isTyping 
                ? 'bg-white/10 text-gray-500 shadow-none' 
                : `bg-gradient-to-r ${character.themeColor} text-white hover:scale-105`
            }`}
          >
            <Send className="h-6 w-6 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;