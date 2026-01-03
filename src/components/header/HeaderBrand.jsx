import { useNavigate } from 'react-router-dom';

export default function HeaderBrand({ isLoggedIn, user, userProfile, company }) {
  const navigate = useNavigate();

  const getAvatarUrl = () => {
    if (userProfile?.avatar_url) {
      return userProfile.avatar_url;
    }
    const displayName = userProfile?.username || user?.email?.split('@')[0] || 'User';
    return `https://ui-avatars.com/api/?name=${displayName}&background=F68537&color=fff&size=200`;
  };

  const getDisplayName = () => {
    return userProfile?.username || user?.user_metadata?.name || user?.email?.split('@')[0] || "User";
  };

  const handleClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex items-center gap-3 relative group">
      {isLoggedIn && user ? (
        // ✅ Logged In User Style
        <>
          <img
            src={getAvatarUrl()}
            alt="User"
            onClick={handleClick}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/50 shadow-md object-cover flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
          />
          <span
            onClick={handleClick}
            className="hidden md:block text-base md:text-lg font-bold text-white tracking-wide cursor-pointer hover:text-orange-100 transition-colors drop-shadow-md font-sans normal-case whitespace-nowrap"
          >
            {getDisplayName()}
          </span>
        </>
      ) : (
        // ✅ Company Brand Style
        <>
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-full blur-xl scale-75 group-hover:scale-110 transition-transform duration-500"></div>
            <img
              src={company.logo}
              alt="Company"
              onClick={handleClick}
              className="relative object-cover cursor-pointer hover:scale-105 transition-transform duration-300 z-10 w-20 h-20 md:w-32 md:h-32 translate-y-3 md:translate-y-4 rounded-xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] filter brightness-110"
            />
          </div>
          <span
            onClick={handleClick}
            className="text-lg md:text-2xl font-black tracking-wider text-white cursor-pointer hover:text-orange-100 transition-colors uppercase italic transform -skew-x-6 drop-shadow-[0_2px_0_rgba(0,0,0,0.5)] [text-shadow:_2px_2px_0_rgb(180_83_9)]"
            style={{ fontFamily: "'Arial Black', sans-serif" }}
          >
            {company.name}
          </span>
        </>
      )}
    </div>
  );
}