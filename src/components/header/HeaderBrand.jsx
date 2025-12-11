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
    <div className="flex items-center space-x-2 md:space-x-3">
      <img
        src={isLoggedIn ? getAvatarUrl() : company.logo}
        alt={isLoggedIn ? "User" : "Company"}
        onClick={handleClick}
        className={`w-8 h-8 md:w-10 md:h-10 border-2 border-white object-cover cursor-pointer hover:opacity-80 transition-opacity ${
          isLoggedIn ? 'rounded-full' : 'rounded-lg'
        }`}
      />
      <span 
        onClick={handleClick}
        className="font-semibold text-sm md:text-lg cursor-pointer hover:opacity-80 transition-opacity"
      >
        {isLoggedIn ? getDisplayName() : company.name}
      </span>
    </div>
  );
}