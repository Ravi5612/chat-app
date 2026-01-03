import { useContext, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// Header is now in RootLayout
import Sidebar from '../components/sidebar/Sidebar';
import { usePresence } from '../hooks/usePresence';
import { supabase } from '../supabase/client';
import { useSearch } from '../context/SearchContext';

export default function PersistentLayout() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  // Removed local search state
  const [currentUser, setCurrentUser] = useState(null);
  const { searchResults, handleClearSearch } = useSearch();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user);
    });
  }, []);

  const onlineUsers = usePresence(currentUser?.id);

  // handleSearch logic is now in Context/Header

  const handleSelectFriend = (friend) => {
    console.log('👤 Selected friend:', friend);
    setSelectedFriend(friend);
    handleClearSearch(); // Clear search from Context
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* Header is in RootLayout, so this container fills remaining height */}

      {/* Main content area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Persistent */}
        <Sidebar onSelectFriend={handleSelectFriend} onlineUsers={onlineUsers} />

        {/* Page content - Changes based on route */}
        <div className="flex-1 overflow-hidden">
          <Outlet context={{ selectedFriend, searchResults, handleClearSearch, onlineUsers }} />
        </div>
      </div>
    </div>
  );
}