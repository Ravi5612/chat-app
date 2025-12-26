import { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { supabase } from '../supabaseClient'; 

export default function MainLayout({ children }) {
  const [onlineUsers, setOnlineUsers] = useState({});
  const [myId, setMyId] = useState(null);

  useEffect(() => {
    // 1. Current User ki ID nikaalna
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setMyId(data.session.user.id);
      }
    };
    getSession();

    if (!myId) return;

    // 2. Presence Channel setup
    const channel = supabase.channel('global-presence', {
      config: { presence: { key: myId } }
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        // Sabhi online users ki list update karna
        const state = channel.presenceState();
        setOnlineUsers(state);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Khud ko "Online" track karwana
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [myId]);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar ko onlineUsers pass kar rahe hain */}
        <Sidebar onlineUsers={onlineUsers} /> 
        
        {/* Children (Chat Page) ko bhi access milega agar zaroorat ho */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}