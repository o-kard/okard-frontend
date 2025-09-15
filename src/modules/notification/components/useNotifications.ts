import { useEffect, useMemo, useRef, useState } from "react";
import type { Notification } from "../types/notification";
import { listNotifications, deleteNotification } from "../api/api";

type Opts = { userId?: string; pollMs?: number };

export function useNotifications(opts: Opts = {}) {
  const { userId, pollMs = 15000 } = opts;
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const fetchNow = async () => {
    try {
      setLoading(true);
      const data = await listNotifications(userId);
      setItems(data);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const removeOne = async (id: string) => {
    await deleteNotification(id);
    setItems((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    fetchNow();
    if (pollMs > 0) {
      timer.current = window.setInterval(fetchNow, pollMs);
      return () => {
        if (timer.current) window.clearInterval(timer.current);
      };
    }
  }, [userId, pollMs]);

  const unreadCount = useMemo(() => items.length, [items]);

  return { items, loading, error, unreadCount, refetch: fetchNow, removeOne };
}
