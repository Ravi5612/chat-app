import { useNavigate } from 'react-router-dom';
import NavButton from './NavButton';
import SearchBar from './SearchBar';

export default function DesktopNav({ 
  isLoggedIn, 
  notificationCount, 
  sentRequestsCount, 
  receivedRequestsCount,
  onSearch,
  onClearSearch,
  onLogout,
  onLogin,
  onSignup
}) {
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <div className="hidden md:flex items-center space-x-3">
        <button className="flex items-center gap-2 bg-[#F68537] hover:bg-[#EAD8A4] hover:text-gray-800 px-3 py-1.5 rounded-lg transition-colors font-medium">
          🏠 <span>Home</span>
        </button>
        <button className="flex items-center gap-2 bg-[#F68537] hover:bg-[#EAD8A4] hover:text-gray-800 px-3 py-1.5 rounded-lg transition-colors font-medium">
          💬 <span>Chat App</span>
        </button>
        <button className="flex items-center gap-2 bg-[#F68537] hover:bg-[#EAD8A4] hover:text-gray-800 px-3 py-1.5 rounded-lg transition-colors font-medium">
          ℹ️ <span>About</span>
        </button>
        <button onClick={onSignup} className="bg-white text-[#F68537] px-4 py-2 rounded-lg font-semibold hover:bg-[#EAD8A4] hover:text-gray-800 transition-colors shadow-md">
          Sign Up
        </button>
        <button onClick={onLogin} className="bg-white text-[#F68537] px-4 py-2 rounded-lg font-semibold hover:bg-[#EAD8A4] hover:text-gray-800 transition-colors shadow-md">
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center space-x-3">
      <NavButton 
        icon="🏠"
        label="Home"
        onClick={() => { 
          navigate('/home'); 
          if(onClearSearch) onClearSearch(); 
        }}
      />

      <NavButton 
        icon="👤"
        label="Profile"
        onClick={() => navigate('/profile')}
      />

      <NavButton 
        icon="🔔"
        label="Notification"
        onClick={() => navigate('/notifications')}
        badge={notificationCount}
        badgeColor="red"
      />

      <NavButton 
        icon="📤"
        label="Sent"
        onClick={() => navigate('/sent-requests')}
        badge={sentRequestsCount}
        badgeColor="blue"
      />

      <NavButton 
        icon="📥"
        label="Received"
        onClick={() => navigate('/received-requests')}
        badge={receivedRequestsCount}
        badgeColor="green"
      />

      <SearchBar 
        onSearch={onSearch}
        onClear={onClearSearch}
        placeholder="Search by name, email or phone..."
        className="w-80"
      />

      <button 
        onClick={onLogout} 
        className="bg-white text-[#F68537] px-4 py-2 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-colors shadow-md"
      >
        Logout
      </button>
    </div>
  );
}