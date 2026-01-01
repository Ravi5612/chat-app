import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';
import Sidebar from '../components/sidebar/Sidebar';
import { usePresence } from '../hooks/usePresence';
import { supabase } from '../supabase/client';

export default function PersistentLayout() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user);
    });
  }, []);

  const onlineUsers = usePresence(currentUser?.id);

  const handleSearch = (results, currentUserId) => {
    console.log('🔍 Search results in layout:', results);
    setSearchResults({ results, currentUserId });
  };

  const handleClearSearch = () => {
    console.log('🧹 Clearing search');
    setSearchResults(null);
  };

  const handleSelectFriend = (friend) => {
    console.log('👤 Selected friend:', friend);
    setSelectedFriend(friend);
    setSearchResults(null); // Clear search when selecting friend
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header - Fixed at top */}
      <Header onSearch={handleSearch} onClearSearch={handleClearSearch} />

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