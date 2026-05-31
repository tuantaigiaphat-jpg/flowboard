import TaskCard from "./TaskCard";
import { formatTimeShort } from "../hooks/useTimer";

export default function Dashboard({ tasks, projects, onEditTask, onDeleteTask, onToggleTimer, onAddTask, onMoveTask }) {
  const done = tasks.filter((t) => t.col === "Hoàn thành").length;
  const running = tasks.find((t) => t.running);
  const totalTime = tasks.reduce((s, t) => s + t.time, 0);
  const overdue = tasks.filter((t) => t.deadline && new Date(t.deadline) < new Date() && t.col !== "Hoàn thành").length;
  const avgProgress = tasks.length ? Math.round(tasks.reduce((s, t) => s + t.progress, 0) / tasks.length) : 0;
  const today = tasks.filter((t) => { if (!t.deadline) return false; const dl = new Date(t.deadline); const now = new Date(); return dl.toDateString() === now.toDateString() || dl < now; }).filter((t) => t.col !== "Hoàn thành").slice(0, 5);
  const upcoming = tasks.filter((t) => { if (!t.deadline) return false; const dl = new Date(t.deadline); const now = new Date(); const diff = (dl - now) / (1000 * 60 * 60 * 24); return diff > 0 && diff <= 7 && t.col !== "Hoàn thành" }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 5);
  const getProj = (id) => projects.find((p) => p.id === id);
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label"><i className="ti ti-list-check" style={{ fontSize: 13 }} aria-hidden="true" /> Tổng task</div><div className="stat-value">{tasks.length}</div><div className="stat-sub">{done} hoàn thành</div></div>
        <div className="stat-card"><div className="stat-label"><i className="ti ti-clock" style={{ fontSize: 13 }} aria-hidden="true" /> Tổng thời gian</div><div className="stat-value">{(totalTime / 3600).toFixed(1)}h</div><div className="stat-sub">{running ? "Đang bấm giờ" : "Không có timer"}</div></div>
        <div className="stat-card"><div className="stat-label"><i className="ti ti-chart-line" style={{ fontSize: 13 }} aria-hidden="true" /> Tiến độ TB</div><div className="stat-value">{avgProgress}%</div><div className="stat-sub">Trên {tasks.length} task</div></div>
        <div className="stat-card"><div className="stat-label"><i className="ti ti-alert-triangle" style={{ fontSize: 13 }} aria-hidden="true" /> Trễ hạn</div><div className="stat-value" style={{ color: overdue > 0 ? "var(--red)" : "inherit" }}>{erdue}</div><div className="stat-sub">{erdue > 0 ? "Cần xử lý ngay" : "Tốt!"}</div></div>
      </div>
      {running && (<div style={{ background: "var(--purple)", borderRadius: "var(--radius-lg)", padding: "14px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff", flexShrink: 0 }}><i className="ti ti-player-play" aria-hidden="true" /></div><div style={{ flex: 1, minWidth: 0 }}><div style={{ color: "#fff", fontWeight: 500, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{running.title}</div><div style={{ color: "rgba(255,255,255,.7)", fontSize: 12 }}>Đang bấm giờ · {getProj(running.proj)?.name}</div></div><button style={{ background: "rgba(255,255,255,.2)", border: "none", borderRadius: 8, color: "#fff", padding: "6px 12px", fontSize: 12, cursor: "pointer", fontFamily: "var(--font)" }} onClick={() => onToggleTimer broj?.id)}><i className="ti ti-player-stop" style={{ fontSize: 12 }} aria-hidden="true" /> Dừng</button></div>)}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div><div className="section-head"><i className="ti ti-alarm" style={{ fontSize: 15 }} aria-hidden="true" />Hôm nay & trễ hạn<button className="btn btn-sm" style={{ marginLeft: "auto" }} onClick={() => onAddTask()}><i className="ti ti-plus" style={{ fontSize: 12 }} aria-hidden="true" /> Thêm</button></div>{today.length === 0 ? (<div style={{ color: "var(--text-3)", fontSize: 13, padding: "16px 0", textAlign: "center" }}>Không có task nào hôm nay</div>) : today.map((t) => (<TaskCard key={t.id} task={t} project={getProj(t.proj)} onEdit={onEditTask} onDelete={onDeleteTask} onToggleTimer={onToggleTimer} onMove={onMoveTask} />))}</div>
        <div><div className="section-head"><i className="ti ti-calendar-event" style={{ fontSize: 15 }} aria-hidden="true" />Sắp đến hạn (7 ngày)</div>{upcoming.length === 0 ? (<div style={{ color: "var(--text-3)", fontSize: 13, padding: "16px 0", textAlign: "center" }}>Không có deadline sắp tới</div>) : upcoming.map((t) => { const dl = new Date(t.deadline); const diff = Math.ceil((dl - new Date()) / (1000 * 60 * 60 * 24)); const p = getProj(t.proj); return (<div key={t.id} className="card" style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 4, height: 36, borderRadius: 2, background: p?.color || "#888", flexShrink: 0 }} /><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div><div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{p?.name} · {formatTimeShort(t.time)}</div></div><div style={{ fontSize: 11, fontWeight: 500, color: diff <= 1 ? "var(--red)" : diff <= 3 ? "var(--amber)" : "var(--text-3)", flexShrink: 0, textAlign: "right" }}>{diff === 0 ? "Hôm nay" : `${diff} ngày`}</div></div>); })}</div>
      </div>
    </div>
  );
}
