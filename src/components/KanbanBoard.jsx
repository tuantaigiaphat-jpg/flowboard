import TaskCard from "./TaskCard";
import { COLUMNS, COL_COLORS } from "../data/initialData";

export default function KanbanBoard({ tasks, projects, onEditTask, onDeleteTask, onToggleTimer, onAddTask, onMoveTask }) {
  const getProj = (id) => projects.find((p) => p.id === id);

  return (
    <div className="kanban-grid">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.col === col);
        return (
          <div key={col} className="kanban-col">
            <div className="kanban-col-head">
              <div className="kanban-col-title">
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: COL_COLORS[col], display: "inline-block" }} />
                {col}
              </div>
              <span className="kanban-col-count">{colTasks.length}</span>
            </div>
            {colTasks.length === 0 && <div className="empty-col">Chưa có task</div>}
            {colTasks.map((t) => (
              <TaskCard key={t.id} task={t} project={getProj(t.proj)} onEdit={onEditTask} onDelete={onDeleteTask} onToggleTimer={onToggleTimer} onMove={onMoveTask} />
            ))}
            <button className="add-col-btn" onClick={() => onAddTask(col)}>
              <i className="ti ti-plus" style={{ fontSize: 13 }} aria-hidden="true" /> Thêm task
            </button>
          </div>
        );
      })}
    </div>
  );
}
