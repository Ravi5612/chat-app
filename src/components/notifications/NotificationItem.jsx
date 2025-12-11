import Button from '../ui/Button';
import { formatTime } from '../../utils/dateUtils';

export default function NotificationItem({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}) {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'friend_request': return '👤';
      case 'friend_accepted': return '✅';
      case 'message': return '💬';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'friend_request': return 'bg-blue-100 border-blue-300';
      case 'friend_accepted': return 'bg-green-100 border-green-300';
      case 'message': return 'bg-orange-100 border-orange-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-md border-2 p-4 md:p-5 transition-all hover:shadow-lg ${
        notification.is_read ? 'opacity-75' : ''
      } ${getNotificationColor(notification.type)}`}
    >
      <div className="flex items-start gap-3 md:gap-4">
        {/* Icon */}
        <div className="text-3xl md:text-4xl flex-shrink-0">
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-gray-800 font-medium text-sm md:text-base">
                {notification.message}
              </p>
              <p className="text-gray-500 text-xs md:text-sm mt-1">
                {formatTime(notification.created_at)}
              </p>
            </div>

            {/* Unread Badge */}
            {!notification.is_read && (
              <div className="w-3 h-3 bg-[#F68537] rounded-full flex-shrink-0"></div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            {!notification.is_read && (
              <Button
                onClick={() => onMarkAsRead(notification.id)}
                variant="primary"
                size="small"
              >
                Mark as read
              </Button>
            )}
            
            <Button
              onClick={() => onDelete(notification.id)}
              variant="danger-light"
              size="small"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}