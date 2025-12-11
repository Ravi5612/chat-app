import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

export const useFriends = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFriends();

    const channel = supabase
      .channel('friendships-updates')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friendships'
        },
        (payload) => {
          console.log('Friendship change detected:', payload);
          loadFriends();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

      console.log('Friendships result:', { data: friendships, error: friendshipError });

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