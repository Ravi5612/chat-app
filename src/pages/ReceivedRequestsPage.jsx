import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

export default function ReceivedRequestsPage() {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'accepted': return '✅';
      case 'rejected': return '❌';
      default: return '❓';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 border-yellow-200';
      case 'accepted': return 'bg-green-50 border-green-200';
      case 'rejected': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#FFF5E6] to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#F68537] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  const pendingCount = receivedRequests.filter(r => r.status === 'pending').length;
  const acceptedCount = receivedRequests.filter(r => r.status === 'accepted').length;
  const rejectedCount = receivedRequests.filter(r => r.status === 'rejected').length;

  return (
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
                    {pendingCount} pending
                  </span>
                )}
              </h1>
              <p className="text-gray-600 mt-1">Friend requests you've received</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 md:gap-4">
            <div className="bg-yellow-50 rounded-lg p-3 text-center border-2 border-yellow-200">
              <div className="text-2xl md:text-3xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-xs md:text-sm text-yellow-800 mt-1">Pending</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center border-2 border-green-200">
              <div className="text-2xl md:text-3xl font-bold text-green-600">{acceptedCount}</div>
              <div className="text-xs md:text-sm text-green-800 mt-1">Accepted</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center border-2 border-red-200">
              <div className="text-2xl md:text-3xl font-bold text-red-600">{rejectedCount}</div>
              <div className="text-xs md:text-sm text-red-800 mt-1">Rejected</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center border-2 border-gray-200">
              <div className="text-2xl md:text-3xl font-bold text-gray-600">{receivedRequests.length}</div>
              <div className="text-xs md:text-sm text-gray-800 mt-1">Total</div>
            </div>
          </div>
        </div>

        {/* Debug Panel (Optional - can remove after testing) */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800 font-medium mb-2">
            🔍 Debug Mode
          </p>
          <p className="text-xs text-blue-700">
            • Open Console (F12) before clicking Accept<br/>
            • Check detailed logs for errors<br/>
            • Verify friendships table after accepting
          </p>
        </div>

        {/* Received Requests List */}
        {receivedRequests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No requests</h2>
            <p className="text-gray-600">You haven't received any friend requests yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {receivedRequests.map((request) => (
              <div
                key={request.id}
                className={`bg-white rounded-xl shadow-md border-2 p-4 md:p-6 hover:shadow-lg transition-shadow ${getStatusColor(request.status)}`}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={request.sender?.avatar_url || `https://ui-avatars.com/api/?name=${request.sender?.username || 'User'}&background=F68537&color=fff`}
                    alt={request.sender?.username}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-[#F68537] flex-shrink-0 object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-800 font-bold text-base md:text-lg">
                      {request.sender?.username || 'Unknown User'}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm truncate">
                      {request.sender?.email}
                    </p>
                    {request.sender?.phone && (
                      <p className="text-gray-500 text-xs mt-1">
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
                          🗑️ Remove
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
  );
}