// src/hooks/usePresence.js
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; // Path check kar lena

export const usePresence = (myUserId) => {
  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(() => {
    if (!myUserId) return;

    const channel = supabase.channel('online-users', {
      config: { presence: { key: myUserId } }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        setOnlineUsers(channel.presenceState());
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => { channel.unsubscribe(); };
  }, [myUserId]);

  return onlineUsers;
};