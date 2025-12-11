import Button from '../ui/Button';

export default function FriendListEmpty({ onRefresh }) {
  return (
    <div className="flex items-center justify-center h-full p-6 text-center">
      <div>
        <div className="text-6xl mb-4">👥</div>
        <h3 className="font-bold text-gray-800 mb-2">No friends yet</h3>
        <p className="text-gray-600 text-sm mb-4">Accept friend requests to see them here!</p>
        <Button
          onClick={onRefresh}
          variant="primary"
          size="small"
        >
          Refresh List
        </Button>
      </div>
    </div>
  );
}