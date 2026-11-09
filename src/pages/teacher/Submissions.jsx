import Card from "../../components/Card";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { filterForTeacher } from "../../utils/filters";

export default function Submissions() {
  const { currentUser } = useAuth();
  const { store } = useData();
  const myAssignments = filterForTeacher(store.assignments, currentUser);
  const submissions = store.submissions.filter((s) => myAssignments.some((a) => a.id === s.assignmentId));

  return (
    <main className="page">
      <div className="page-head">
        <h1>Student Submissions</h1>
        <p>Teacher can see submissions only for own assignments.</p>
      </div>

      <section className="grid two">
        {submissions.map((s) => (
          <Card key={s.id} title={s.assignmentTitle} subtitle={`Student: ${s.studentName}\nStatus: ${s.status}\nLink: ${s.fileLink}\nNote: ${s.note || "No note"}`} />
        ))}
        {submissions.length === 0 && <Card title="No submissions" subtitle="No submission found for your assignments." />}
      </section>
    </main>
  );
}
