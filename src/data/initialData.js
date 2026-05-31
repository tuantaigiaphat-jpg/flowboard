export const initialProjects = [
  { id: "p1", name: "App Di Động", color: "#534AB7" },
  { id: "p2", name: "Website CRM", color: "#0F6E56" },
  { id: "p3", name: "Báo cáo Q3", color: "#BA7517" },
  { id: "p4", name: "Tích hợp API", color: "#185FA5" },
];

const now = new Date();
const d = (offset) => {
  const dt = new Date(now);
  dt.setDate(dt.getDate() + offset);
  return dt.toISOString().split("T")[0];
};

export const initialTasks = [
  { id: "t1", title: "Thiết kế màn hình đăng nhập", proj: "p1", col: "Chờ xử lý", progress: 0, time: 0, running: false, priority: "medium", note: "Theo brand guideline mới", deadline: d(5), createdAt: new Date().toISOString() },
  { id: "t2", title: "Phân tích yêu cầu khách hàng", proj: "p2", col: "Chờ xử lý", progress: 0, time: 3600, running: false, priority: "low", note: "", deadline: d(7), createdAt: new Date().toISOString() },
  { id: "t3", title: "Xây dựng API xác thực JWT", proj: "p4", col: "Đang làm", progress: 65, time: 7200, running: false, priority: "high", note: "JWT + refresh token", deadline: d(1), createdAt: new Date().toISOString() },
  { id: "t4", title: "Viết báo cáo tài chính Q3", proj: "p3", col: "Đang làm", progress: 40, time: 5400, running: false, priority: "high", note: "", deadline: d(0), createdAt: new Date().toISOString() },
  { id: "t5", title: "UI Component library", proj: "p1", col: "Review", progress: 90, time: 10800, running: false, priority: "medium", note: "", deadline: d(2), createdAt: new Date().toISOString() },
  { id: "t6", title: "Tích hợp thanh toán Stripe", proj: "p2", col: "Review", progress: 85, time: 9000, running: false, priority: "medium", note: "Test sandbox trước", deadline: d(3), createdAt: new Date().toISOString() },
  { id: "t7", title: "Wireframe toàn bộ app", proj: "p1", col: "Hoàn thành", progress: 100, time: 14400, running: false, priority: "low", note: "", deadline: d(-5), createdAt: new Date().toISOString() },
  { id: "t8", title: "Database schema", proj: "p4", col: "Hoàn thành", progress: 100, time: 7800, running: false, priority: "low", note: "", deadline: d(-3), createdAt: new Date().toISOString() },
];

export const COLUMNS = ["Chờ xử lý", "Đang làm", "Review", "Hoàn thành"];
export const COL_COLORS = { "Chờ xử lý": "#888780", "Đang làm": "#185FA5", "Review": "#BA7517", "Hoàn thành": "#0F6E56" };
export const PRIORITY_LABELS = { high: "Gấp", medium: "Trung bình", low: "Thấp" };
