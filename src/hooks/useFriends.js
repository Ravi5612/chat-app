import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

export const useFriends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    loadFriends();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    console.log('🔔 Setting up real-time subscriptions for friend list...');

    const friendshipChannel = supabase
      .channel('friendships-updates')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friendships'
        },
        (payload) => {
          console.log('👥 Friendship change detected:', payload);
          loadFriends();
        }
      )
      .subscribe();

    const messageChannel = supabase
      .channel('friend-list-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const newMsg = payload.new;
          
          if (newMsg.receiver_id === currentUser.id) {
            console.log('📨 Received message, +1 unread');
            const friendId = newMsg.sender_id;
            setFriends(prev => 
              prev.map(friend => 
                friend.id === friendId 
                  ? { ...friend, unreadCount: (friend.unreadCount || 0) + 1 }
                  : friend
              )
            );
          } else if (newMsg.sender_id === currentUser.id) {
            console.log('📤 Sent message, no update');
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          const updatedMsg = payload.new;
          
          if (updatedMsg.is_read && updatedMsg.receiver_id === currentUser.id) {
            console.log('✅ Message read, -1 unread');
            const friendId = updatedMsg.sender_id;
            setFriends(prev => 
              prev.map(friend => 
                friend.id === friendId 
                  ? { ...friend, unreadCount: Math.max(0, (friend.unreadCount || 0) - 1) }
                  : friend
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(friendshipChannel);
      supabase.removeChannel(messageChannel);
    };
  }, [currentUser]);

  const loadFriends = async () => {
    setLoading(true);
    try {
      console.log('🔵 Loading friends...');

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('❌ No user found');
        setFriends([]);
        setLoading(false);
        return;
      }

      console.log('✅ Current user:', user.id);

      const { data: friendships, error: friendshipError } = await supabase
        .from('friendships')
        .select(`
          friend_id,
          friend:profiles!friendships_friend_id_fkey(
            id,
            username,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('user_id', user.id);

      if (friendshipError) {
        console.error('❌ Friendship error:', friendshipError);
        throw friendshipError;
      }

      if (!friendships || friendships.length === 0) {
        console.log('⚠️ No friendships found');
        setFriends([]);
        setLoading(false);
        return;
      }

      const friendsWithUnread = await Promise.all(
        friendships.map(async (friendship) => {
          const friendProfile = friendship.friend;

          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_id', friendProfile.id)
            .eq('receiver_id', user.id)
            .eq('is_read', false);

          return {
            id: friendProfile.id,
            name: friendProfile.username || 'Unknown User',
            email: friendProfile.email || 'No email',
            img: friendProfile.avatar_url || `https://ui-avatars.com/api/?name=${friendProfile.username || 'User'}&background=F68537&color=fff`,
            unreadCount: count || 0
          };
        })
      );

      console.log('✅ Friends loaded:', friendsWithUnread);
      setFriends(friendsWithUnread);

    } catch (error) {
      console.error('❌ Error loading friends:', error);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    friends,
    loading,
    loadFriends
  };
};