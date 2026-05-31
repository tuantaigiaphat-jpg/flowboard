import { useState, useEffect, useRef } from "react";
import { formatTime } from "../hooks/useTimer";
import { COLUMNS, PRIORITY_LABELS } from "../data/initialData";
export default function TaskCard({ task, project, onEdit, onDelete, onToggleTimer, onMove }) {
  const [elapsed, setElapsed] = useState(task.time);
  const intervalRef = useRef(null);
  useEffect(() => {
    setElapsed(task.time);
    if (task.running) { intervalRef.current = setInterval(() => setElapsed((s) => s + 1), 1000); } else { clearInterval(intervalRef.current); }
    return () => clearInterval(intervalRef.current);
  }, [task.running, task.time]);
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.col !== "Hoàn thành";
  const tagBg = project ? project.color + "22" : "#eee";
  const priorityClass = { high: "priority-high", medium: "priority-medium", low: "priority-low" }[task.priority] || "";
  return (
    <div className="task-card">
      <div className="task-title">{task.title}</div>
      <div className="task-meta">
        {project && (<span className="tag" style={{ background: tagBg, color: project.color }}>{project.name}</span>)}
        {task.priority && (<span className={`priority-badge ${priorityClass}`}>{PRIORITY_LABELS[task.priority]}</span>)}
        {task.deadline && (<span style={{ fontSize: 11, color: isOverdue ? "#A32D2D" : "var(--text-3)", marginLeft: "auto", display: "flex", alignItems: "center", gap: 3 }}><i className={`ti ${isOverdue ? "ti-alarm" : "ti-calendar"}`} style={{ fontSize: 11 }} aria-hidden="true" />{new Date(task.deadline).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}</span>)}
      </div>
      {task.note && (<div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 5, lineHeight: 1.4 }}>{task.note}</div>)}
      <div className="pbar"><div className="pfill" style={{ width: `${task.progress}%`, background: project?.color || "#534AB7" }} /></div>
      <div className="task-actions">
        <button className={`timer-badge ${task.running ? "running" : "idle"}`} onClick={() => onToggleTimer(task.id)} title={task.running ? "Dừng bấm giờ" : "Bắt đầu bấm giờ"}><i className={`ti ${task.running ? "ti-player-stop" : "ti-player-play"}`} style={{ fontSize: 11 }} aria-hidden="true" />{formatTime(elapsed)}</button>
        <button className="icon-btn" onClick={() => onEdit(task)} title="Chỉnh sửa"><i className="ti ti-edit" aria-hidden="true" /></button>
        <select style={{ fontSize: 11, padding: "2px 5px", border: "0.5px solid var(--border)", borderRadius: 5, background: "var(--surface)", color: "var(--text-2)", cursor: "pointer", maxWidth: 90 }} value="" onChange={(e) => { if (e.target.value) onMove(task.id, e.target.value); }} title="Di chuyển sang cột khác"><option value="">Di chuyển...</option>{COLUMNS.filter((c) => c !== task.col).map((c) => (<option key={c} value={c}>{c}</option>))}</select>
        <button className="icon-btn danger" onClick={() => onDelete(task.id)} title="X0�a task" style={{ marginLeft: "auto" }}><i className="ti ti-trash" aria-hidden="true" /></button>
      </div>
    </div>
  );
}
