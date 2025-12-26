import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabase/client';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import EmptyState from './EmptyState';

export default function ChatBox({ selectedFriend }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const channelRef = useRef(null);
  const isSubscribedRef = useRef(false);
const [editingMessage, setEditingMessage] = useState(null);
  // Get current user
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
  }, []);

  // Load messages and subscribe
  useEffect(() => {
    if (!selectedFriend || !currentUser) {
      console.log('⏸️ Waiting for friend or user...', { selectedFriend, currentUser });
      return;
    }

    console.log('🔄 Loading chat with:', selectedFriend.name);
    
    loadMessages();
    subscribeToMessages();

    return () => {
      if (channelRef.current) {
        console.log('🧹 Cleaning up channel');
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [selectedFriend?.id, currentUser?.id]);

  // Mark messages as delivered when chat is opened
  useEffect(() => {
    const markAsDelivered = async () => {
      if (!selectedFriend || !currentUser) return;

      const { error } = await supabase
        .from('messages')
        .update({ status: 'delivered' })
        .eq('receiver_id', currentUser.id)
        .eq('sender_id', selectedFriend.id)
        .eq('status', 'sent');

      if (error) {
        console.error('❌ Error marking as delivered:', error);
      } else {
        console.log('✅ Messages marked as delivered');
      }
    };

    markAsDelivered();
  }, [selectedFriend, currentUser]);

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

      // Mark messages as read
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
    
    const channelName = `chat-${Math.min(currentUser.id, selectedFriend.id)}-${Math.max(currentUser.id, selectedFriend.id)}`;
  
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMsg = payload.new;
          setMessages((current) => {
             if (current.some(m => m.id === newMsg.id)) return current;
             return [...current, newMsg];
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'messages' },
        (payload) => {
          // 🔥 YEH IMPORTANT HAI: Jab edit ho, toh list ko update karo
          const updatedMsg = payload.new;
          setMessages((current) =>
            current.map((msg) => (msg.id === updatedMsg.id ? updatedMsg : msg))
          );
        }
      )
      .subscribe();
  
    channelRef.current = channel;
  };

  const uploadFile = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${currentUser.id}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('chat-files')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('chat-files')
      .getPublicUrl(fileName);

    return {
      url: publicUrl,
      name: file.name,
      type: file.type,
      size: file.size
    };
  };

  const handleSendMessage = async (messageText) => {
    if (!messageText && !selectedFile) return;
    if (!selectedFriend || !currentUser) return;

    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempId,
      sender_id: currentUser.id,
      receiver_id: selectedFriend.id,
      message: messageText || '',
      status: 'sending',
      created_at: new Date().toISOString(),
      file_url: null,
      file_name: null,
      file_type: null,
      file_size: null
    };

    // Optimistic UI update
    setMessages(prev => [...prev, tempMessage]);
    setSending(true);

    try {
      let fileData = null;

      // Upload file if selected
      if (selectedFile) {
        console.log('📤 Uploading file...');
        fileData = await uploadFile(selectedFile);
        console.log('✅ File uploaded:', fileData);
        setSelectedFile(null);
      }

      // Create message with 'sent' status
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: currentUser.id,
            receiver_id: selectedFriend.id,
            message: messageText || (fileData ? `Sent ${fileData.name}` : ''),
            is_read: false,
            status: 'sent',
            file_url: fileData?.url || null,
            file_name: fileData?.name || null,
            file_type: fileData?.type || null,
            file_size: fileData?.size || null
          }
        ])
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Message sent:', data);

      // Replace temp message with real message
      setMessages(prev => 
        prev.map(msg => msg.id === tempId ? data : msg)
      );

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
      
      // Remove failed message
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      
      alert('Failed to send message: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  // Mark message as read when visible on screen
  const handleMessageVisible = async (messageId) => {
    if (!currentUser) return;

    const { error } = await supabase
      .from('messages')
      .update({ 
        status: 'read',
        is_read: true
      })
      .eq('id', messageId)
      .eq('receiver_id', currentUser.id)
      .eq('status', 'delivered');

    if (error) {
      console.error('❌ Error marking as read:', error);
    } else {
      console.log('✅ Message marked as read:', messageId);
    }
  };

const handleEditMessage = async (messageId, newText) => {
  try {
    console.log("✏️ Updating ID:", messageId);
    console.log("👤 Current User ID:", currentUser.id);
console.log("ID Type:", typeof messageId, "Value:", messageId);
console.log("SenderID Type:", typeof currentUser.id, "Value:", currentUser.id);
    const { data, error, count } = await supabase
      .from('messages')
      .update({ 
        message: newText, 
        edited: true 
      })
      .eq('id', messageId)
      .eq('sender_id', currentUser.id) // Check karo ye ID sahi hai?
      .select(); // data wapas mangwao confirm karne ke liye

    if (error) throw error;

    if (!data || data.length === 0) {
      console.error("⚠️ Row match nahi hui! Matlab sender_id ya messageId galat hai.");
    } else {
      console.log("✅ DB Update Result:", data);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

  const handleFileSelect = (file) => {
    console.log('📁 File selected:', file);
    setSelectedFile(file);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
  };

  // Empty states
  if (!currentUser) {
    return <EmptyState type="loading" />;
  }

  if (!selectedFriend) {
    return <EmptyState type="no-friend" />;
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-[#FFF5E6] to-white overflow-hidden">
      {/* Chat Header */}
      <ChatHeader friend={selectedFriend} />

      {/* Messages List */}
     <MessageList 
  messages={messages}
  loading={loading}
  currentUserId={currentUser?.id}
  onMessageVisible={handleMessageVisible}
  onEditMessage={handleEditMessage} // 👈 console.log hata kar ye function pass karo
/>

      {/* Chat Input */}
      <ChatInput 
        onSendMessage={handleSendMessage}
        disabled={sending}
        selectedFile={selectedFile}
        onFileSelect={handleFileSelect}
        onClearFile={handleClearFile}
      />
    </div>
  );
}