export default function ProfileStats() {
    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4 text-center border-2 border-blue-200">
          <div className="text-3xl font-bold text-blue-600">0</div>
          <div className="text-sm text-blue-800 mt-1">Friends</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center border-2 border-green-200">
          <div className="text-3xl font-bold text-green-600">0</div>
          <div className="text-sm text-green-800 mt-1">Messages</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center border-2 border-purple-200">
          <div className="text-3xl font-bold text-purple-600">0</div>
          <div className="text-sm text-purple-800 mt-1">Requests</div>
        </div>
      </div>
    );
  }