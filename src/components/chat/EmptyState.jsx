export default function EmptyState({ type = 'no-friend' }) {
    if (type === 'loading') {
      return (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#FFF5E6] to-white">
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#F68537] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user...</p>
          </div>
        </div>
      );
    }
  
    if (type === 'no-friend') {
      return (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#FFF5E6] to-white">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Select a friend to chat
            </h2>
            <p className="text-gray-600">
              Choose a friend from the sidebar to start messaging
            </p>
          </div>
        </div>
      );
    }
  
    return null;
  }