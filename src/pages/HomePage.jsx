import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import SearchResults from '../components/SearchResults';

export default function HomePage() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const handleSearch = (results, userId) => {
    setSearchResults(results);
    setCurrentUserId(userId);
    setSelectedFriend(null);
  };

  const handleClearSearch = () => {
    setSearchResults(null);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header onSearch={handleSearch} onClearSearch={handleClearSearch} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onSelectFriend={(friend) => { setSelectedFriend(friend); setSearchResults(null); }} />
        
        {searchResults ? (
          <SearchResults 
            searchResults={searchResults} 
            onClose={handleClearSearch}
            currentUserId={currentUserId}
          />
        ) : (
          <ChatBox selectedFriend={selectedFriend} />
        )}
      </div>
    </div>
  );
}