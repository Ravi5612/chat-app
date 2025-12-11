export default function FriendListItem({ friend, onClick }) {
    return (
      <li
        className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 hover:bg-[#F68537] hover:text-white rounded-lg transition-all cursor-pointer group"
        onClick={() => onClick(friend)}
      >
        <div className="relative flex-shrink-0">
          <img
            src={friend.img}
            alt={friend.name}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#F68537] object-cover"
          />
          {friend.unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {friend.unreadCount > 9 ? '9+' : friend.unreadCount}
            </span>
          )}
        </div>
  
        <div className="flex-1 overflow-hidden min-w-0">
          <p className="font-semibold text-xs md:text-sm truncate">{friend.name}</p>
          <p className="text-xs text-gray-600 group-hover:text-gray-200 truncate">{friend.email}</p>
        </div>
  
        {friend.unreadCount > 0 && (
          <div className="flex-shrink-0">
            <span className="bg-[#F68537] group-hover:bg-white group-hover:text-[#F68537] text-white text-xs font-bold px-2 py-1 rounded-full">
              {friend.unreadCount}
            </span>
          </div>
        )}
      </li>
    );
  }