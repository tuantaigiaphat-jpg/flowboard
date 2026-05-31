import { useState, useCallback } from "react";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback(({ type = "info", title, message, duration = 5000 }) => {
    const id = "n" + Date.now() + Math.random();
    const notif = { id, type, title, message, createdAt: Date.now() };
    setNotifications((prev) => [notif, ...prev].slice(0, 8));
    if (duration > 0) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => setNotifications([]), []);

  return { notifications, addNotification, dismissNotification, clearAll };
}
