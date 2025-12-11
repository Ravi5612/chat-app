import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function PersistentLayout() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

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
        <Sidebar onSelectFriend={handleSelectFriend} />
        
        {/* Page content - Changes based on route */}
        <div className="flex-1 overflow-hidden">
          <Outlet context={{ selectedFriend, searchResults, handleClearSearch }} />
        </div>
      </div>
    </div>
  );
}