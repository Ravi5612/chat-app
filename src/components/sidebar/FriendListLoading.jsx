export default function FriendListLoading() {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#F68537] mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading friends...</p>
        </div>
      </div>
    );
  }