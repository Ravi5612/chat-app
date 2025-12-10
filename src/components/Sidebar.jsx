import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

export default function Sidebar({ onSelectFriend }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    loadFriends();
    
    // Real-time listener for new friends
    const channel = supabase
      .channel('friendships')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'friendships'
        }, 
        () => {
          loadFriends();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadFriends = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setCurrentUserId(user.id);

      // Get all friendships
      const { data: friendships, error: friendshipError } = await supabase
        .from('friendships')
        .select('friend_id')
        .eq('user_id', user.id);

      if (friendshipError) {
        console.error('Friendship query error:', friendshipError);
        throw friendshipError;
      }

      if (!friendships || friendships.length === 0) {
        setFriends([]);
        setLoading(false);
        return;
      }

      // Get friend IDs
      const friendIds = friendships.map(f => f.friend_id);

      // Get profiles for all friends
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, email, phone, avatar_url')
        .in('id', friendIds);

      if (profileError) {
        console.error('Profile query error:', profileError);
        throw profileError;
      }

      // Get unread message counts for each friend
      const friendsWithUnread = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_id', profile.id)
            .eq('receiver_id', user.id)
            .eq('is_read', false);

          return {
            id: profile.id,
            name: profile.username || 'Unknown User',
            email: profile.email || 'No email',
            img: profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.username || 'User'}&background=F68537&color=fff`,
            unreadCount: count || 0
          };
        })
      );

      setFriends(friendsWithUnread);
    } catch (error) {
      console.error('Error loading friends:', error);
      setFriends([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFriendClick = (friend) => {
    setIsSidebarOpen(false);
    if (onSelectFriend) {
      onSelectFriend(friend);
    }
  };

  return (
    <>
      {/* Mobile: Floating Toggle Button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-[#F68537] text-white p-6 rounded-full shadow-2xl hover:bg-[#EAD8A4] hover:text-gray-800 transition-all"
        >
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </button>
      )}

      {/* Mobile: Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-72 md:w-50 lg:w-80
          bg-[#EAD8A4] border-r border-[#F68537] 
          flex flex-col h-screen md:h-[calc(100vh-4rem)]
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header with Heart Icon - Fixed */}
        <div className="flex items-center justify-between p-4 border-b border-[#F68537] bg-[#EAD8A4] sticky top-0 z-10">
          <h2 className="font-bold text-base md:text-lg text-gray-800">
            Friends List {friends.length > 0 && `(${friends.length})`}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-2xl">❤️</span>
            {/* Close button for mobile */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-gray-800 hover:text-[#F68537] text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Friends List - Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#F68537] scrollbar-track-[#EAD8A4]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#F68537] mx-auto mb-3"></div>
                <p className="text-gray-600 text-sm">Loading friends...</p>
              </div>
            </div>
          ) : friends.length === 0 ? (
            <div className="flex items-center justify-center h-full p-6 text-center">
              <div>
                <div className="text-6xl mb-4">👥</div>
                <h3 className="font-bold text-gray-800 mb-2">No friends yet</h3>
                <p className="text-gray-600 text-sm">Start by sending friend requests!</p>
              </div>
            </div>
          ) : (
            <ul className="p-3 md:p-4 space-y-2 md:space-y-3">
              {friends.map((friend) => (
                <li
                  key={friend.id}
                  className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 hover:bg-[#F68537] hover:text-white rounded-lg transition-all cursor-pointer group"
                  onClick={() => handleFriendClick(friend)}
                >
                  {/* Friend Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={friend.img}
                      alt={friend.name}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#F68537]"
                    />
                    {/* Unread Badge on Image */}
                    {friend.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {friend.unreadCount > 9 ? '9+' : friend.unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Friend Info */}
                  <div className="flex-1 overflow-hidden min-w-0">
                    <p className="font-semibold text-xs md:text-sm truncate">{friend.name}</p>
                    <p className="text-xs text-gray-600 group-hover:text-gray-200 truncate">{friend.email}</p>
                  </div>

                  {/* Unread Count Badge (Right Side) */}
                  {friend.unreadCount > 0 && (
                    <div className="flex-shrink-0">
                      <span className="bg-[#F68537] group-hover:bg-white group-hover:text-[#F68537] text-white text-xs font-bold px-2 py-1 rounded-full">
                        {friend.unreadCount}
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}