import Card from "../../components/Card";
import { useData } from "../../context/DataContext";
import { formatDate } from "../../utils/filters";

export default function StudentNotices() {
  const { store } = useData();

  const notices = store.notices || [];

  return (
    <main className="page">
      <div className="page-head">
        <h1>Notices</h1>
        <p>View official department notices and announcements.</p>
      </div>

      <section className="grid two">
        {notices.map((notice) => (
          <Card
            key={notice.id}
            title={notice.title}
            subtitle={`${notice.description}\n${formatDate(notice.createdAt)}`}
          />
        ))}

        {notices.length === 0 && (
          <Card
            title="No notices"
            subtitle="No official notice has been published yet."
          />
        )}
      </section>
    </main>
  );
}