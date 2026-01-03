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
      <div className="hidden md:flex items-center space-x-6">
        <button onClick={() => navigate('/')} className="hover:text-orange-100 transition-colors font-medium text-white flex items-center gap-2">
          <span>🏠</span> Home
        </button>
        <button onClick={() => navigate('/about')} className="hover:text-orange-100 transition-colors font-medium text-white flex items-center gap-2">
          <span>ℹ️</span> About
        </button>
        <button onClick={() => navigate('/contact')} className="hover:text-orange-100 transition-colors font-medium text-white flex items-center gap-2">
          <span>📞</span> Contact
        </button>

        <div className="flex items-center gap-3 ml-4">
          <button onClick={onLogin} className="px-5 py-2 rounded-full border border-white text-white hover:bg-white hover:text-[#F68537] transition-all font-medium">
            Login
          </button>
          <button onClick={onSignup} className="px-5 py-2 rounded-full bg-white text-[#F68537] hover:bg-orange-50 hover:shadow-lg transition-all font-medium">
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center space-x-3">
      <NavButton
        icon="🏠"
        label="Home"
        onClick={() => {
          navigate('/');
          if (onClearSearch) onClearSearch();
        }}
      />

      <NavButton
        icon="ℹ️"
        label="About"
        onClick={() => navigate('/about')}
      />

      <NavButton
        icon="📞"
        label="Contact"
        onClick={() => navigate('/contact')}
      />

      <NavButton
        icon="💬"
        label="Message"
        onClick={() => navigate('/home')}
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