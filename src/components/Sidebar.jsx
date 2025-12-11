import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';
import DraggableFloatingButton from './DraggableFloatingButton'; // ✅ Import

export default function Sidebar({ onSelectFriend }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const handleFriendClick = (friend) => {
    console.log('👤 Friend clicked:', friend.name);
    setIsSidebarOpen(false);
    
    if (onSelectFriend) {
      onSelectFriend(friend);
    }
    
    navigate('/home');
  };

  return (
    <>
      {/* ✅ Draggable Floating Button - Clean! */}
      <DraggableFloatingButton 
        onClick={() => setIsSidebarOpen(true)}
        isVisible={!isSidebarOpen}
      />

      {/* Mobile: Overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-72 md:w-50 lg:w-80
        bg-[#EAD8A4] border-r border-[#F68537] 
        flex flex-col h-screen md:h-[calc(100vh-4rem)]
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#F68537] bg-[#EAD8A4] sticky top-0 z-10">
          <h2 className="font-bold text-base md:text-lg text-gray-800">
            Friends List {friends.length > 0 && `(${friends.length})`}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-2xl">❤️</span>
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="md:hidden text-gray-800 hover:text-[#F68537] text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Friends List */}
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
                <p className="text-gray-600 text-sm mb-4">Accept friend requests to see them here!</p>
                <button 
                  onClick={loadFriends} 
                  className="bg-[#F68537] text-white px-4 py-2 rounded-lg hover:bg-[#EAD8A4] hover:text-gray-800 transition-colors text-sm"
                >
                  Refresh List
                </button>
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
                  <div className="relative flex-shrink-0">
                    <img
                      src={friend.img}
                      alt={friend.name}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#F68537] object-cover"
                    />
                    {friend.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {friend.unreadCount > 9 ? '9+' : friend.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 overflow-hidden min-w-0">
                    <p className="font-semibold text-xs md:text-sm truncate">{friend.name}</p>
                    <p className="text-xs text-gray-600 group-hover:text-gray-200 truncate">{friend.email}</p>
                  </div>

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