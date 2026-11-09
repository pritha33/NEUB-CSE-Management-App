import Card from "../../components/Card";
import { useData } from "../../context/DataContext";

export default function AdminUsers({ type }) {
  const { store } = useData();
  const users = store.users.filter((u) => u.role === type);

  return (
    <main className="page">
      <div className="page-head">
        <h1>{type === "student" ? "All Students" : "All Teachers"}</h1>
        <p>Admin can view all real registered {type} profiles.</p>
      </div>

      <section className="grid two">
        {users.map((u) => (
          <Card key={u.uid || u.id} title={u.name} subtitle={`${u.email}\n${u.studentId || u.teacherId || ""}\n${u.year || ""} ${u.semester || ""}`} />
        ))}
        {users.length === 0 && <Card title="No users found" subtitle={`No ${type} profile exists yet.`} />}
      </section>
    </main>
  );
}
