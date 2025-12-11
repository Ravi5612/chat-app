export default function NotificationEmptyState({ filter }) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
        <div className="text-6xl mb-4">🔕</div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          {filter === 'all' ? 'No notifications yet' : `No ${filter.replace('_', ' ')} notifications`}
        </h2>
        <p className="text-gray-600">
          {filter === 'all'
            ? "When you get notifications, they'll show up here"
            : 'Try selecting a different filter'}
        </p>
      </div>
    );
  }