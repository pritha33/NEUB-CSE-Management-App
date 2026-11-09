import Card from "../../components/Card";
import MetricCard from "../../components/MetricCard";
import { useData } from "../../context/DataContext";
import { moneyTotal } from "../../utils/filters";

export default function AdminDashboard({ setPage }) {
  const { store } = useData();

  const payments = store.payments || [];
  const users = store.users || [];

  const paid = payments.filter((p) => p.status === "Paid");
  const unpaid = payments.filter((p) => p.status !== "Paid");
  const students = users.filter((u) => u.role === "student");
  const teachers = users.filter((u) => u.role === "teacher");

  return (
    <main className="page admin-simple">
      <section className="admin-simple-head">
        <div>
          <span className="badge">Admin Dashboard</span>
          <h1>Admin Control Center</h1>
          <p>Manage notices, routines, payments, students and teachers.</p>
        </div>

       
      </section>

      <section className="metrics">
        <MetricCard title="Students" value={students.length} />
        <MetricCard title="Teachers" value={teachers.length} />
        <MetricCard title="Total Paid" value={moneyTotal(paid)} />
        <MetricCard title="Unpaid" value={unpaid.length} />
      </section>

      <section className="grid two">
        <Card
          title="Manage Notices"
          subtitle="Create and delete notices."
          onClick={() => setPage("adminNotices")}
        />

        <Card
          title="Manage Routine"
          subtitle="Create class routines."
          onClick={() => setPage("adminRoutine")}
        />

        <Card
          title="Payments"
          subtitle="View paid and unpaid list."
          onClick={() => setPage("adminPayments")}
        />

        <Card
          title="Students"
          subtitle="View all students."
          onClick={() => setPage("adminStudents")}
        />

        <Card
          title="Teachers"
          subtitle="View all teachers."
          onClick={() => setPage("adminTeachers")}
        />

       
      </section>
    </main>
  );
}