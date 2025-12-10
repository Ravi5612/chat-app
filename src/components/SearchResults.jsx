import { useState } from 'react';
import { supabase } from '../supabase/client';

export default function SearchResults({ searchResults, onClose, currentUserId }) {
  const [sendingRequest, setSendingRequest] = useState(null);

  const sendFriendRequest = async (receiverId) => {
    try {
      setSendingRequest(receiverId);

      // Check if request already exists
      const { data: existing } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('sender_id', currentUserId)
        .eq('receiver_id', receiverId)
        .single();

      if (existing) {
        alert('Friend request already sent!');
        return;
      }

      // Check if already friends
      const { data: friendship } = await supabase
        .from('friendships')
        .select('*')
        .eq('user_id', currentUserId)
        .eq('friend_id', receiverId)
        .single();

      if (friendship) {
        alert('Already friends!');
        return;
      }

      // Send friend request
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

      // Create notification
      await supabase
        .from('notifications')
        .insert([
          {
            user_id: receiverId,
            type: 'friend_request',
            sender_id: currentUserId,
            message: 'sent you a friend request'
          }
        ]);

      alert('Friend request sent! ✅');
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request');
    } finally {
      setSendingRequest(null);
    }
  };

  if (!searchResults || searchResults.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#FFF5E6] to-white">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No users found</h2>
          <p className="text-gray-600">Try searching with a different name</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#FFF5E6] to-white">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                🔍 Search Results
                <span className="bg-[#F68537] text-white text-sm px-3 py-1 rounded-full">
                  {searchResults.length} found
                </span>
              </h1>
              <p className="text-gray-600 mt-1">Found {searchResults.length} user(s)</p>
            </div>
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Search Results List */}
        <div className="space-y-3">
          {searchResults.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow-md border-2 border-gray-200 p-4 md:p-5 transition-all hover:shadow-lg hover:border-[#F68537]"
            >
              <div className="flex items-center gap-3 md:gap-4">
                {/* Avatar */}
                <img
                  src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.username || 'User'}&background=F68537&color=fff`}
                  alt={user.username}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-[#F68537] flex-shrink-0"
                />

               {/* User Info */}
<div className="flex-1 min-w-0">
  <h3 className="text-gray-800 font-bold text-base md:text-lg">
    {user.username || 'Unknown User'}
  </h3>
  <p className="text-gray-600 text-xs md:text-sm truncate">
    {user.email}
  </p>
  {user.phone && (
    <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
      📞 {user.phone}
    </p>
  )}
  {user.bio && (
    <p className="text-gray-500 text-xs mt-1 truncate">
      {user.bio}
    </p>
  )}
</div>

                {/* Action Button */}
                <div className="flex-shrink-0">
                  {user.id === currentUserId ? (
                    <span className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg font-medium text-xs md:text-sm">
                      You
                    </span>
                  ) : user.isFriend ? (
                    <span className="bg-green-100 text-green-600 px-4 py-2 rounded-lg font-medium text-xs md:text-sm">
                      ✓ Friends
                    </span>
                  ) : user.requestSent ? (
                    <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium text-xs md:text-sm">
                      ⏳ Pending
                    </span>
                  ) : (
                    <button
                      onClick={() => sendFriendRequest(user.id)}
                      disabled={sendingRequest === user.id}
                      className="bg-[#F68537] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#EAD8A4] hover:text-gray-800 transition-colors text-xs md:text-sm disabled:opacity-50"
                    >
                      {sendingRequest === user.id ? 'Sending...' : '+ Add Friend'}
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