export default function NotificationFilters({ 
    filter, 
    setFilter, 
    counts 
  }) {
    const filters = [
      { id: 'all', label: 'All', count: counts.total },
      { id: 'unread', label: 'Unread', count: counts.unread },
      { id: 'friend_request', label: 'Friend Requests', count: counts.friendRequest },
      { id: 'message', label: 'Messages', count: counts.message }
    ];
  
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === id
                ? 'bg-[#F68537] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>
    );
  }