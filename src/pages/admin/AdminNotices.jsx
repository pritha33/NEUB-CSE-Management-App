import { useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { useData } from "../../context/DataContext";

const years = ["All", "1st Year", "2nd Year", "3rd Year", "4th Year"];

const semesters = [
  "All",
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester"
];

const emptyForm = {
  title: "",
  description: "",
  year: "All",
  semester: "All"
};

export default function AdminNotices() {
  const { store, addItem, updateItem, deleteItem, addActivity } = useData();

  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const notices = store.notices || [];

  const set = (key, val) => {
    setForm((previous) => ({
      ...previous,
      [key]: val
    }));
  };

  function startEdit(notice) {
    setEditId(notice.id);

    setForm({
      title: notice.title || "",
      description: notice.description || "",
      year: notice.year || "All",
      semester: notice.semester || "All"
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function cancelEdit() {
    setEditId(null);
    setForm(emptyForm);
  }

  async function submit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      if (editId) {
        await updateItem("notices", editId, form);

        await addActivity(
          "Notice updated",
          `Admin updated notice: ${form.title}`,
          "admin"
        );
      } else {
        await addItem("notices", form);

        await addActivity(
          "Notice created",
          `Admin created notice: ${form.title}`,
          "admin"
        );
      }

      setForm(emptyForm);
      setEditId(null);
    } catch (error) {
      console.error("Notice save error:", error);
      alert(error.message || "Failed to save notice.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(notice) {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${notice.title}"?`
    );

    if (!confirmDelete) return;

    try {
      await deleteItem("notices", notice.id);

      await addActivity(
        "Notice deleted",
        `Admin deleted notice: ${notice.title}`,
        "admin"
      );
    } catch (error) {
      console.error("Notice delete error:", error);
      alert(error.message || "Failed to delete notice.");
    }
  }

  return (
    <main className="page">
      <div className="page-head">
       
        <h1>Manage Notices</h1>
        <p>Admin can add, edit, and delete notices.</p>
      </div>

      <Card title={editId ? "Edit Notice" : "Create Notice"}>
        <form className="form" onSubmit={submit}>
          <Input
            label="Notice Title"
            value={form.title}
            onChange={(v) => set("title", v)}
            placeholder="Example: Midterm Exam Notice"
            required
          />

          <Input
            label="Description"
            value={form.description}
            onChange={(v) => set("description", v)}
            placeholder="Write notice details"
            textarea
            required
          />

          <Select
            label="Year"
            value={form.year}
            onChange={(v) => set("year", v)}
            options={years}
          />

          <Select
            label="Semester"
            value={form.semester}
            onChange={(v) => set("semester", v)}
            options={semesters}
          />

          <Button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : editId
              ? "Update Notice"
              : "Publish Notice"}
          </Button>

          {editId && (
            <Button variant="outline" onClick={cancelEdit}>
              Cancel Edit
            </Button>
          )}
        </form>
      </Card>

      <section className="grid two">
        {notices.length === 0 ? (
          <Card title="No Notices">
            <p className="muted">No notice has been published yet.</p>
          </Card>
        ) : (
          notices.map((notice) => (
            <Card
              key={notice.id}
              title={notice.title}
              subtitle={`${notice.description}\n${notice.year} • ${notice.semester}`}
            >
              <div className="action-row">
                <Button variant="outline" onClick={() => startEdit(notice)}>
                  Edit
                </Button>

                <Button variant="danger" onClick={() => handleDelete(notice)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </section>
    </main>
  );
}