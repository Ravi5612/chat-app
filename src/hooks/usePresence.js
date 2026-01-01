// src/hooks/usePresence.js
import { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';

export const usePresence = (myUserId) => {
  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(() => {
    if (!myUserId) return;

    const channel = supabase.channel('online-users', {
      config: { presence: { key: myUserId } }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        console.log('🔄 Presence synced:', state);
        setOnlineUsers(state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('🟢 User joined:', key, newPresences);
        // Sync handles state update, but logging helps debug
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('🔴 User left:', key, leftPresences);
        // Sync handles state update
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Presence subscribed as:', myUserId);
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      console.log('🔌 Cleaning up presence...');
      channel.untrack().then(() => {
        console.log('👋 Untracked presence');
        channel.unsubscribe();
      });
    };
  }, [myUserId]);

  return onlineUsers;
};