import Card from "../components/Card";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { formatDate } from "../utils/filters";

export default function Activity({ all = false }) {
  const { currentUser } = useAuth();
  const { store } = useData();

  const list = all
    ? store.activities
    : store.activities.filter((a) => a.userUid === currentUser.uid || a.role === currentUser.role);

  return (
    <main className="page">
      <div className="page-head">
        <h1>{all ? "All Activities" : "My Activity"}</h1>
        <p>{all ? "Admin can view all activity." : "Activity based on the logged-in user."}</p>
      </div>

      <section className="grid two">
        {list.map((a) => (
          <Card key={a.id} title={a.title} subtitle={`${a.description}\n${formatDate(a.createdAt)}`} />
        ))}
        {list.length === 0 && <Card title="No activity" subtitle="No activity found yet." />}
      </section>
    </main>
  );
}
