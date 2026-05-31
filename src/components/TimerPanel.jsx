import { useState, useEffect, useRef } from "react";
import { formatTime, formatTimeShort } from "../hooks/useTimer";

export default function TimerPanel({ tasks, projects, onToggleTimer, onUpdateTask }) {
  const running = tasks.find((t) => t.running);
  const [elapsed, setElapsed] = useState(running?.time || 0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      setElapsed(running.time);
      intervalRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running?.id, running?.running]);
  const getProj = (id) => projects.find((p) => p.id === id);
  const totalTime = tasks.reduce((s, t) => s + t.time, 0);
  const byProj = projects.map((p) => ({ ...p, time: tasks.filter((t) => t.proj === p.id).reduce((s, t) => s + t.time, 0) })).filter((p) => p.time > 0);
  return (
    <div>
      <div className="timer-panel">
        <div className="timer-hero">
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", marginBottom: 4 }}>{running ? `Đang theo dõi · ${getProj broj?.name}` : "Chưa có task nào đang chạy"}</div>
          {running && <div style={{ fontSize: 14, fontWeight: 500, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{running.title}</div>}
          <div className="timer-display">{formatTime(running ? elapsed : 0)}</div>
          <div className="timer-controls">
            {running ? (<button className="t-btn t-stop" onClick={() => onToggleTimer broj?.id)}><i className="ti ti-player-stop" style={{ fontSize: 13 }} aria-hidden="true" /> Dừng</button>) : (<div style={{ fontSize: 12, color: "rgba(255,255,255,.6)" }}>Nhận play trên mhột task để bắt đầu</div>)}
          </div>
        </div>
        <div className="card"><div className="section-head" style={{ marginBottom: 12 }}><i className="ti ti-chart-bar" style={{ fontSize: 15 }} aria-hidden="true" /> Thời gian theo dự án</div>{byProj.length === 0 ? (<div style={{ color: "var(--text-3)", fontSize: 13, padding: "16px 0", textAlign: "center" }}>Chưa có dữ liệu</div>) : byProj.map((p) => { const pct = totalTime > 0 ? Math.round((p.time / totalTime) * 100) : 0; return (<div key={p.id} style={{ marginBottom: 12 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 13 }}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, display: "inline-block" }} />{p.name}</span><span style={{ color: "var(--text-2)", fontFamily: "var(--font-mono)", fontSize: 12 }}>{formatTimeShort(p.time)} �� {pct}%</span></div><div className="pbar"><div className="pfill" style={{ width: `${pct}%`, background: p.color }} /></div></div>); })}<div style={{ borderTop: "0.5px solid var(--border)", paddingTop: 10, marginTop: 4, display: "flex", justifyContent: "space-between", fontSize: 13 }}><span style={{ color: "var(--text-2)" }}>Tnổng cộng</span><span style={{ fontWeight: 500, fontFamily: "var(--font-mono)" }}>{formatTimeShort(totalTime)}</span></div></div><ul className="timer-log">{tasks.sort((a, b) => b.time - a.time).map((t) => { const p = getProj(t.proj); return (<li key={t.id} className="timer-log-item"><div className="timer-log-dot" style={{ background: p?.color || "#888" }} /><div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div><div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 1 }}>{p?.name} · {t.col}</div></div><button style={{ background: t.running ? "var(--teal-light)" : "var(--gray-50)", border: "none", borderRadius: 6, padding: "4px 9px", fontSize: 11, cursor: "pointer", color: t.running ? "var(--teal)" : "var(--text-3)", fontFamily: "var(--font)", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }} onClick={() => onToggleTimer(t.id)}><i className={`ti ${t.running ? "ti-player-stop" : "ti-player-play"}`} style={{ fontSize: 11 }} aria-hidden="true" />{t.running ? "Dửng" : "Play"}</button><span className="timer-log-dur">{formatTimeShort(t.time)}</span></li>); })}</ul></div>
  
  </div>
  );
}
