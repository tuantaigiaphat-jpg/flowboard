import { useEffect, useRef } from "react";

export default function ReminderEngine({ tasks, addNotification }) {
  const firedRef = useRef(new Set());
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") { Notification.requestPermission(); }
  }, []);
  useEffect(() => {
    const check = () => {
      const now = new Date();
      tasks.forEach((task) => {
        if (!task.deadline || task.col === "Hoàn thành") return;
        const deadline = new Date(task.deadline);
        deadline.setHours(23, 59, 59);
        const diffMs = deadline - now;
        const diffH = diffMs / (1000 * 60 * 60);
        const key24 = `${task.id}_24h`;
        const key2 = `${task.id}_2h`;
        const keyOverdue = `${task.id}_overdue`;
        if (diffMs < 0 && !firedRef.current.has(keyOverdue)) {
          firedRef.current.add(keyOverdue);
          addNotification({ type: "danger", title: "Task trễ hạn!", message: `"${task.title}" đã quá deadline`, duration: 0 });
        } else if (diffH <= 2 && diffH > 0 && !firedRef.current.has(key2)) {
          firedRef.current.add(key2);
          addNotification({ type: "warning", title: "Còn 2 giờ!", message: `"${task.title}" sắp đến hạn`, duration: 8000 });
        } else if (diffH <= 24 && diffH > 2 && !firedRef.current.has(key24)) {
          firedRef.current.add(key24);
          addNotification({ type: "warning", title: "Nhắc nhở deadline", message: `"${task.title}" sẽ hết hạn hôm nay`, duration: 6000 });
        }
      });
    };
    check();
    const interval = setInterval(check, 60 * 1000);
    return () => clearInterval(interval);
  }, [tasks, addNotification]);
  return null;
}
