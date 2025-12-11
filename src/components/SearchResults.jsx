import { supabase } from '../supabase/client';
import { useState } from 'react';

export default function SearchResults({ results, currentUserId, onClearSearch }) {
  const [sendingRequest, setSendingRequest] = useState({});

  const sendFriendRequest = async (receiverId) => {
    setSendingRequest(prev => ({ ...prev, [receiverId]: true }));
    
    try {
      const { error } = await supabase
        .from('friend_requests')
        .insert([
          {
            sender_id: currentUserId,
            receiver_id: receiverId,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      alert('✅ Friend request sent!');
      
      // Reload search to update button states
      if (onClearSearch) {
        onClearSearch();
      }

    } catch (error) {
      console.error('Error sending friend request:', error);
      alert(`Failed to send request: ${error.message}`);
    } finally {
      setSendingRequest(prev => ({ ...prev, [receiverId]: false }));
    }
  };

  if (!results || results.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#FFF5E6] to-white">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">No users found</h2>
          <p className="text-gray-600 mb-4">Try a different search term</p>
          <button
            onClick={onClearSearch}
            className="bg-[#F68537] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#EAD8A4] hover:text-gray-800 transition-colors"
          >
            Clear Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#FFF5E6] to-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            🔍 Search Results ({results.length})
          </h1>
          <button
            onClick={onClearSearch}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            ✕ Clear
          </button>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {results.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.username || 'User'}&background=F68537&color=fff`}
                  alt={user.username}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-[#F68537] flex-shrink-0 object-cover"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-800 font-bold text-base md:text-lg">
                    {user.username || 'Unknown User'}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm truncate">
                    {user.email}
                  </p>
                  {user.phone && (
                    <p className="text-gray-500 text-xs mt-1">
                      📞 {user.phone}
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0">
                  {user.isFriend ? (
                    <button
                      disabled
                      className="bg-green-100 text-green-600 px-4 py-2 rounded-lg font-medium cursor-not-allowed text-sm md:text-base"
                    >
                      ✓ Friends
                    </button>
                  ) : user.requestSent ? (
                    <button
                      disabled
                      className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium cursor-not-allowed text-sm md:text-base"
                    >
                      ⏳ Pending
                    </button>
                  ) : (
                    <button
                      onClick={() => sendFriendRequest(user.id)}
                      disabled={sendingRequest[user.id]}
                      className="bg-[#F68537] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#EAD8A4] hover:text-gray-800 transition-colors disabled:opacity-50 text-sm md:text-base"
                    >
                      {sendingRequest[user.id] ? '⏳' : '➕ Add Friend'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}