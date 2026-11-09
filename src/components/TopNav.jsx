import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function TopNav({ page, setPage }) {
  const { currentUser, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const go = (next) => {
    setPage(next);
    setOpen(false);
  };

  const publicLinks = [
  ["home", "Home"],
  ["login", "Login"],
  ["registerRole", "Register"],
  ["forgot", "Recover Password"]
];

  const studentLinks = [
    ["studentDashboard", "Dashboard"],
    ["profile", "Profile"],
    ["notices", "Notices"],
    ["routine", "Class Routine"],
    ["materials", "Study Materials"],
    ["studentAssignments", "Assignments"],
    ["payments", "Payment Status"],

  ];

  const teacherLinks = [
    ["teacherDashboard", "Dashboard"],
    ["profile", "Profile"],
   
    ["teacherMaterials", "Study Materials"],
    ["teacherAssignments", "Assignments"],
    ["submissions", "Submissions"],
   
  ];

  const adminLinks = [
    ["adminDashboard", "Dashboard"],
    ["profile", "Profile"],
    ["adminNotices", "Manage Notices"],
    ["adminRoutine", "Manage Routine"],
    ["adminPayments", "Manage Payments"],
    ["adminStudents", "Students"],
    ["adminTeachers", "Teachers"],
  
  ];

  let links = publicLinks;
  if (currentUser?.role === "student") links = studentLinks;
  if (currentUser?.role === "teacher") links = teacherLinks;
  if (currentUser?.role === "admin") links = adminLinks;

  const dashboardPage = currentUser ? `${currentUser.role}Dashboard` : "home";

  return (
    <>
      <header className="top-nav">
        <button className="brand" onClick={() => go(dashboardPage)}>
          <span className="logo-dot">🎓</span>
          <span>NEUB CSE</span>
        </button>

        <button className="menu-btn always" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={24} />
        </button>
      </header>

      {open && <button className="drawer-backdrop" onClick={() => setOpen(false)} aria-label="Close menu" />}

      <aside className={open ? "side-drawer open" : "side-drawer"}>
        <div className="drawer-head">
          <div>
            <strong>NEUB CSE</strong>
            <small>{currentUser ? `${currentUser.name} • ${currentUser.role}` : "Academic Portal"}</small>
          </div>
          <button className="drawer-close" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        <nav className="drawer-links">
          {links.map(([key, label]) => (
            <button key={key} className={page === key ? "active" : ""} onClick={() => go(key)}>
              {label}
            </button>
          ))}

          {currentUser && (
            <button className="logout-link" onClick={logout}>
              <LogOut size={16} /> Logout
            </button>
          )}
        </nav>
      </aside>
    </>
  );
}
