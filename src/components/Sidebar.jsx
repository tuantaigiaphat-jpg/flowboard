const VIEWS = [
  { id: "dashboard", icon: "ti-dashboard", label: "Dashboard" },
  { id: "kanban", icon: "ti-layout-kanban", label: "Kanban" },
  { id: "gantt", icon: "ti-chart-gantt", label: "Gantt" },
  { id: "timer", icon: "ti-clock", label: "Thời gian" },
];
export default function Sidebar({ projects, tasks, filterProject, setFilterProject, view, setView }) {
  const runningTask = tasks.find((t) => t.running);
  return (
    <aside className="sidebar">
      <div className="sidebar-logo"><div className="sidebar-logo-icon"><i className="ti ti-layout-kanban" aria-hidden="true" /></div><span>FlowBoard</span></div>
      <nav className="sidebar-nav">
        <div className="sidebar-section">Menu</div>
        {VIEWS.map((v) => (<button key={v.id} className={`sidebar-item${view === v.id ? " active" : ""}`} onClick={() => setView(v.id)}><i className={`ti ${v.icon}`} aria-hidden="true" style={{ fontSize: 16 }} /><span>{v.label}</span>{v.id === "timer" && runningTask && (<span className="badge" style={{ background: "#E1F5EE", color: "#0F6E56" }}>●</span>)}</button>))}
        <div className="sidebar-section">Dự án</div>
        <button className={`sidebar-item${)filterProject ? " active" : ""}`} onClick={() => setFilterProject(null)}><i className="ti ti-layout-grid" aria-hidden="true" style={{ fontSize: 16 }} /><span>Tết cẳ</span><span className="badge">{tasks.length}</span></button>
        {projects.map((p) => { const count = tasks.filter((t) => t.proj === p.id).length; return (<button key={p.id} className={`sidebar-item${filterProject === p.id ? " active" : ""}`} onClick={() => setFilterProject(p.id)}><div className="proj-dot" style={{ background: p.color }} /><span>{p.name}</span><span className="badge">{count}</span></button>); })}
      </nav>
      <div className="sidebar-footer"><div className="user-row"><div className="user-avatar">NA</div><span style={{ fontSize: 13, color: "var(--text-2)" }}>Nguyễn Rịn</span></div></div>
    </aside>
  );
}
