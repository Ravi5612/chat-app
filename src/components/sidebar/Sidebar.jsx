import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DraggableFloatingButton from '../chat/DraggableFloatingButton';
import SidebarHeader from './SidebarHeader';
import FriendListItem from './FriendListItem';
import FriendListEmpty from './FriendListEmpty';
import FriendListLoading from './FriendListLoading';
import { useFriends } from '../../hooks/useFriends';

export default function Sidebar({ onSelectFriend,onlineUsers = {} }) {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { friends, loading, loadFriends } = useFriends();

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
      {/* Draggable Floating Button */}
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
        <SidebarHeader
          friendsCount={friends.length}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Friends List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#F68537] scrollbar-track-[#EAD8A4]">
          {loading ? (
            <FriendListLoading />
          ) : friends.length === 0 ? (
            <FriendListEmpty onRefresh={loadFriends} />
          ) : (
            <ul className="p-3 md:p-4 space-y-2 md:space-y-3">
              {friends.map((friend) => (
                <FriendListItem
                  key={friend.id}
                  friend={friend}
                  onClick={handleFriendClick}
                  isOnline={!!onlineUsers?.[friend.id]}
                />
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}