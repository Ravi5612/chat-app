export default function RequestEmptyState({ type = 'sent' }) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          No {type} requests
        </h2>
        <p className="text-gray-600">
          {type === 'sent' 
            ? "You haven't sent any friend requests yet"
            : "You haven't received any friend requests yet"}
        </p>
      </div>
    );
  }