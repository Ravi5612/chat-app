import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase/client';

export default function ChatBox({ selectedFriend }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (selectedFriend && currentUser) {
      loadMessages();
      subscribeToMessages();
    }
  }, [selectedFriend, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

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

      setMessages(data || []);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', selectedFriend.id)
        .eq('receiver_id', currentUser.id)
        .eq('is_read', false);

    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`messages-${selectedFriend.id}`)
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${selectedFriend.id}`
        },
        (payload) => {
          if (payload.new.receiver_id === currentUser.id) {
            setMessages(prev => [...prev, payload.new]);
            
            // Mark as read
            supabase
              .from('messages')
              .update({ is_read: true })
              .eq('id', payload.new.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFriend || !currentUser) return;

    setSending(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: currentUser.id,
            receiver_id: selectedFriend.id,
            message: newMessage.trim(),
            is_read: false
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data]);
      setNewMessage('');

      // Create notification for receiver
      await supabase
        .from('notifications')
        .insert([
          {
            user_id: selectedFriend.id,
            type: 'message',
            sender_id: currentUser.id,
            message: `${currentUser.user_metadata?.name || currentUser.email} sent you a message`
          }
        ]);

    } catch (error) {
      console.error('Error sending message:', error);
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

  // No friend selected state
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
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#F68537]"
          />
          <div className="flex-1">
            <h2 className="font-bold text-base md:text-lg text-gray-800">{selectedFriend.name}</h2>
            <p className="text-xs md:text-sm text-gray-600">{selectedFriend.email}</p>
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
                  className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
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