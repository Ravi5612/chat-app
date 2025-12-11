import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase/client';

export default function ChatBox({ selectedFriend }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  const channelRef = useRef(null);
  const isSubscribedRef = useRef(false); // ✅ Track subscription state

  // ✅ Get current user ONCE
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('✅ Current user loaded:', user.id);
        setCurrentUser(user);
      } else {
        console.error('❌ User not found');
      }
    };
    getCurrentUser();
  }, []); // Empty dependency - runs once only

  // ✅ Load messages and subscribe when friend OR user changes
  useEffect(() => {
    if (!selectedFriend || !currentUser) {
      console.log('⏸️ Waiting for friend or user...', { selectedFriend, currentUser });
      return;
    }

    console.log('🔄 Loading chat with:', selectedFriend.name);
    
    loadMessages();
    subscribeToMessages();

    // Cleanup on unmount or when friend changes
    return () => {
      if (channelRef.current) {
        console.log('🧹 Cleaning up channel');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [selectedFriend?.id, currentUser?.id]); // ✅ Only re-run when IDs change

  // ✅ Auto-scroll when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!selectedFriend || !currentUser) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedFriend.id}),and(sender_id.eq.${selectedFriend.id},receiver_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      console.log('✅ Loaded messages:', data?.length || 0);
      setMessages(data || []);

      // Mark as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', selectedFriend.id)
        .eq('receiver_id', currentUser.id)
        .eq('is_read', false);

    } catch (error) {
      console.error('❌ Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    if (!selectedFriend || !currentUser) return;
    
    // ✅ Prevent duplicate subscriptions
    if (isSubscribedRef.current && channelRef.current) {
      console.log('⏭️ Already subscribed, skipping...');
      return;
    }

    // Remove previous channel if exists
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    console.log('🔔 Subscribing to real-time messages for:', selectedFriend.name);

    // Create unique channel name
    const channelName = `chat-${Math.min(currentUser.id, selectedFriend.id)}-${Math.max(currentUser.id, selectedFriend.id)}`;

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('📨 New message received:', payload.new);
          
          const newMsg = payload.new;
          
          // Only add if message is relevant to this chat
          if (
            (newMsg.sender_id === selectedFriend.id && newMsg.receiver_id === currentUser.id) ||
            (newMsg.sender_id === currentUser.id && newMsg.receiver_id === selectedFriend.id)
          ) {
            setMessages((current) => {
              // Prevent duplicates
              if (current.some(m => m.id === newMsg.id)) {
                return current;
              }
              return [...current, newMsg];
            });
            
            // Mark as read if from friend
            if (newMsg.sender_id === selectedFriend.id) {
              supabase
                .from('messages')
                .update({ is_read: true })
                .eq('id', newMsg.id);
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          isSubscribedRef.current = true;
        }
      });

    channelRef.current = channel;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFriend || !currentUser) return;

    const messageText = newMessage.trim();
    setNewMessage(''); // Clear immediately

    setSending(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: currentUser.id,
            receiver_id: selectedFriend.id,
            message: messageText,
            is_read: false
          }
        ])
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Message sent:', data);

      // Optimistic update (message will also come via realtime)
      setMessages(prev => {
        // Check if already exists (from realtime)
        if (prev.some(m => m.id === data.id)) {
          return prev;
        }
        return [...prev, data];
      });

      // Create notification
      await supabase
        .from('notifications')
        .insert([
          {
            user_id: selectedFriend.id,
            type: 'message',
            sender_id: currentUser.id,
            message: `New message from ${currentUser.user_metadata?.name || currentUser.email}`,
            is_read: false
          }
        ]);

    } catch (error) {
      console.error('❌ Error sending message:', error);
      alert('Failed to send message');
      setNewMessage(messageText); // Restore on error
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
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

  if (!currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#FFF5E6] to-white">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#F68537] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user...</p>
        </div>
      </div>
    );
  }

  if (!selectedFriend) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#FFF5E6] to-white">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Select a friend to chat</h2>
          <p className="text-gray-600">Choose a friend from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-[#FFF5E6] to-white">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img
            src={selectedFriend.img}
            alt={selectedFriend.name}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#F68537] object-cover"
          />
          <div className="flex-1">
            <h2 className="font-bold text-base md:text-lg text-gray-800">{selectedFriend.name}</h2>
            <p className="text-xs md:text-sm text-gray-600">{selectedFriend.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">● Online</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#F68537] mx-auto mb-3"></div>
              <p className="text-gray-600 text-sm">Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-5xl mb-4">👋</div>
              <h3 className="font-bold text-gray-800 mb-2">No messages yet</h3>
              <p className="text-gray-600 text-sm">Start the conversation by sending a message!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const isSent = msg.sender_id === currentUser?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isSent ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div
                    className={`max-w-[70%] md:max-w-[60%] rounded-2xl px-4 py-2 ${
                      isSent
                        ? 'bg-[#F68537] text-white rounded-br-none'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm md:text-base break-words">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isSent ? 'text-white/80' : 'text-gray-500'
                      }`}
                    >
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={sending}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F68537] focus:border-transparent text-sm md:text-base"
          />
          <button
            type="submit"
            disabled={sending || !newMessage.trim()}
            className="bg-[#F68537] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#EAD8A4] hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            {sending ? '⏳' : '📤'}
          </button>
        </form>
      </div>
    </div>
  );
}