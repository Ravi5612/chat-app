import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/client';
import HeaderBrand from './HeaderBrand'; // ✅ Fixed
import DesktopNav from './DesktopNav';   // ✅ Fixed
import MobileNav from './MobileNav';     // ✅ Fixed - Was importing DesktopNav!

export default function Header({ onSearch, onClearSearch }) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  
  const [notificationCount, setNotificationCount] = useState(0);
  const [sentRequestsCount, setSentRequestsCount] = useState(0);
  const [receivedRequestsCount, setReceivedRequestsCount] = useState(0);
  
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
        loadUserProfile(session.user.id);
        loadCounts(session.user.id);
      } else {
        setUser(null);
        setUserProfile(null);
        setIsLoggedIn(false);
        resetCounts();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const notifChannel = supabase
      .channel('notifications-count')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        () => loadCounts(user.id)
      )
      .subscribe();

    const requestsChannel = supabase
      .channel('requests-count')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'friend_requests' },
        () => loadCounts(user.id)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notifChannel);
      supabase.removeChannel(requestsChannel);
    };
  }, [user?.id]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setIsLoggedIn(true);
      loadUserProfile(user.id);
      loadCounts(user.id);
    } else {
      setIsLoggedIn(false);
      setUserProfile(null);
      resetCounts();
    }
  };

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

  const loadCounts = async (userId) => {
    try {
      const [notifResult, sentResult, receivedResult] = await Promise.all([
        supabase
          .from('notifications')
          .select('id')
          .eq('user_id', userId)
          .eq('is_read', false),
        
        supabase
          .from('friend_requests')
          .select('id')
          .eq('sender_id', userId)
          .eq('status', 'pending'),
        
        supabase
          .from('friend_requests')
          .select('id')
          .eq('receiver_id', userId)
          .eq('status', 'pending')
      ]);

      setNotificationCount(notifResult.data?.length || 0);
      setSentRequestsCount(sentResult.data?.length || 0);
      setReceivedRequestsCount(receivedResult.data?.length || 0);

    } catch (error) {
      console.error('Error loading counts:', error);
      setNotificationCount(0);
      setSentRequestsCount(0);
      setReceivedRequestsCount(0);
    }
  };

  const resetCounts = () => {
    setNotificationCount(0);
    setSentRequestsCount(0);
    setReceivedRequestsCount(0);
  };

  const handleSearchQuery = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      console.log('🔍 Searching for:', searchQuery);

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, email, phone, avatar_url')
        .or(`username.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`)
        .neq('id', currentUser.id)
        .limit(20);

      if (profileError) {
        console.error('Profile search error:', profileError);
        throw profileError;
      }

      console.log('✅ Found profiles:', profiles?.length || 0);

      if (!profiles || profiles.length === 0) {
        if (onSearch) {
          onSearch([], currentUser.id);
        }
        return;
      }

      const { data: friendships } = await supabase
        .from('friendships')
        .select('friend_id')
        .eq('user_id', currentUser.id);

      const friendIds = new Set((friendships || []).map(f => f.friend_id));

      const { data: requests } = await supabase
        .from('friend_requests')
        .select('receiver_id')
        .eq('sender_id', currentUser.id)
        .eq('status', 'pending');

      const requestIds = new Set((requests || []).map(r => r.receiver_id));

      const usersWithStatus = profiles.map(profile => ({
        ...profile,
        isFriend: friendIds.has(profile.id),
        requestSent: requestIds.has(profile.id)
      }));

      console.log('✅ Users with status:', usersWithStatus);

      if (onSearch) {
        onSearch(usersWithStatus, currentUser.id);
      }

    } catch (error) {
      console.error('❌ Error searching users:', error);
      alert(`Search failed: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    setUserProfile(null);
    resetCounts();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <header className="bg-[#F68537] text-white shadow-lg">
      <div className="h-16 flex items-center px-4 md:px-6">
        {/* Brand/Logo */}
        <HeaderBrand 
          isLoggedIn={isLoggedIn}
          user={user}
          userProfile={userProfile}
          company={company}
        />

        <div className="flex-1"></div>

        {/* Desktop Navigation */}
        <DesktopNav 
          isLoggedIn={isLoggedIn}
          notificationCount={notificationCount}
          sentRequestsCount={sentRequestsCount}
          receivedRequestsCount={receivedRequestsCount}
          onSearch={handleSearchQuery}
          onClearSearch={onClearSearch}
          onLogout={handleLogout}
          onLogin={handleLogin}
          onSignup={handleSignup}
        />

        {/* Mobile Menu Toggle */}
        <button 
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
  className="md:hidden p-2 focus:outline-none"
>
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {isMobileMenuOpen ? (
      // "X" Icon jab menu khula ho
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    ) : (
      // "3 Lines" Icon jab menu band ho
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    )}
  </svg>
</button>
      </div>

      {/* Mobile Navigation */}
      <MobileNav 
        isOpen={isMobileMenuOpen}
        isLoggedIn={isLoggedIn}
        notificationCount={notificationCount}
        sentRequestsCount={sentRequestsCount}
        receivedRequestsCount={receivedRequestsCount}
        onSearch={handleSearchQuery}
        onClearSearch={onClearSearch}
        onLogout={handleLogout}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}