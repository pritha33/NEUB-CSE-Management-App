import { useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { filterForTeacher } from "../../utils/filters";

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const semesters = ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"];

const emptyForm = {
  title: "",
  courseName: "",
  courseCode: "",
  details: "",
  deadline: "",
  year: "1st Year",
  semester: "1st Semester"
};

export default function TeacherAssignments() {
  const { currentUser } = useAuth();
  const { store, addItem, updateItem, deleteItem, addActivity } = useData();

  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const assignments = filterForTeacher(store.assignments || [], currentUser);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  function startEdit(assignment) {
    setEditId(assignment.id);
    setForm({
      title: assignment.title || "",
      courseName: assignment.courseName || "",
      courseCode: assignment.courseCode || "",
      details: assignment.details || "",
      deadline: assignment.deadline || "",
      year: assignment.year || "1st Year",
      semester: assignment.semester || "1st Semester"
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditId(null);
    setForm(emptyForm);
  }

  async function submit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        title: form.title,
        courseName: form.courseName,
        courseCode: form.courseCode,
        details: form.details,
        deadline: form.deadline,
        year: form.year,
        semester: form.semester,
        teacherUid: currentUser.uid,
        teacherName: currentUser.name
      };

      if (editId) {
        await updateItem("assignments", editId, payload);
        await addActivity("Assignment updated", `${currentUser.name} updated assignment: ${form.title}`);
      } else {
        await addItem("assignments", payload);
        await addActivity("Assignment published", `${currentUser.name} published assignment: ${form.title}`);
      }

      cancelEdit();
    } catch (error) {
      alert(error.message || "Failed to save assignment.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(assignment) {
    if (!window.confirm(`Delete "${assignment.title}"?`)) return;

    await deleteItem("assignments", assignment.id);
    await addActivity("Assignment deleted", `${currentUser.name} deleted assignment: ${assignment.title}`);
  }

  return (
    <main className="page">
      <div className="page-head">
        <h1>Give Assignment</h1>
        <p>Teacher can create, edit and delete assignments.</p>
      </div>

      <Card title={editId ? "Edit Assignment" : "Create New Assignment"}>
        <form className="form" onSubmit={submit}>
          <Input label="Assignment Title" value={form.title} onChange={(v) => set("title", v)} required />
          <Input label="Course Name" value={form.courseName} onChange={(v) => set("courseName", v)} required />
          <Input label="Course Code" value={form.courseCode} onChange={(v) => set("courseCode", v)} required />
          <Input label="Assignment Details" value={form.details} onChange={(v) => set("details", v)} textarea required />
          <Input label="Deadline" value={form.deadline} onChange={(v) => set("deadline", v)} type="date" required />
          <Select label="Year" value={form.year} onChange={(v) => set("year", v)} options={years} />
          <Select label="Semester" value={form.semester} onChange={(v) => set("semester", v)} options={semesters} />

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update Assignment" : "Publish Assignment"}
          </Button>

          {editId && (
            <Button type="button" variant="outline" onClick={cancelEdit}>
              Cancel Edit
            </Button>
          )}
        </form>
      </Card>

      <section className="grid two">
        {assignments.length === 0 ? (
          <Card title="No Assignments">
            <p className="muted">You have not published any assignment yet.</p>
          </Card>
        ) : (
          assignments.map((assignment) => (
            <Card
              key={assignment.id}
              title={assignment.title}
              subtitle={`${assignment.courseName || ""} ${assignment.courseCode ? `(${assignment.courseCode})` : ""}\nDeadline: ${assignment.deadline}\n${assignment.year} • ${assignment.semester}`}
            >
              <p>{assignment.details}</p>

              <div className="action-row">
                <Button variant="outline" onClick={() => startEdit(assignment)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(assignment)}>
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