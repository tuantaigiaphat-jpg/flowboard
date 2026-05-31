const ICONS = {
  success: "ti-circle-check",
  info: "ti-info-circle",
  warning: "ti-alert-triangle",
  danger: "ti-alert-circle",
};

export default function NotificationCenter({ notifications, onDismiss }) {
  if (notifications.length === 0) return null;
  return (
    <div className="notif-center">
      {notifications.map((n) => (
        <div key={n.id} className={`notif-item notif-${n.type}`}>
          <div className="notif-icon">
            <i className={`ti ${ICONS[n.type] || "ti-bell"}`} aria-hidden="true" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="notif-title">{n.title}</div>
            {n.message && <div className="notif-msg">{n.message}</div>}
          </div>
          <button className="notif-close" onClick={() => onDismiss(n.id)} aria-label="Đóng thông báo">
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
