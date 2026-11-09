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
  link: "",
  year: "1st Year",
  semester: "1st Semester"
};

export default function TeacherMaterials() {
  const { currentUser } = useAuth();
  const { store, addItem, updateItem, deleteItem, addActivity } = useData();

  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const materials = filterForTeacher(store.materials || [], currentUser);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  function startEdit(material) {
    setEditId(material.id);
    setForm({
      title: material.title || "",
      courseName: material.courseName || "",
      courseCode: material.courseCode || "",
      link: material.link || "",
      year: material.year || "1st Year",
      semester: material.semester || "1st Semester"
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
        link: form.link,
        year: form.year,
        semester: form.semester,
        teacherUid: currentUser.uid,
        teacherName: currentUser.name
      };

      if (editId) {
        await updateItem("materials", editId, payload);
        await addActivity("Material updated", `${currentUser.name} updated material: ${form.title}`);
      } else {
        await addItem("materials", payload);
        await addActivity("Material uploaded", `${currentUser.name} uploaded material: ${form.title}`);
      }

      cancelEdit();
    } catch (error) {
      alert(error.message || "Failed to save material.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(material) {
    if (!window.confirm(`Delete "${material.title}"?`)) return;

    await deleteItem("materials", material.id);
    await addActivity("Material deleted", `${currentUser.name} deleted material: ${material.title}`);
  }

  return (
    <main className="page">
      <div className="page-head">
        <h1>Upload Materials</h1>
        <p>Teacher can upload, edit and delete study materials.</p>
      </div>

      <Card title={editId ? "Edit Material" : "Upload New Material"}>
        <form className="form" onSubmit={submit}>
          <Input label="Material Title" value={form.title} onChange={(v) => set("title", v)} required />
          <Input label="Course Name" value={form.courseName} onChange={(v) => set("courseName", v)} required />
          <Input label="Course Code" value={form.courseCode} onChange={(v) => set("courseCode", v)} required />
          <Input label="Download Link" value={form.link} onChange={(v) => set("link", v)} type="url" required />
          <Select label="Year" value={form.year} onChange={(v) => set("year", v)} options={years} />
          <Select label="Semester" value={form.semester} onChange={(v) => set("semester", v)} options={semesters} />

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update Material" : "Upload Material"}
          </Button>

          {editId && (
            <Button type="button" variant="outline" onClick={cancelEdit}>
              Cancel Edit
            </Button>
          )}
        </form>
      </Card>

      <section className="grid two">
        {materials.length === 0 ? (
          <Card title="No Materials">
            <p className="muted">You have not uploaded any material yet.</p>
          </Card>
        ) : (
          materials.map((material) => (
            <Card
              key={material.id}
              title={material.title}
              subtitle={`${material.courseName || ""} ${material.courseCode ? `(${material.courseCode})` : ""}\n${material.year} • ${material.semester}`}
            >
              <p>
                <strong>Download Link:</strong>{" "}
                <a href={material.link} target="_blank" rel="noreferrer">
                  Open Material
                </a>
              </p>

              <div className="action-row">
                <Button variant="outline" onClick={() => startEdit(material)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(material)}>
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