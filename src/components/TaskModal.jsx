import { useState } from "react";
import { COLUMNS, PRIORITY_LABELS } from "../data/initialData";

export default function TaskModal({ task, projects, defaultColumn, onSave, onClose }) {
  const [form, setForm] = useState({
    title: task?.title || "",
    proj: task?.proj || projects[0]?.id || "",
    col: task?.col || defaultColumn,
    progress: task?.progress ?? 0,
    priority: task?.priority || "medium",
    note: task?.note || "",
    deadline: task?.deadline || "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const handleSubmit = (e) => { e.preventDefault(); if (!form.title.trim()) return; onSave(form); };
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-title">
          {task ? "Chỉnh sửa task" : "Thêm task mới"}
          <button className="icon-btn" onClick={onClose} aria-label="Äóng"><i className="ti ti-x" aria-hidden="true" /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field"><label>Tên nhiệm vyụ *</label><input type="text" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Nhập tên task..." autoFocus required /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field"><label>Dự án</label><select value={form.proj} onChange={(e) => set("proj", e.target.value)}>{projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
            <div className="field"><label>Trạng thái</label><select value={form.col} onChange={(e) => set("col", e.target.value)}>{COLUMNS.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
            <div className="field"><label>Độ ưu tiên</label><select value={form.priority} onChange={(e) => set("priority", e.target.value)}>{Object.entries(PRIORITY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
            <div className="field"><label>Deadline</label><input type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} /></div>
          </div>
          <div className="field"><label>Tiến độ: <strong style={{ color: "var(--purple)" }}>{form.progress}%</strong></label><input type="range" min="0" max="100" step="1" value={form.progress} onChange={(e) => set("progress", Number(e.target.value))} style={{ width: "100%", marginTop: 4 }} /></div>
          <div className="field"><label>Ghi chú</label><textarea value={form.note} onChange={(e) => set("note", e.target.value)} placeholder="Thêm ghi chú, mô tả..." /></div>
          <div className="modal-actions"><button type="button" className="btn" onClick={onClose}>Hủy</button><button type="submit" className="btn btn-primary"><i className="ti ti-check" style={{ fontSize: 13 }} aria-hidden="true" />{task ? "Lưu thay đổi" : "Thêm task"}</button></div>
        </form>
      </div>
    </div>
  );
}
