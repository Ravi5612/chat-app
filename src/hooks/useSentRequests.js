import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

export const useSentRequests = () => {
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSentRequests();

    const channel = supabase
      .channel('sent_requests')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'friend_requests'
        },
        () => {
          loadSentRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadSentRequests = async () => {
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
          ),
          receiver:profiles!friend_requests_receiver_id_fkey(
            id,
            username,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSentRequests(data || []);
    } catch (error) {
      console.error('Error loading sent requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (requestId) => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      setSentRequests(prev => prev.filter(r => r.id !== requestId));
      alert('Request canceled');
    } catch (error) {
      console.error('Error canceling request:', error);
      alert('Failed to cancel request');
    }
  };

  const deleteRequest = async (requestId) => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      setSentRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const getCounts = () => ({
    pending: sentRequests.filter(r => r.status === 'pending').length,
    accepted: sentRequests.filter(r => r.status === 'accepted').length,
    rejected: sentRequests.filter(r => r.status === 'rejected').length,
    total: sentRequests.length
  });

  return {
    sentRequests,
    loading,
    cancelRequest,
    deleteRequest,
    getCounts
  };
};