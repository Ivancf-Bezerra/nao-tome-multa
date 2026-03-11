import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useUser } from '@clerk/clerk-expo';
import {
  loadStatusMultas,
  getLastReadStatusAt,
  setLastReadStatusAt,
  updateStatusMulta,
  deleteStatusMulta,
} from '../storage/statusStorage';
import type { StatusMultaEnviada } from '../data/status/types';

type StatusUpdate = Partial<Pick<StatusMultaEnviada, 'status' | 'lastMessage' | 'recursoJARI'>>;

interface StatusMultasContextData {
  items: StatusMultaEnviada[];
  lastReadAt: string | null;
  unreadCount: number;
  isLoaded: boolean;
  refresh: () => Promise<void>;
  markAsRead: () => Promise<void>;
  updateStatus: (id: string, update: StatusUpdate) => Promise<void>;
  deleteStatus: (id: string) => Promise<void>;
}

const StatusMultasContext = createContext<StatusMultasContextData | undefined>(
  undefined,
);

export function StatusMultasProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [items, setItems] = useState<StatusMultaEnviada[]>([]);
  const [lastReadAt, setLastReadAtState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setItems([]);
      setLastReadAtState(null);
      setIsLoaded(true);
      return;
    }
    try {
      const [loadedItems, readAt] = await Promise.all([
        loadStatusMultas(user.id),
        getLastReadStatusAt(user.id),
      ]);
      setItems(loadedItems);
      setLastReadAtState(readAt);
    } catch {
      setItems([]);
      setLastReadAtState(null);
    } finally {
      setIsLoaded(true);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!isUserLoaded) return;
    refresh();
  }, [isUserLoaded, refresh]);

  const markAsRead = useCallback(async () => {
    const now = new Date().toISOString();
    setLastReadAtState(now);
    if (user?.id) await setLastReadStatusAt(user.id, now);
  }, [user?.id]);

  const updateStatus = useCallback(
    async (id: string, update: StatusUpdate) => {
      if (!user?.id) return;
      await updateStatusMulta(user.id, id, update);
      await refresh();
    },
    [user?.id, refresh],
  );

  const deleteStatus = useCallback(
    async (id: string) => {
      if (!user?.id) return;
      await deleteStatusMulta(user.id, id);
      await refresh();
    },
    [user?.id, refresh],
  );

  const unreadCount =
    !lastReadAt || lastReadAt === ''
      ? items.length
      : items.filter((i) => i.updatedAt > lastReadAt).length;

  return (
    <StatusMultasContext.Provider
      value={{
        items,
        lastReadAt,
        unreadCount,
        isLoaded,
        refresh,
        markAsRead,
        updateStatus,
        deleteStatus,
      }}
    >
      {children}
    </StatusMultasContext.Provider>
  );
}

export function useStatusMultas(): StatusMultasContextData {
  const ctx = useContext(StatusMultasContext);
  if (!ctx) {
    throw new Error('useStatusMultas must be used within StatusMultasProvider');
  }
  return ctx;
}
