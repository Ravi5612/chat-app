import { useEffect, useRef, useState } from 'react';
import MessageStatus from './MessageStatus';
import { supabase } from '../../supabase/client'; // Adjust path as needed

export default function MessageItem({ message, isCurrentUser, onMessageVisible, currentUserId, onEditMessage }) {
  const isSent = isCurrentUser;
  const isImage = message.file_type?.startsWith('image/');
  const isVideo = message.file_type?.startsWith('video/');
  const messageRef = useRef(null);
  const reactionsRef = useRef(null);
  const reactionButtonRef = useRef(null);

  // Reactions state - हमेशा array format में initialize करें
  const [reactions, setReactions] = useState([]);
  const [showReactions, setShowReactions] = useState(false);
  const [isReacting, setIsReacting] = useState(false);
  const [userReactions, setUserReactions] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null); // kaunsa message edit ho raha hai
  const [newMessageText, setNewMessageText] = useState(''); // edit input ka value

  // Available reactions with labels
  const availableReactions = [
    { emoji: '👍', label: 'Like' },
    { emoji: '❤️', label: 'Love' },
    { emoji: '😊', label: 'Happy' },
    { emoji: '😢', label: 'Sad' },
    { emoji: '🎉', label: 'Celebrate' },
    { emoji: '🔥', label: 'Fire' },
    { emoji: '👏', label: 'Clap' }
  ];

  // Intersection Observer for message read status
  useEffect(() => {
    if (!messageRef.current || isSent || message.status === 'read') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onMessageVisible?.(message.id);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(messageRef.current);
    return () => observer.disconnect();
  }, [message.id, message.status, isSent, onMessageVisible]);

  // Fetch reactions for this message
  const fetchReactions = async () => {
    try {
      // Fetch all reactions for this message
      const { data: reactionsData, error } = await supabase
        .from('message_reactions')
        .select('emoji, user_id')
        .eq('message_id', message.id);

      if (error) {
        console.error('Error fetching reactions:', error);
        return;
      }

      // Group reactions by emoji - ARRAY format में store करें
      const groupedReactions = {};
      reactionsData?.forEach(reaction => {
        if (!groupedReactions[reaction.emoji]) {
          groupedReactions[reaction.emoji] = {
            emoji: reaction.emoji,
            count: 0,
            users: []
          };
        }
        groupedReactions[reaction.emoji].count++;
        groupedReactions[reaction.emoji].users.push(reaction.user_id);
      });

      // Convert to array
      const reactionsArray = Object.values(groupedReactions);
      setReactions(reactionsArray);

      // Find user's reactions
      const userReacts = reactionsData
        ?.filter(r => r.user_id === currentUserId)
        .map(r => r.emoji) || [];
      setUserReactions(userReacts);

    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };

  // Setup realtime subscription
  const setupRealtimeSubscription = () => {
    console.log(`🔌 Subscribing to reactions for message: ${message.id}`);
    const channel = supabase
      .channel(`reactions:${message.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
          filter: `message_id=eq.${message.id}`
        },
        (payload) => {
          console.log('🔄 Reaction update received:', payload);
          fetchReactions(); // Refresh reactions
        }
      )
      .subscribe();

    return () => {
      console.log(`🔌 Unsubscribing from reactions: ${message.id}`);
      supabase.removeChannel(channel);
    };
  };

  // Load reactions from database
  useEffect(() => {
    fetchReactions();
    const cleanup = setupRealtimeSubscription();

    return () => {
      if (cleanup) cleanup();
    };
  }, [message.id]);

  const handleSaveEdit = async (messageId) => {
    if (!newMessageText.trim() || newMessageText === message.message) {
      setEditingMessageId(null);
      return;
    }

    try {
      // 🚀 Parent ka function call karo (Lifting state up)
      await onEditMessage(messageId, newMessageText);

      // Local state reset kar do
      setEditingMessageId(null);
      setNewMessageText('');
      console.log("✅ Edit successful");
    } catch (error) {
      console.error("❌ Edit failed:", error);
    }
  };
  // Handle reaction click - FIXED VERSION
  const handleReaction = async (emoji) => {
    if (!currentUserId) return;

    setIsReacting(true);
    try {
      // Check if user already reacted with this emoji
      const existingReaction = userReactions.includes(emoji);

      if (existingReaction) {
        // Remove reaction
        const { error } = await supabase
          .from('message_reactions')
          .delete()
          .match({
            message_id: message.id,
            user_id: currentUserId,
            emoji: emoji
          });

        if (error) throw error;

        // Update local state
        setUserReactions(prev => prev.filter(e => e !== emoji));
      } else {
        // Add reaction
        const { error } = await supabase
          .from('message_reactions')
          .insert({
            message_id: message.id,
            user_id: currentUserId,
            emoji: emoji
          });

        if (error) throw error;

        // Update local state
        setUserReactions(prev => [...prev, emoji]);
      }

      // Update reactions summary
      setReactions(prevReactions => {
        const existingIndex = prevReactions.findIndex(r => r.emoji === emoji);

        if (existingReaction) {
          // Decrease count or remove
          if (prevReactions[existingIndex].count === 1) {
            // Remove the reaction if count becomes 0
            return prevReactions.filter(r => r.emoji !== emoji);
          } else {
            // Decrease count
            const updated = [...prevReactions];
            updated[existingIndex] = {
              ...updated[existingIndex],
              count: updated[existingIndex].count - 1,
              users: updated[existingIndex].users.filter(id => id !== currentUserId)
            };
            return updated;
          }
        } else {
          // Add new reaction or increment count
          if (existingIndex >= 0) {
            // Increment existing reaction
            const updated = [...prevReactions];
            updated[existingIndex] = {
              ...updated[existingIndex],
              count: updated[existingIndex].count + 1,
              users: [...updated[existingIndex].users, currentUserId]
            };
            return updated;
          } else {
            // Add new reaction
            return [...prevReactions, {
              emoji,
              count: 1,
              users: [currentUserId]
            }];
          }
        }
      });

    } catch (error) {
      console.error('Error updating reaction:', error);
    } finally {
      setIsReacting(false);
      setShowReactions(false);
    }
  };

  // Click outside to close reactions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        reactionsRef.current &&
        !reactionsRef.current.contains(event.target) &&
        reactionButtonRef.current &&
        !reactionButtonRef.current.contains(event.target)
      ) {
        setShowReactions(false);
      }
    };

    if (showReactions) {
      document.addEventListener('mousedown', handleClickOutside);
      const timer = setTimeout(() => setShowReactions(false), 3000);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        clearTimeout(timer);
      };
    }
  }, [showReactions]);

  // Format time
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div
      ref={messageRef}
      className={`flex ${isSent ? 'justify-end' : 'justify-start'} animate-fadeIn relative group`}
    >
      <div
        className={`max-w-[70%] md:max-w-[60%] rounded-2xl px-4 py-2.5 shadow-sm border relative ${isSent
          ? 'bg-[#F68537] text-white border-[#F68537] rounded-br-none'
          : 'bg-white border-[#F68537] text-gray-800 rounded-bl-none'
          }`}
      >
        {/* Image Display */}
        {isImage && message.file_url && (
          <a href={message.file_url} target="_blank" rel="noopener noreferrer">
            <img
              src={message.file_url}
              alt={message.file_name || 'Image'}
              className="max-w-[280px] max-h-[200px] md:max-w-[350px] md:max-h-[280px] w-auto h-auto object-contain rounded-lg mb-2 cursor-pointer hover:opacity-90 transition-opacity border border-[#F68537]"
            />
          </a>
        )}

        {/* Video Display */}
        {isVideo && message.file_url && (
          <video
            src={message.file_url}
            controls
            className="max-w-[280px] max-h-[200px] md:max-w-[350px] md:max-h-[280px] w-auto h-auto rounded-lg mb-2 border border-[#F68537]"
          />
        )}

        {/* Other Files */}
        {message.file_url && !isImage && !isVideo && (
          <a
            href={message.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 mb-2 p-2 rounded-lg border ${isSent ? 'bg-white/20 border-white/30' : 'bg-gray-100 border-[#F68537]'
              }`}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.file_name || 'File'}</p>
              <p className="text-xs opacity-75">{formatFileSize(message.file_size)}</p>
            </div>
          </a>
        )}

        {/* Message Text */}
        {editingMessageId === message.id ? (
          // ✏️ EDIT MODE
          <div className="flex flex-col gap-2">
            <textarea
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              rows={2}
              autoFocus
              className="w-full text-sm text-gray-800 rounded-lg p-2 border border-gray-300
                 focus:outline-none focus:border-[#F68537]"
            />

            <div className="flex justify-end gap-2">
              {/* CANCEL */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingMessageId(null);
                  setNewMessageText('');
                }}
                className="text-xs font-bold ${isSent ? 'text-white' : 'text-[#F68537]'}"
              >
                Cancel
              </button>

              {/* SAVE */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveEdit(message.id);
                }}
                className="text-xs font-bold ${isSent ? 'text-white' : 'text-[#F68537]'"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          // 💬 NORMAL MODE
          message.message && (
            <p className="text-sm md:text-base break-words whitespace-pre-wrap">
              {message.message}
              {message.edited && (
                <span className="text-[10px] ml-1 opacity-70">(edited)</span>
              )}
            </p>
          )
        )}


        {/* Display Reactions */}
        {/* Display Reactions */}
        {reactions.length > 0 && (
          <div
            className={`absolute -bottom-3.5 ${isSent ? '-left-2' : '-right-2'
              } flex items-center gap-1 z-10 cursor-default`}
            onClick={(e) => e.stopPropagation()}
          >
            {reactions.map((reaction, idx) => (
              <div
                key={idx}
                className={`flex items-center px-1.5 py-0.5 rounded-full ${userReactions.includes(reaction.emoji)
                  ? 'border border-[#F68537] bg-[#F68537]/10'
                  : 'bg-white/80 border border-gray-200'
                  } shadow-sm`}
                onClick={() => handleReaction(reaction.emoji)}
                title={`${reaction.count} reaction(s)`}
              >
                <span className="text-sm">{reaction.emoji}</span>
                {reaction.count > 1 && (
                  <span className={`text-xs ml-1 ${userReactions.includes(reaction.emoji)
                    ? 'text-[#F68537]'
                    : 'text-gray-600'
                    }`}>
                    {reaction.count}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Time and Status */}
        <div className={`flex items-center justify-end gap-1 text-xs mt-1 ${isSent ? 'text-white/80' : 'text-gray-500'}`}>
          <span>{formatTime(message.created_at)}</span>
          {isSent && <MessageStatus status={message.status || 'sent'} />}
        </div>
        {isSent && editingMessageId !== message.id && (
          <button
            className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 ${isSent ? '-left-16' : '-right-16'
              } p-1.5 bg-white border border-gray-200 rounded-full shadow-sm
      text-blue-600 hover:border-blue-600 hover:scale-110`}
            onClick={(e) => {
              e.stopPropagation();
              setEditingMessageId(message.id);
              setNewMessageText(message.message || '');
            }}
            title="Edit message"
          >
            ✏️
          </button>
        )}
        {/* Reaction Button */}
        <button
          ref={reactionButtonRef}
          className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 ${isSent ? '-left-8' : '-right-8'
            } p-1.5 bg-white border border-gray-200 rounded-full shadow-sm text-gray-600 hover:text-[#F68537] hover:border-[#F68537] hover:scale-110`}
          onClick={() => setShowReactions(!showReactions)}
          disabled={isReacting}
          title="Add reaction"
        >
          <span className="text-sm">👍</span>
        </button>



      </div>

      {/* Reactions Popup */}
      {showReactions && (
        <div
          ref={reactionsRef}
          className={`absolute ${isSent ? 'right-0' : 'left-0'} -top-10 bg-white border border-gray-200 rounded-xl shadow-lg p-2 flex items-center gap-1 z-50 animate-fadeIn`}
          onClick={(e) => e.stopPropagation()}
        >
          {availableReactions.map(({ emoji, label }) => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className={`p-1.5 rounded-full text-lg hover:bg-gray-100 transition-colors ${userReactions.includes(emoji)
                ? 'bg-[#F68537]/10 text-[#F68537] ring-1 ring-[#F68537]/30'
                : ''
                }`}
              title={label}
              disabled={isReacting}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}