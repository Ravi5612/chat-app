import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

export const useReceivedRequests = () => {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReceivedRequests();

    const channel = supabase
      .channel('received-requests')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friend_requests'
        },
        () => {
          loadReceivedRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadReceivedRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('friend_requests')
        .select(`
          *,
          sender:profiles!friend_requests_sender_id_fkey(
            id,
            username,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReceivedRequests(data || []);
    } catch (error) {
      console.error('Error loading received requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (requestId, senderId) => {
    console.log('=== ACCEPT REQUEST STARTED ===');
    console.log('Request ID:', requestId);
    console.log('Sender ID:', senderId);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('❌ User error:', userError);
        alert('User not found');
        return;
      }

      console.log('Current User ID:', user.id);

      // STEP 1: Update friend request status
      console.log('STEP 1: Updating request status...');
      
      const { error: updateError } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (updateError) {
        console.error('❌ Update error:', updateError);
        alert(`Failed to update request: ${updateError.message}`);
        return;
      }

      console.log('✅ Request status updated to accepted');

      // STEP 2: Create friendships (TWO separate inserts)
      console.log('STEP 2: Creating friendships...');

      // Insert 1: Current user -> Sender
      console.log('Insert 1: user_id =', user.id, ', friend_id =', senderId);
      
      const { data: friendship1, error: error1 } = await supabase
        .from('friendships')
        .insert({
          user_id: user.id,
          friend_id: senderId
        })
        .select();

      console.log('Insert 1 result:', { data: friendship1, error: error1 });

      if (error1) {
        console.error('❌ Friendship 1 error:', error1);
        alert(`Failed to create friendship 1: ${error1.message}`);
        return;
      }

      console.log('✅ Friendship 1 created');

      // Insert 2: Sender -> Current user
      console.log('Insert 2: user_id =', senderId, ', friend_id =', user.id);
      
      const { data: friendship2, error: error2 } = await supabase
        .from('friendships')
        .insert({
          user_id: senderId,
          friend_id: user.id
        })
        .select();

      console.log('Insert 2 result:', { data: friendship2, error: error2 });

      if (error2) {
        console.error('❌ Friendship 2 error:', error2);
        alert(`Failed to create friendship 2: ${error2.message}`);
        return;
      }

      console.log('✅ Friendship 2 created');

      console.log('=== ACCEPT REQUEST COMPLETED ===');

      // Reload requests
      await loadReceivedRequests();
      
      alert('✅ Friend request accepted! Now you are friends!');

    } catch (error) {
      console.error('❌ COMPLETE ERROR:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      loadReceivedRequests();
      alert('Friend request rejected');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert(`Failed to reject: ${error.message}`);
    }
  };

  const deleteRequest = async (requestId) => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      loadReceivedRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const getCounts = () => ({
    pending: receivedRequests.filter(r => r.status === 'pending').length,
    accepted: receivedRequests.filter(r => r.status === 'accepted').length,
    rejected: receivedRequests.filter(r => r.status === 'rejected').length,
    total: receivedRequests.length
  });

  return {
    receivedRequests,
    loading,
    acceptRequest,
    rejectRequest,
    deleteRequest,
    getCounts
  };
};