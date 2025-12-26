import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

const VALID_NOTIFICATION_TYPES = [
  'friend_request',
  'friend_accepted',
  'friend_cancelled',
  'system'
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          // ✅ MESSAGE type yahin block ho jaayega
          if (!VALID_NOTIFICATION_TYPES.includes(payload.new.type)) return;

          setNotifications(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .in('type', VALID_NOTIFICATION_TYPES) // ✅ DB level filter
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.filter(n => n.id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getFilteredNotifications = (filter) => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.is_read);
      case 'friend_request':
        return notifications.filter(
          n =>
            n.type === 'friend_request' ||
            n.type === 'friend_accepted'
        );
      default:
        return notifications;
    }
  };

  const getCounts = () => ({
    total: notifications.length,
    unread: notifications.filter(n => !n.is_read).length,
    friendRequest: notifications.filter(
      n =>
        n.type === 'friend_request' ||
        n.type === 'friend_accepted'
    ).length
  });

  return {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getFilteredNotifications,
    getCounts
  };
};
