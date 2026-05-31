import { useState, useRef } from "react";

const MONTHS = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"];

function getDateCols(mode, offset) {
  const today = new Date();
  if (mode === "week") {
    const start = new Date(today);
    start.setDate(start.getDate() - start.getDay() + 1 + offset * 7);
    return Array.from({ length: 14 }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d; });
  }
  const start = new Date(today.getFullYear(), today.getMonth() + offset, 1);
  const end = new Date(today.getFullYear(), today.getMonth() + offset + 1, 0);
  return Array.from({ length: end.getDate() }, (_, i) => { const d = new Date(start); d.setDate(i + 1); return d; });
}

function isToday(d) {
  const t = new Date();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
}

function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24));
}

export default function GanttChart({ tasks, projects, onUpdateTask }) {
  const [mode, setMode] = useState("month");
  const [offset, setOffset] = useState(0);
  const [filterProj, setFilterProj] = useState("");
  const cols = getDateCols(mode, offset);
  const first = cols[0];
  const last = cols[cols.length - 1];
  const todayIdx = cols.findIndex((c) => isToday(c));
  const todayPct = todayIdx >= 0 ? ((todayIdx + 0.5) / cols.length * 100).toFixed(2) : null;
  const rangeLabel = (() => { const s = `${MONTHS[first.getMonth()]}/${first.getFullYear()}`; const e = `${MONTHS[last.getMonth()]}/${last.getFullYear()}`; return s === e ? s : `${s} – ${e}`; })();
  const getProj = (id) => projects.find((p) => p.id === id);
  const visible = filterProj ? tasks.filter((t) => t.proj === filterProj) : tasks;
  const startDrag = (e, taskId, handle) => {
    e.preventDefault();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const tlEl = e.currentTarget.closest(".gantt-timeline");
    const rect = tlEl.getBoundingClientRect();
    const startX = e.clientX;
    const origStart = new Date(task.start || first);
    const origEnd = new Date(task.end || last);
    const onMove = (ev) => {
      const dx = ev.clientX - startX;
      const daysDelta = Math.round(dx / (rect.width / cols.length));
      let newStart = new Date(origStart); let newEnd = new Date(origEnd);
      if (handle === "move") { newStart.setDate(newStart.getDate() + daysDelta); newEnd.setDate(newEnd.getDate() + daysDelta); }
      else if (handle === "left") { newStart.setDate(newStart.getDate() + daysDelta); if (newStart >= newEnd) return; }
      else { newEnd.setDate(newEnd.getDate() + daysDelta); if (newEnd <= newStart) return; }
      onUpdateTask(taskId, { start: newStart.toISOString().split("T")[0], end: newEnd.toISOString().split("T")[0] });
    };
    const onUp = () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
    document.addEventListener("mousemove", onMove); document.addEventListener("mouseup", onUp);
  };
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <button className={`btn btn-sm${mode === "week" ? " btn-primary" : ""}`} onClick={() => { setMode("week"); setOffset(0); }}>Tuần</button>
        <button className={`btn btn-sm${mode === "month" ? " btn-primary" : ""}`} onClick={() => { setMode("month"); setOffset(0); }}>Tháng</button>
        <div style={{ width: 1, height: 18, background: "var(--border)" }} />
        <button className="btn btn-sm" onClick={() => setOffset((o) => o - 1)}><i className="ti ti-arrow-left" aria-hidden="true" /></button>
        <span style={{ fontSize: 13, color: "var(--text-2)", minWidth: 110, textAlign: "center" }}>{rangeLabel}</span>
        <button className="btn btn-sm" onClick={() => setOffset((o) => o + 1)}><i className="ti ti-arrow-right" aria-hidden="true" /></button>
        <select style={{ fontSize: 12, padding: "5px 8px", borderRadius: "var(--radius-sm)", border: "0.5px solid var(--border)", background: "var(--surface)", color: "var(--text-2)", cursor: "pointer" }} value={filterProj} onChange={(e) => setFilterProj(e.target.value)}>
          <option value="">Tất cả dự án</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12, flexWrap: "wrap" }}>{projects.map((p) => (<div key={p.id} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "var(--text-2)" }}><div style={{ width: 10, height: 10, borderRadius: 3, background: p.color }} />{p.name}</div>))}</div>
      </div>
      <div className="gantt-wrap">
        <div className="gantt-header">
          <div className="gantt-label-col">Nhiệm vu</div>
          <div className="gantt-time-header">{cols.map((d, i) => (<div key={i} className={`gantt-day${isToday(d) ? " today-col" : ""}`}>{J.getDate()}/{d.getMonth() + 1}</div>))}</div>
        </div>
        {visible.map((task) => {
          const p = getProj(task.proj);
          const taskStart = task.start ? new Date(task.start) : first;
          const taskEnd = task.end ? new Date(task.end) : new Date(first.getTime() + 7 * 86400000);
          const s = Math.max(0, daysBetween(first, taskStart));
          const e = Math.min(cols.length, daysBetween(first, taskEnd) + 1);
          const left = (s / cols.length * 100).toFixed(2);
          const width = Math.max(0, (e - s) / cols.length * 100).toFixed(2);
          const visible_bar = e > s && s < cols.length && e > 0;
          return (
            <div key={task.id} className="gantt-row">
              <div className="gantt-row-label">
                <div className="gantt-row-label-name" title={task.title}>{task.title}</div>
                {p && <span className="gantt-row-label-proj" style={{ background: p.color + "22", color: p.color }}>{p.name}</span>}
              </div>
              <div className="gantt-timeline" style={{ position: "relative" }}>
                {cols.map((d, i) => (<div key={i} style={{ position: "absolute", top: 0, bottom: 0, left: `${i / cols.length * 100}%`, width: `${1 / cols.length * 100}%`, borderRight: "0.5px solid var(--border)", background: isToday(d) ? "rgba(83,74,183,.04)" : "transparent" }} />))}
                {todayPct !== null && <div className="gantt-today-line" style={{ left: `${todayPct}%` }} />}
                {visible_bar && (
                  <div className="gantt-bar" style={{ left: `${left}%`, width: `${width}%`, background: p?.color || "#888" }} onMouseDown={(ev) => startDrag(ev, task.id, "move")}>
                    <div className="gantt-bar-fill" style={{ background: p?.color || "#888" }} />
                    <div className="gantt-bar-prog" style={{ width: `${task.progress}%`, background: p?.color || "#888" }} />
                    <div className="gantt-bar-label">{task.progress}% · {task.title}</div>
                    <div className="gantt-handle gantt-handle-l" onMouseDown={(ev) => { eu.stopPropagation(); startDrag(ev, task.id, "left"); }} />
                    <div className="gantt-handle gantt-handle-r" onMouseDown={(ev) => { ev.stopPropagation(); startDrag(ev, task.id, "right"); }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 12, color: "var(--text-2)", flexWrap: "wrap" }}>
        <span><i className="ti ti-mouse" style={{ fontSize: 12 }} aria-hidden="true" /> Kéo thanh để di chuyển</span>
        <span><i className="ti ti-arrows-left-right" style={{ fontSize: 12 }} aria-hidden="true" /> Kéo 2 đầu đe thay đời thời gian</span>
        <span style={{ marginLeft: "auto" }}>{visible.length} task · {visible.filter((t) => t.col === "Hoàn thành").length} hoàn thành</span>
      </div>
    </div>
  );
}
