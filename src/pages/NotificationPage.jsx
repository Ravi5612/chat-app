import { useState } from 'react';
import ScrollContainer from '../components/ScrollContainer';
import NotificationHeader from '../components/notifications/NotificationHeader';
import NotificationFilters from '../components/notifications/NotificationFilters';
import NotificationItem from '../components/notifications/NotificationItem';
import NotificationEmptyState from '../components/notifications/NotificationEmptyState';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationPage() {
  const [filter, setFilter] = useState('all');
  
  const {
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getFilteredNotifications,
    getCounts
  } = useNotifications();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#FFF5E6] to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#F68537] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading notifications...</p>
        </div>
      </div>
    );
  }

  const filteredNotifications = getFilteredNotifications(filter);
  const counts = getCounts();

  return (
    <ScrollContainer className="bg-gradient-to-b from-[#FFF5E6] to-white">
      <div className="max-w-4xl mx-auto p-4 md:p-6 pb-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-6">
          <NotificationHeader
            unreadCount={counts.unread}
            onMarkAllRead={markAllAsRead}
          />

          {/* Filter Tabs */}
          <NotificationFilters
            filter={filter}
            setFilter={setFilter}
            counts={counts}
          />
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <NotificationEmptyState filter={filter} />
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        )}
      </div>
    </ScrollContainer>
  );
}