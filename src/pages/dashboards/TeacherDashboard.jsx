import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { filterForTeacher } from "../../utils/filters";

export default function TeacherDashboard({ setPage }) {
  const { currentUser } = useAuth();
  const { store } = useData();

  const materials = filterForTeacher(store.materials, currentUser);
  const assignments = filterForTeacher(store.assignments, currentUser);

  const submissions = store.submissions.filter((s) =>
    assignments.some((a) => a.id === s.assignmentId)
  );

  const menuItems = [
    {
      title: "Assignments",
      subtitle: "Create and publish assignments for students",
      page: "teacherAssignments",
      icon: "📝",
      value: assignments.length
    },
    {
      title: "Materials",
      subtitle: "Upload study materials and lecture files",
      page: "teacherMaterials",
      icon: "📚",
      value: materials.length
    },
    {
      title: "Submissions",
      subtitle: "View submitted assignments from students",
      page: "submissions",
      icon: "✅",
      value: submissions.length
    }
  ];

  return (
    <main className="page teacher-dashboard-simple">
      <section className="simple-hero">
        <div>
          <span className="badge">Teacher Dashboard</span>
          <h1>Welcome, {currentUser.name}</h1>
          <p>
            Manage assignments, study materials, and student submissions only.
          </p>
        </div>

        <button onClick={() => setPage("teacherAssignments")}>
          Give Assignment
        </button>
      </section>

      <section className="simple-grid teacher-only-grid">
        {menuItems.map((item, index) => (
          <div
            className="simple-card"
            key={item.title}
            onClick={() => setPage(item.page)}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="simple-icon">{item.icon}</div>

            <div className="simple-card-text">
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
            </div>

            <strong className="simple-count">{item.value}</strong>
          </div>
        ))}
      </section>
    </main>
  );
}