import { useState, useEffect, useCallback } from "react";
import Dashboard from "./components/Dashboard";
import KanbanBoard from "./components/KanbanBoard";
import GanttChart from "./components/GanttChart";
import TimerPanel from "./components/TimerPanel";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import TaskModal from "./components/TaskModal";
import NotificationCenter from "./components/NotificationCenter";
import ReminderEngine from "./components/ReminderEngine";
import { initialTasks, initialProjects } from "./data/initialData";
import { useNotifications } from "./hooks/useNotifications";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("flowboard_tasks");
    return saved ? JSON.parse(saved) : initialTasks;
  });
  const [projects] = useState(initialProjects);
  const [view, setView] = useState("dashboard");
  const [filterProject, setFilterProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultColumn, setDefaultColumn] = useState("Chờ xử lý");

  const { notifications, addNotification, dismissNotification, clearAll } =
    useNotifications();

  useEffect(() => {
    localStorage.setItem("flowboard_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((taskData) => {
    const newTask = {
      id: "t" + Date.now(),
      time: 0,
      running: false,
      createdAt: new Date().toISOString(),
      ...taskData,
    };
    setTasks((prev) => [...prev, newTask]);
    addNotification({
      type: "success",
      title: "Task đã được thêm",
      message: `"${newTask.title}" đã được tạo trong ${newTask.col}`,
    });
  }, [addNotification]);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTask = useCallback((id) => {
    const task = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    addNotification({
      type: "info",
      title: "Task đã xóa",
      message: `"${task?.title}" đã được xóa`,
    });
  }, [tasks, addNotification]);

  const toggleTimer = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) return { ...t, running: !t.running };
        if (t.running) return { ...t, running: false };
        return t;
      })
    );
  }, []);

  const openAddModal = useCallback((col = "Chờ xử lý") => {
    setEditingTask(null);
    setDefaultColumn(col);
    setModalOpen(true);
  }, []);

  const openEditModal = useCallback((task) => {
    setEditingTask(task);
    setModalOpen(true);
  }, []);

  const visibleTasks = filterProject
    ? tasks.filter((t) => t.proj === filterProject)
    : tasks;

  return (
    <div className="app-root">
      <ReminderEngine tasks={tasks} addNotification={addNotification} />
      <Sidebar
        projects={projects}
        tasks={tasks}
        filterProject={filterProject}
        setFilterProject={setFilterProject}
        view={view}
        setView={setView}
      />
      <div className="main-area">
        <Topbar
          view={view}
          filterProject={filterProject}
          projects={projects}
          onAddTask={() => openAddModal()}
          notifications={notifications}
          dismissNotification={dismissNotification}
          clearAll={clearAll}
        />
        <div className="content-area">
          {view === "dashboard" && (
            <Dashboard
              tasks={visibleTasks}
              projects={projects}
              onEditTask={openEditModal}
              onDeleteTask={deleteTask}
              onToggleTimer={toggleTimer}
              onAddTask={openAddModal}
              onMoveTask={(id, col) => updateTask(id, { col })}
            />
          )}
          {view === "kanban" && (
            <KanbanBoard
              tasks={visibleTasks}
              projects={projects}
              onEditTask={openEditModal}
              onDeleteTask={deleteTask}
              onToggleTimer={toggleTimer}
              onAddTask={openAddModal}
              onMoveTask={(id, col) => updateTask(id, { col })}
            />
          )}
          {view === "gantt" && (
            <GanttChart
              tasks={visibleTasks}
              projects={projects}
              onUpdateTask={updateTask}
            />
          )}
          {view === "timer" && (
            <TimerPanel
              tasks={tasks}
              projects={projects}
              onToggleTimer={toggleTimer}
              onUpdateTask={updateTask}
            />
          )}
        </div>
      </div>
      {modalOpen && (
        <TaskModal
          task={editingTask}
          projects={projects}
          defaultColumn={defaultColumn}
          onSave={(data) => {
            if (editingTask) updateTask(editingTask.id, data);
            else addTask(data);
            setModalOpen(false);
          }}
          onClose={() => setModalOpen(false)}
        />
      )}
      <NotificationCenter
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </div>
  );
}
