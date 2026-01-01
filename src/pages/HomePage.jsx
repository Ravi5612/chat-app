import { useOutletContext } from 'react-router-dom';
import ChatBox from '../components/chat/ChatBox';
import SearchResults from '../components/SearchResults';

export default function HomePage() {
  const { selectedFriend, searchResults, handleClearSearch, onlineUsers } = useOutletContext();

  return (
    <div className="flex-1 h-full overflow-hidden">
      {searchResults ? (
        <SearchResults
          results={searchResults.results}
          currentUserId={searchResults.currentUserId}
          onClearSearch={handleClearSearch}
        />
      ) : (
        <ChatBox
          selectedFriend={selectedFriend}
          isOnline={selectedFriend ? !!onlineUsers?.[selectedFriend.id] : false}
        />
      )}
    </div>
  );
}