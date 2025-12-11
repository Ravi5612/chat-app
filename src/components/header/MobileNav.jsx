import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

export default function MobileNav({ 
  isOpen,
  isLoggedIn, 
  notificationCount, 
  sentRequestsCount, 
  receivedRequestsCount,
  onSearch,
  onClearSearch,
  onLogout,
  onLogin,
  onSignup,
  onClose
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  if (!isLoggedIn) {
    return (
      <div className="md:hidden bg-[#F68537] border-t border-white/20 py-2">
        <div className="flex flex-col space-y-2 px-4">
          <button className="text-left py-2 hover:bg-[#EAD8A4] hover:text-gray-800 rounded px-3 transition-colors">
            🏠 Home
          </button>
          <button className="text-left py-2 hover:bg-[#EAD8A4] hover:text-gray-800 rounded px-3 transition-colors">
            💬 Chat App
          </button>
          <button className="text-left py-2 hover:bg-[#EAD8A4] hover:text-gray-800 rounded px-3 transition-colors">
            ℹ️ About
          </button>
          <button 
            onClick={onSignup} 
            className="bg-white text-[#F68537] py-2 rounded-lg font-semibold hover:bg-[#EAD8A4] hover:text-gray-800 transition-colors"
          >
            Sign Up
          </button>
          <button 
            onClick={onLogin} 
            className="bg-white text-[#F68537] py-2 rounded-lg font-semibold hover:bg-[#EAD8A4] hover:text-gray-800 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="md:hidden bg-[#F68537] border-t border-white/20 py-2">
      <div className="flex flex-col space-y-2 px-4">
        <button 
          onClick={() => { 
            navigate('/home'); 
            onClose(); 
            if(onClearSearch) onClearSearch(); 
          }} 
          className="text-left py-2 hover:bg-[#EAD8A4] hover:text-gray-800 rounded px-3 transition-colors"
        >
          🏠 Home
        </button>

        <button 
          onClick={() => { 
            navigate('/profile'); 
            onClose(); 
          }} 
          className="text-left py-2 hover:bg-[#EAD8A4] hover:text-gray-800 rounded px-3 transition-colors"
        >
          👤 Profile
        </button>

        <button 
          onClick={() => { 
            navigate('/notifications'); 
            onClose(); 
          }} 
          className="text-left py-2 hover:bg-[#EAD8A4] hover:text-gray-800 rounded px-3 transition-colors flex justify-between items-center"
        >
          <span>🔔 Notifications</span>
          {notificationCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        <button 
          onClick={() => { 
            navigate('/sent-requests'); 
            onClose(); 
          }} 
          className="text-left py-2 hover:bg-[#EAD8A4] hover:text-gray-800 rounded px-3 transition-colors flex justify-between items-center"
        >
          <span>📤 Sent Requests</span>
          {sentRequestsCount > 0 && (
            <span className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {sentRequestsCount > 9 ? '9+' : sentRequestsCount}
            </span>
          )}
        </button>

        <button 
          onClick={() => { 
            navigate('/received-requests'); 
            onClose(); 
          }} 
          className="text-left py-2 hover:bg-[#EAD8A4] hover:text-gray-800 rounded px-3 transition-colors flex justify-between items-center"
        >
          <span>📥 Received Requests</span>
          {receivedRequestsCount > 0 && (
            <span className="bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {receivedRequestsCount > 9 ? '9+' : receivedRequestsCount}
            </span>
          )}
        </button>
        
        <SearchBar 
          onSearch={onSearch}
          onClear={onClearSearch}
          placeholder="Search users..."
          className="w-full"
        />

        <button 
          onClick={onLogout} 
          className="bg-white text-[#F68537] py-2 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}