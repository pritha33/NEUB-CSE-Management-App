import { useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { useData } from "../../context/DataContext";

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const semesters = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester"
];

const days = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday"
];

const emptyForm = {
  courseName: "",
  courseCode: "",
  teacher: "",
  year: "1st Year",
  semester: "1st Semester",
  schedule: []
};

export default function AdminRoutine() {
  const { store, addItem, updateItem, deleteItem, addActivity } = useData();

  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const routines = store.routines || [];

  const set = (key, val) => {
    setForm((previous) => ({
      ...previous,
      [key]: val
    }));
  };

  function toggleDay(day) {
    const selected = form.schedule.some((item) => item.day === day);

    if (selected) {
      setForm((previous) => ({
        ...previous,
        schedule: previous.schedule.filter((item) => item.day !== day)
      }));
    } else {
      setForm((previous) => ({
        ...previous,
        schedule: [
          ...previous.schedule,
          {
            day,
            time: "",
            room: ""
          }
        ]
      }));
    }
  }

  function updateSchedule(day, key, value) {
    setForm((previous) => ({
      ...previous,
      schedule: previous.schedule.map((item) =>
        item.day === day
          ? {
              ...item,
              [key]: value
            }
          : item
      )
    }));
  }

  function startEdit(routine) {
    let schedule = [];

    if (Array.isArray(routine.schedule)) {
      schedule = routine.schedule.map((item) => ({
        day: item.day || "",
        time: item.time || "",
        room: item.room || routine.room || ""
      }));
    } else if (routine.day && routine.time) {
      schedule = [
        {
          day: routine.day,
          time: routine.time,
          room: routine.room || ""
        }
      ];
    }

    setEditId(routine.id);

    setForm({
      courseName: routine.courseName || routine.course || "",
      courseCode: routine.courseCode || "",
      teacher: routine.teacher || "",
      year: routine.year || "1st Year",
      semester: routine.semester || "1st Semester",
      schedule
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

    if (form.schedule.length === 0) {
      alert("Please select at least one day.");
      return;
    }

    const invalidSchedule = form.schedule.some(
      (item) => !item.day || !item.time || !item.room
    );

    if (invalidSchedule) {
      alert("Please add time and room for every selected day.");
      return;
    }

    try {
      setLoading(true);

      const routineData = {
        courseName: form.courseName,
        courseCode: form.courseCode,
        teacher: form.teacher,
        year: form.year,
        semester: form.semester,
        schedule: form.schedule
      };

      if (editId) {
        await updateItem("routines", editId, routineData);

        await addActivity(
          "Routine updated",
          `Admin updated routine for ${form.courseName}`,
          "admin"
        );
      } else {
        await addItem("routines", routineData);

        await addActivity(
          "Routine added",
          `Admin added routine for ${form.courseName}`,
          "admin"
        );
      }

      setForm(emptyForm);
      setEditId(null);
    } catch (error) {
      console.error("Routine save error:", error);
      alert(error.message || "Failed to save routine.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(routine) {
    const title = routine.courseName || routine.course || "this routine";

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${title}" routine?`
    );

    if (!confirmDelete) return;

    try {
      await deleteItem("routines", routine.id);

      await addActivity(
        "Routine deleted",
        `Admin deleted routine for ${title}`,
        "admin"
      );
    } catch (error) {
      console.error("Routine delete error:", error);
      alert(error.message || "Failed to delete routine.");
    }
  }

  function getScheduleText(routine) {
    if (Array.isArray(routine.schedule) && routine.schedule.length > 0) {
      return routine.schedule
        .map(
          (item) =>
            `${item.day}: ${item.time} | Room: ${
              item.room || routine.room || "Not assigned"
            }`
        )
        .join("\n");
    }

    return `${routine.day || "Day not set"}: ${
      routine.time || "Time not set"
    } | Room: ${routine.room || "Not assigned"}`;
  }

  return (
    <main className="page">
      <div className="page-head">
        
        <h1>Manage Class Routine</h1>
        <p>
          Admin can select multiple days and add separate time and room for each
          day.
        </p>
      </div>

      <Card title={editId ? "Edit Routine" : "Add Routine"}>
        <form className="form" onSubmit={submit}>
          <Input
            label="Course Name"
            value={form.courseName}
            onChange={(v) => set("courseName", v)}
            placeholder="Example: Data Structure"
            required
          />

          <Input
            label="Course Code"
            value={form.courseCode}
            onChange={(v) => set("courseCode", v)}
            placeholder="Example: CSE-221"
            required
          />

          <Input
            label="Teacher Name"
            value={form.teacher}
            onChange={(v) => set("teacher", v)}
            placeholder="Example: Md. Rahim Uddin"
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

          <div className="routine-days-box">
            <label className="form-label">Select Day, Time and Room</label>

            <div className="routine-days-list">
              {days.map((day) => {
                const selected = form.schedule.find(
                  (item) => item.day === day
                );

                return (
                  <div className="routine-day-item" key={day}>
                    <label className="routine-check">
                      <input
                        type="checkbox"
                        checked={!!selected}
                        onChange={() => toggleDay(day)}
                      />
                      <span>{day}</span>
                    </label>

                    {selected && (
                      <div className="routine-day-fields">
                        <input
                          className="routine-time-input"
                          type="text"
                          value={selected.time}
                          onChange={(e) =>
                            updateSchedule(day, "time", e.target.value)
                          }
                          placeholder="Example: 10:00 AM - 11:30 AM"
                          required
                        />

                        <input
                          className="routine-time-input"
                          type="text"
                          value={selected.room}
                          onChange={(e) =>
                            updateSchedule(day, "room", e.target.value)
                          }
                          placeholder="Example: Room 301"
                          required
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update Routine" : "Add Routine"}
          </Button>

          {editId && (
            <Button type="button" variant="outline" onClick={cancelEdit}>
              Cancel Edit
            </Button>
          )}
        </form>
      </Card>

      <section className="grid two">
        {routines.length === 0 ? (
          <Card title="No Routine">
            <p className="muted">No class routine has been added yet.</p>
          </Card>
        ) : (
          routines.map((routine) => (
            <Card
              key={routine.id}
              title={`${routine.courseName || routine.course || "Course"} ${
                routine.courseCode ? `(${routine.courseCode})` : ""
              }`}
              subtitle={`${getScheduleText(routine)}
Teacher: ${routine.teacher}
${routine.year} • ${routine.semester}`}
            >
              <div className="action-row">
                <Button variant="outline" onClick={() => startEdit(routine)}>
                  Edit
                </Button>

                <Button variant="danger" onClick={() => handleDelete(routine)}>
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