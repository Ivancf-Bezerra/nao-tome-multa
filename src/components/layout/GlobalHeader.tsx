import React, { useMemo, useState } from 'react';

import HomeHeader from '../home/HomeHeader';
import NotificationsModal from '../home/NotificationsModal';
import { useStatusMultas } from '../../context/StatusMultasContext';

export default function GlobalHeader() {
  const { items, lastReadAt, unreadCount } = useStatusMultas();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadStatusItems = useMemo(() => {
    if (!lastReadAt || lastReadAt === '') return items;
    return items.filter((i) => i.updatedAt > lastReadAt);
  }, [items, lastReadAt]);

  return (
    <>
      <HomeHeader
        onOpenNotifications={() => setNotificationsOpen(true)}
        unreadStatusCount={unreadCount}
      />

      <NotificationsModal
        visible={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        unreadItems={unreadStatusItems}
      />
    </>
  );
}

