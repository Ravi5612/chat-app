import Button from '../ui/Button';

export default function NotificationHeader({ 
  unreadCount, 
  onMarkAllRead 
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
          🔔 Notifications
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </h1>
        <p className="text-gray-600 mt-1">Stay updated with your activity</p>
      </div>
      
      {unreadCount > 0 && (
        <Button
          onClick={onMarkAllRead}
          variant="primary"
          size="medium"
        >
          Mark all read
        </Button>
      )}
    </div>
  );
}