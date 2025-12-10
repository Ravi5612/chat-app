import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase/client';

export default function Header({ onSearch, onClearSearch }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null); // ✅ Profile data
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  
  const company = {
    name: "Baat-Kro",
    logo: "https://via.placeholder.com/40?text=BK"
  };

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsLoggedIn(true);
        loadUserProfile(session.user.id); // ✅ Load profile when logged in
      } else {
        setUser(null);
        setUserProfile(null);
        setIsLoggedIn(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ✅ AUTO-SEARCH: Typing ke saath search
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const delaySearch = setTimeout(() => {
        performSearch();
      }, 500);

      return () => clearTimeout(delaySearch);
    } else {
      if (onClearSearch) {
        onClearSearch();
      }
    }
  }, [searchQuery]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setIsLoggedIn(true);
      loadUserProfile(user.id); // ✅ Load profile
    } else {
      setIsLoggedIn(false);
      setUserProfile(null);
    }
  };

  // ✅ Load user profile from database
  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const performSearch = async () => {
    if (!searchQuery.trim()) return;
  
    setSearching(true);
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
  
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`)
        .limit(20);
  
      if (error) throw error;
  
      const usersWithStatus = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: friendship } = await supabase
            .from('friendships')
            .select('*')
            .eq('user_id', currentUser.id)
            .eq('friend_id', profile.id)
            .single();
  
          const { data: request } = await supabase
            .from('friend_requests')
            .select('*')
            .eq('sender_id', currentUser.id)
            .eq('receiver_id', profile.id)
            .eq('status', 'pending')
            .single();
  
          return {
            ...profile,
            isFriend: !!friendship,
            requestSent: !!request
          };
        })
      );
  
      if (onSearch) {
        onSearch(usersWithStatus, currentUser.id);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    performSearch();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (onClearSearch) {
      onClearSearch();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    setUserProfile(null);
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  // ✅ Get display avatar
  const getAvatarUrl = () => {
    if (userProfile?.avatar_url) {
      return userProfile.avatar_url;
    }
    const displayName = userProfile?.username || user?.email?.split('@')[0] || 'User';
    return `https://ui-avatars.com/api/?name=${displayName}&background=F68537&color=fff&size=200`;
  };

  // ✅ Get display name
  const getDisplayName = () => {
    return userProfile?.username || user?.user_metadata?.name || user?.email?.split('@')[0] || "User";
  };

  return (
    <header className="bg-[#F68537] text-white shadow-lg">
      <div className="h-16 flex items-center px-4 md:px-6">
        {/* ✅ Logo/Avatar Section */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <img
            src={isLoggedIn ? getAvatarUrl() : company.logo}
            alt={isLoggedIn ? "User" : "Company"}
            className={`w-8 h-8 md:w-10 md:h-10 border-2 border-white object-cover ${
              isLoggedIn ? 'rounded-full' : 'rounded-lg'
            }`}
          />
          <span className="font-semibold text-sm md:text-lg">
            {isLoggedIn ? getDisplayName() : company.name}
          </span>
        </div>

        <div className="flex-1"></div>

        {/* LOGGED OUT - Desktop */}
        {!isLoggedIn && (
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
            <button onClick={handleSignup} className="bg-white text-[#F68537] px-4 py-2 rounded-lg font-semibold hover:bg-[#EAD8A4] hover:text-gray-800 transition-colors shadow-md">
              Sign Up
            </button>
            <button onClick={handleLogin} className="bg-white text-[#F68537] px-4 py-2 rounded-lg font-semibold hover:bg-[#EAD8A4] hover:text-gray-800 transition-colors shadow-md">
              Login
            </button>
          </div>
        )}

        {/* LOGGED IN - Desktop */}
        {isLoggedIn && (
          <div className="hidden md:flex items-center space-x-3">
            <button 
              onClick={() => { navigate('/home'); handleClearSearch(); }}
              className="flex items-center gap-2 bg-[#F68537] hover:bg-[#EAD8A4] hover:text-gray-800 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              🏠 <span>Home</span>
            </button>

            <button 
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 bg-[#F68537] hover:bg-[#EAD8A4] hover:text-gray-800 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              👤 <span>Profile</span>
            </button>

            <button 
              onClick={() => navigate('/notifications')}
              className="flex items-center gap-2 bg-[#F68537] hover:bg-[#EAD8A4] hover:text-gray-800 px-3 py-1.5 rounded-lg transition-colors font-medium relative"
            >
              🔔 <span>Notification</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                5
              </span>
            </button>

            <button 
              onClick={() => navigate('/sent-requests')}
              className="flex items-center gap-2 bg-[#F68537] hover:bg-[#EAD8A4] hover:text-gray-800 px-3 py-1.5 rounded-lg transition-colors font-medium relative"
            >
              📤 <span>Sent</span>
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>

            <button 
              onClick={() => navigate('/received-requests')}
              className="flex items-center gap-2 bg-[#F68537] hover:bg-[#EAD8A4] hover:text-gray-800 px-3 py-1.5 rounded-lg transition-colors font-medium relative"
            >
              📥 <span>Received</span>
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                7
              </span>
            </button>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full px-4 py-1.5 w-80">
              <input 
                type="text" 
                placeholder="Search by name, email or phone..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-gray-800 text-sm" 
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={handleClearSearch}
                  className="text-gray-400 hover:text-gray-600 mr-2"
                >
                  ✕
                </button>
              )}
              <button 
                type="submit"
                disabled={searching}
                className="text-[#F68537] hover:text-[#EAD8A4] transition-colors"
              >
                {searching ? '⏳' : '🔍'}
              </button>
            </form>

            <button onClick={handleLogout} className="bg-white text-[#F68537] px-4 py-2 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-colors shadow-md">
              Logout
            </button>
          </div>
        )}

        {/* MOBILE */}
        <div className="md:hidden flex items-center gap-2">
          {!isLoggedIn ? (
            <button onClick={handleLogin} className="bg-white text-[#F68537] px-3 py-1 rounded-lg font-semibold text-sm shadow-md">Login</button>
          ) : (
            <button onClick={handleLogout} className="bg-white text-red-500 px-3 py-1 rounded-lg font-semibold text-sm shadow-md">Logout</button>
          )}

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 hover:bg-[#EAD8A4] hover:text-gray-800 rounded transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* LOGGED IN - Mobile Menu */}
      {isMobileMenuOpen && isLoggedIn && (
        <div className="md:hidden bg-[#EAD8A4] border-t border-[#F68537] py-3 px-4 space-y-2">
          {/* Search Bar Mobile */}
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full px-3 py-2 mb-3">
            <input 
              type="text" 
              placeholder="Search friends..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-gray-800 text-sm" 
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={handleClearSearch}
                className="text-gray-400 hover:text-gray-600 mr-2"
              >
                ✕
              </button>
            )}
            <button type="submit" className="text-[#F68537]">{searching ? '⏳' : '🔍'}</button>
          </form>

          <button 
            onClick={() => { navigate('/home'); setIsMobileMenuOpen(false); handleClearSearch(); }}
            className="w-full flex items-center justify-between bg-white text-gray-800 px-4 py-2.5 rounded-lg hover:bg-[#F68537] hover:text-white transition-colors"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl">🏠</span>
              <span className="font-medium">Home</span>
            </span>
          </button>

          <button 
            onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}
            className="w-full flex items-center justify-between bg-white text-gray-800 px-4 py-2.5 rounded-lg hover:bg-[#F68537] hover:text-white transition-colors"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl">👤</span>
              <span className="font-medium">My Profile</span>
            </span>
          </button>

          <button 
            onClick={() => { navigate('/notifications'); setIsMobileMenuOpen(false); }}
            className="w-full flex items-center justify-between bg-white text-gray-800 px-4 py-2.5 rounded-lg hover:bg-[#F68537] hover:text-white transition-colors"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl">🔔</span>
              <span className="font-medium">Notifications</span>
            </span>
            <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">5</span>
          </button>

          <button 
            onClick={() => { navigate('/sent-requests'); setIsMobileMenuOpen(false); }}
            className="w-full flex items-center justify-between bg-white text-gray-800 px-4 py-2.5 rounded-lg hover:bg-[#F68537] hover:text-white transition-colors"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl">📤</span>
              <span className="font-medium">Sent Requests</span>
            </span>
            <span className="bg-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">3</span>
          </button>

          <button 
            onClick={() => { navigate('/received-requests'); setIsMobileMenuOpen(false); }}
            className="w-full flex items-center justify-between bg-white text-gray-800 px-4 py-2.5 rounded-lg hover:bg-[#F68537] hover:text-white transition-colors"
          >
            <span className="flex items-center gap-3">
              <span className="text-xl">📥</span>
              <span className="font-medium">Received Requests</span>
            </span>
            <span className="bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">7</span>
          </button>
        </div>
      )}
    </header>
  );
}