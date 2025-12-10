import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import MainLayout from '../components/MainLayout';

export default function ReceivedRequestsPage() {
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReceivedRequests();
    
    // Real-time listener
    const channel = supabase
      .channel('received_requests')
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
          ),
          receiver:profiles!friend_requests_receiver_id_fkey(
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
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Update request status
      const { error: updateError } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Create friendship (both ways)
      const { error: friendshipError } = await supabase
        .from('friendships')
        .insert([
          { user_id: user.id, friend_id: senderId },
          { user_id: senderId, friend_id: user.id }
        ]);

      if (friendshipError) throw friendshipError;

      // Create notification for sender
      await supabase
        .from('notifications')
        .insert([
          {
            user_id: senderId,
            type: 'friend_accepted',
            sender_id: user.id,
            message: `${user.user_metadata?.name || user.email} accepted your friend request`
          }
        ]);

      // Update local state
      setReceivedRequests(prev =>
        prev.map(r => r.id === requestId ? { ...r, status: 'accepted' } : r)
      );
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      setReceivedRequests(prev =>
        prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r)
      );
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const deleteRequest = async (requestId) => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      setReceivedRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'rejected':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'accepted':
        return '✅';
      case 'rejected':
        return '❌';
      default:
        return '📥';
    }
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
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#FFF5E6] to-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#F68537] mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading received requests...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const pendingCount = receivedRequests.filter(r => r.status === 'pending').length;
  const acceptedCount = receivedRequests.filter(r => r.status === 'accepted').length;

  return (
    <MainLayout>
      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#FFF5E6] to-white">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                  📥 Received Requests
                  {pendingCount > 0 && (
                    <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full">
                      {pendingCount} new
                    </span>
                  )}
                </h1>
                <p className="text-gray-600 mt-1">Friend requests you've received</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div className="bg-green-50 rounded-lg p-3 text-center border-2 border-green-200">
                <div className="text-2xl md:text-3xl font-bold text-green-600">{pendingCount}</div>
                <div className="text-xs md:text-sm text-green-800 mt-1">Pending</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center border-2 border-blue-200">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">{acceptedCount}</div>
                <div className="text-xs md:text-sm text-blue-800 mt-1">Accepted</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center border-2 border-gray-200">
                <div className="text-2xl md:text-3xl font-bold text-gray-600">{receivedRequests.length}</div>
                <div className="text-xs md:text-sm text-gray-800 mt-1">Total</div>
              </div>
            </div>
          </div>

          {/* Received Requests List */}
          {receivedRequests.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">No received requests</h2>
              <p className="text-gray-600">You haven't received any friend requests yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {receivedRequests.map((request) => (
                <div
                  key={request.id}
                  className={`bg-white rounded-xl shadow-md border-2 p-4 md:p-5 transition-all hover:shadow-lg ${getStatusColor(request.status)}`}
                >
                  <div className="flex items-center gap-3 md:gap-4">
                    {/* Avatar */}
                    <img
  src={request.sender?.avatar_url || `https://ui-avatars.com/api/?name=${request.sender?.username || 'User'}&background=F68537&color=fff`}
  alt={request.sender?.username}
  className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-[#F68537] flex-shrink-0"
/>

                   {/* Content */}
<div className="flex-1 min-w-0">
  <div className="flex items-start justify-between gap-2">
    <div className="flex-1">
      <h3 className="text-gray-800 font-bold text-base md:text-lg">
        {request.sender?.username || 'Unknown User'}
      </h3>
      <p className="text-gray-600 text-xs md:text-sm truncate">
        {request.sender?.email}
      </p>
      {request.sender?.phone && (
        <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
          📞 {request.sender?.phone}
        </p>
      )}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xl">{getStatusIcon(request.status)}</span>
        <span className="text-xs md:text-sm font-medium capitalize">
          {request.status}
        </span>
        <span className="text-gray-500 text-xs">•</span>
        <span className="text-gray-500 text-xs md:text-sm">
          {formatTime(request.created_at)}
        </span>
      </div>
    </div>
  </div>
  {/* Action Buttons */}
  <div className="flex gap-2 mt-3">
    {request.status === 'pending' && (
      <>
        <button
          onClick={() => acceptRequest(request.id, request.sender_id)}
          className="text-xs md:text-sm bg-green-500 text-white px-4 py-1.5 rounded-lg hover:bg-green-600 transition-colors font-medium"
        >
          ✓ Accept
        </button>
        <button
          onClick={() => rejectRequest(request.id)}
          className="text-xs md:text-sm bg-red-100 text-red-600 px-4 py-1.5 rounded-lg hover:bg-red-200 transition-colors font-medium"
        >
          ✗ Reject
        </button>
      </>
    )}
    
    {request.status === 'accepted' && (
      <button
        className="text-xs md:text-sm bg-blue-100 text-blue-600 px-4 py-1.5 rounded-lg font-medium cursor-default"
      >
        Now Friends ✓
      </button>
    )}
    {request.status === 'rejected' && (
      <button
        onClick={() => deleteRequest(request.id)}
        className="text-xs md:text-sm bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
      >
        Remove
      </button>
    )}
  </div>
</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </MainLayout>
  );
}