import { useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { filterForTeacher } from "../../utils/filters";

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "All"];
const semesters = ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester", "All"];

export default function TeacherUpdates() {
  const { currentUser } = useAuth();
  const { store, addItem, addActivity } = useData();
  const [form, setForm] = useState({ title: "", message: "", year: "1st Year", semester: "1st Semester" });
  const updates = filterForTeacher(store.classUpdates, currentUser);
  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  async function submit(e) {
    e.preventDefault();
    await addItem("classUpdates", {
      ...form,
      teacherUid: currentUser.uid,
      teacherName: currentUser.name
    });
    await addActivity("Class update posted", `${currentUser.name} posted ${form.title}`);
    setForm({ title: "", message: "", year: "1st Year", semester: "1st Semester" });
  }

  return (
    <main className="page">
      <div className="page-head">
        <h1>Class Updates</h1>
        <p>Teacher can add updates for selected semester.</p>
      </div>

      <Card title="Post Update">
        <form className="form" onSubmit={submit}>
          <Input label="Title" value={form.title} onChange={(v) => set("title", v)} required />
          <Input label="Message" value={form.message} onChange={(v) => set("message", v)} textarea required />
          <Select label="Year" value={form.year} onChange={(v) => set("year", v)} options={years} />
          <Select label="Semester" value={form.semester} onChange={(v) => set("semester", v)} options={semesters} />
          <Button type="submit">Post Update</Button>
        </form>
      </Card>

      <section className="grid two">
        {updates.map((u) => <Card key={u.id} title={u.title} subtitle={`${u.message}\n${u.year} • ${u.semester}`} />)}
      </section>
    </main>
  );
}
