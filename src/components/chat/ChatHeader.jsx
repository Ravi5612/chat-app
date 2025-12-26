import { useState } from 'react';
import Calling from "./Vcall";
import VCall from "./calling";
export default function ChatHeader({ friend }) {
  const [showMenu, setShowMenu] = useState(false);

  if (!friend) return null;

  const handleBlock = () => {
    alert(`Block ${friend.name}? (Feature coming soon!)`);
    setShowMenu(false);
  };

  const handleMute = () => {
    alert(`Mute ${friend.name}? (Feature coming soon!)`);
    setShowMenu(false);
  };

  const handleClearChat = () => {
    const confirm = window.confirm(`Clear chat with ${friend.name}?`);
    if (confirm) {
      alert('Chat cleared! (Feature coming soon!)');
    }
    setShowMenu(false);
  };

  const handleReport = () => {
    alert(`Report ${friend.name}? (Feature coming soon!)`);
    setShowMenu(false);
  };

  const handleViewProfile = () => {
    alert(`View ${friend.name}'s profile (Feature coming soon!)`);
    setShowMenu(false);
  };

    const comingSoon = () => {
    alert("Feature coming soon 🚧");
  };
  return (
    <div className="flex-shrink-0 bg-white border border-[#F68537] p-4 shadow-md relative">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <img
          src={friend.img}
          alt={friend.name}
          className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#F68537] object-cover"
        />
        
        {/* Name and Status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-base md:text-lg text-gray-800 truncate">
              {friend.name}
            </h2>
            {/* Online Status Badge */}
            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></span>
              Online
            </span>
          </div>
          <p className="text-xs md:text-sm text-gray-600 truncate">
            {friend.email}
          </p>
        </div>
 <div className="flex items-center gap-3">
      <Calling onClick={comingSoon} />
      <VCall onClick={comingSoon} />
    </div>
        {/* 3-Dot Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-[#F68537]/10 rounded-full transition-colors"
            title="More options"
          >
            <svg className="w-6 h-6 text-[#F68537]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <>
              {/* Backdrop to close menu */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              ></div>

              {/* Menu Items - White with Orange Border */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-[#F68537] py-1 z-20">
                <button
                  onClick={handleViewProfile}
                  className="w-full text-left px-4 py-2 hover:bg-[#F68537]/10 flex items-center gap-2 text-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-[#F68537]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Profile
                </button>

                <button
                  onClick={handleMute}
                  className="w-full text-left px-4 py-2 hover:bg-[#F68537]/10 flex items-center gap-2 text-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-[#F68537]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                  Mute Notifications
                </button>

                <button
                  onClick={handleClearChat}
                  className="w-full text-left px-4 py-2 hover:bg-[#F68537]/10 flex items-center gap-2 text-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 text-[#F68537]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Chat
                </button>

                <hr className="my-1 border-[#F68537]/30" />

                <button
                  onClick={handleBlock}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Block User
                </button>

                <button
                  onClick={handleReport}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Report User
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}