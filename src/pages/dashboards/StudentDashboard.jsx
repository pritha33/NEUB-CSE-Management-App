import {
  Bell,
  CalendarDays,
  BookOpen,
  ClipboardList,
  CreditCard,
  Activity
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import {
  filterForStudent,
  filterOwnStudentRecords
} from "../../utils/filters";

export default function StudentDashboard({ setPage }) {
  const { currentUser } = useAuth();
  const { store } = useData();

  const notices = filterForStudent(store.notices, currentUser);
  const routines = filterForStudent(store.routines, currentUser);
  const materials = filterForStudent(store.materials, currentUser);
  const assignments = filterForStudent(store.assignments, currentUser);
  const payments = filterOwnStudentRecords(store.payments, currentUser);

  const cards = [
    {
      title: "Notices",
      count: notices.length,
      icon: <Bell size={24} />,
      page: "notices"
    },
    {
      title: "Class Routine",
      count: routines.length,
      icon: <CalendarDays size={24} />,
      page: "routine"
    },
    {
      title: "Materials",
      count: materials.length,
      icon: <BookOpen size={24} />,
      page: "materials"
    },
    {
      title: "Assignments",
      count: assignments.length,
      icon: <ClipboardList size={24} />,
      page: "studentAssignments"
    },
    {
      title: "Payment Status",
      count: payments.length,
      icon: <CreditCard size={24} />,
      page: "payments"
    },
    {
      title: "My Activity",
      count: "",
      icon: <Activity size={24} />,
      page: "myActivity"
    }
  ];

  return (
    <main className="page student-dashboard-clean">
      <section className="student-clean-header">
        <div>
          <span>Student Dashboard</span>
          <h1>Hello, {currentUser.name}</h1>
          <p>{currentUser.year}</p>
          <p>{currentUser.semester}</p>
        </div>
      </section>

      <section className="student-clean-grid">
        {cards.map((item, index) => (
          <button
            key={item.title}
            className="student-clean-card"
            onClick={() => setPage(item.page)}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="student-clean-icon">{item.icon}</div>

            <div className="student-clean-info">
              <h3>{item.title}</h3>
              {item.count !== "" && <p>{item.count} records</p>}
              {item.count === "" && <p>View details</p>}
            </div>
          </button>
        ))}
      </section>
    </main>
  );
}