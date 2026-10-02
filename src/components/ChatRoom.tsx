import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Bell,
  BellOff,
  Sparkles,
  ShieldAlert,
  Users,
  AlertCircle,
  MessageSquare,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { ChatMessage, RNGItem } from '../types/rng';
import { validateAndFilterChatMessage } from '../utils/chatFilter';
import { RARITY_CONFIGS, formatChance, TOP_3_RAREST_ITEMS } from '../data/items';
import { sound } from '../utils/audio';

interface ChatRoomProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => boolean | { success: boolean; reason?: string };
  currentUsername: string;
  isAdmin: boolean;
  showRareDropAlerts: boolean;
  onToggleShowRareDropAlerts: () => void;
  onInspectItemByName?: (itemName: string) => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({
  messages,
  onSendMessage,
  currentUsername,
  isAdmin,
  showRareDropAlerts,
  onToggleShowRareDropAlerts,
  onInspectItemByName,
}) => {
  const [inputText, setInputText] = useState('');
  const [filterError, setFilterError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);

  // Filter messages based on setting
  const visibleMessages = messages.filter((msg) => {
    if (msg.type === 'rare_drop_alert' && !showRareDropAlerts) {
      return false;
    }
    return true;
  });

  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  };

  useEffect(() => {
    if (isScrolledToBottom) {
      scrollToBottom();
    }
  }, [visibleMessages.length, isScrolledToBottom]);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 60;
    setIsScrolledToBottom(atBottom);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterError(null);

    const validation = validateAndFilterChatMessage(inputText);
    if (!validation.allowed) {
      setFilterError(validation.reason || 'Message blocked by filter.');
      return;
    }

    const res = onSendMessage(validation.cleanedText);
    if (typeof res === 'object' && !res.success) {
      setFilterError(res.reason || 'Failed to send message.');
      return;
    }

    setInputText('');
    setIsScrolledToBottom(true);
    setTimeout(() => scrollToBottom(true), 50);
  };

  const handleQuickCheer = (cheerText: string) => {
    setInputText((prev) => (prev ? `${prev} ${cheerText}` : cheerText));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col h-[calc(100vh-5rem)]">
      {/* Chatroom Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>Community Chat</span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live</span>
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Chat with other rollers. Mild swearing is fine; slurs are strictly prohibited.
            </p>
          </div>
        </div>

        {/* Setting Toggle: Top 3 Rare Aura Alerts */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onToggleShowRareDropAlerts}
            className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center gap-2 cursor-pointer border ${
              showRareDropAlerts
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle broadcast notifications for when someone rolls a Top 3 rarest aura (Eye of Infinity, Supernova Shard, Chronos Hourglass)"
          >
            {showRareDropAlerts ? (
              <>
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>Top 3 Aura Alerts: <strong>ON</strong></span>
              </>
            ) : (
              <>
                <BellOff className="w-3.5 h-3.5" />
                <span>Top 3 Aura Alerts: <strong>OFF</strong></span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Top 3 Rarest Auras Tracker Sub-Banner */}
      <div className="my-2.5 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs overflow-x-auto scrollbar-none shrink-0">
        <span className="text-slate-500 font-mono text-[11px] whitespace-nowrap mr-2">
          Top 3 Mythics Broadcasted:
        </span>
        <div className="flex items-center gap-3">
          {TOP_3_RAREST_ITEMS.map((item, idx) => {
            const config = RARITY_CONFIGS[item.rarity];
            return (
              <div
                key={item.id}
                className="flex items-center gap-1.5 whitespace-nowrap text-slate-300"
              >
                <span className="text-slate-600 font-mono text-[10px]">#{idx + 1}</span>
                <span>{item.emoji}</span>
                <span className="font-semibold text-white">{item.name}</span>
                <span className="font-mono text-[11px]" style={{ color: config.color }}>
                  ({formatChance(item.baseChance)})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Error Warning */}
      {filterError && (
        <div className="mb-2 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center justify-between gap-2 shrink-0 animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{filterError}</span>
          </div>
          <button
            onClick={() => setFilterError(null)}
            className="text-xs text-rose-400 hover:text-white underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto rounded-xl bg-slate-950/60 border border-slate-800/80 p-3 sm:p-4 flex flex-col gap-2.5 my-1"
      >
        {visibleMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center p-6">
            <MessageSquare className="w-8 h-8 text-slate-700 mb-2" />
            <p className="text-sm font-medium text-slate-300">Chat is empty</p>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              No one has sent a message yet. Type below to say something to the room!
            </p>
          </div>
        ) : (
          visibleMessages.map((msg) => {
            const timeString = new Date(msg.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            // 1. Rare Drop Alert Banner
            if (msg.type === 'rare_drop_alert') {
              const rarityConfig = msg.itemData
                ? RARITY_CONFIGS[msg.itemData.rarity]
                : RARITY_CONFIGS['Transcendent'];

              return (
                <div
                  key={msg.id}
                  className="w-full p-3 sm:p-3.5 rounded-xl border relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-lg animate-fade-in"
                  style={{
                    backgroundColor: rarityConfig.bgColor,
                    borderColor: rarityConfig.borderColor,
                    boxShadow: `0 0 20px ${rarityConfig.glowColor}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl select-none">
                      {msg.itemData?.emoji || '🌟'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-slate-950/80 text-amber-300 border border-amber-400/40">
                          GLOBAL DROP
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{timeString}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
                        <strong className="text-white">{msg.sender}</strong> has unlocked{' '}
                        <strong
                          className="font-bold underline decoration-dotted cursor-pointer"
                          style={{ color: rarityConfig.color }}
                          onClick={() =>
                            onInspectItemByName && msg.itemData && onInspectItemByName(msg.itemData.name)
                          }
                        >
                          {msg.itemData?.name || 'Mythic Aura'}
                        </strong>
                        !
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center font-mono text-xs">
                    {msg.itemData && (
                      <span
                        className="px-2 py-0.5 rounded bg-slate-950/80 font-bold tabular-nums"
                        style={{ color: rarityConfig.color }}
                      >
                        {formatChance(msg.itemData.baseChance)}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">🎉 GGs!</span>
                  </div>
                </div>
              );
            }

            // 2. System Announcement Message
            if (msg.type === 'system') {
              return (
                <div
                  key={msg.id}
                  className="w-full py-1.5 px-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between"
                >
                  <span className="italic">{msg.content}</span>
                  <span className="text-[10px] font-mono text-slate-600">{timeString}</span>
                </div>
              );
            }

            // 3. Regular User Message
            const isMe = msg.sender.toLowerCase() === currentUsername.toLowerCase();

            return (
              <div
                key={msg.id}
                className={`flex flex-col py-1 px-2.5 rounded-lg transition-colors ${
                  isMe ? 'bg-cyan-950/20 border-l-2 border-cyan-400' : 'hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={`text-xs font-bold ${
                      msg.isAdmin
                        ? 'text-amber-400'
                        : isMe
                        ? 'text-cyan-300'
                        : 'text-slate-300'
                    }`}
                  >
                    {msg.sender}
                  </span>

                  {msg.isAdmin && (
                    <span className="text-[9px] font-mono uppercase bg-amber-500/20 text-amber-300 px-1 rounded border border-amber-500/40">
                      ADMIN
                    </span>
                  )}

                  <span className="text-[10px] font-mono text-slate-500">{timeString}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 break-words leading-relaxed">
                  {msg.content}
                </p>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Jump to bottom button when scrolled up */}
      {!isScrolledToBottom && (
        <div className="flex justify-center -mt-8 relative z-20 pointer-events-auto">
          <button
            onClick={() => scrollToBottom(true)}
            className="px-3 py-1 rounded-full bg-cyan-500 text-slate-950 text-xs font-bold shadow-lg hover:bg-cyan-400 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>↓ Jump to Latest</span>
          </button>
        </div>
      )}

      {/* Quick Reaction Bar */}
      <div className="flex items-center gap-1.5 py-1.5 overflow-x-auto scrollbar-none text-xs shrink-0">
        <span className="text-slate-600 text-[11px] font-mono uppercase">Quick:</span>
        {['gg!! 🎉', 'what are your odds? 🍀', 'nice luck! 🔥', 'going for infinity eye! 👁️'].map(
          (cheer) => (
            <button
              key={cheer}
              onClick={() => handleQuickCheer(cheer)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-400 hover:text-slate-200 transition-colors whitespace-nowrap cursor-pointer"
            >
              {cheer}
            </button>
          )
        )}
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSend} className="flex items-center gap-2 pt-1 shrink-0">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={`Message as ${currentUsername}... (mild swearing ok, slurs blocked)`}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (filterError) setFilterError(null);
            }}
            maxLength={300}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
          />
        </div>

        <button
          type="submit"
          disabled={!inputText.trim()}
          className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
            inputText.trim()
              ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};
