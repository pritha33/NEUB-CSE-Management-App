import { useState } from "react";
import {
  ClipboardList,
  CalendarDays,
  FileUp,
  CheckCircle,
  BookOpen
} from "lucide-react";

import Button from "../../components/Button";
import Input from "../../components/Input";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { filterForStudent } from "../../utils/filters";

export default function StudentAssignments() {
  const { currentUser } = useAuth();
  const { store, addItem, addActivity } = useData();

  const assignments = filterForStudent(store.assignments || [], currentUser);

  const [selected, setSelected] = useState(null);
  const [fileLink, setFileLink] = useState("");
  const [msg, setMsg] = useState("");

  function getCourseText(item) {
    return `${item.courseName || item.course || "Course not set"} ${
      item.courseCode ? `(${item.courseCode})` : ""
    }`;
  }

  async function submitAssignment(e) {
    e.preventDefault();
    setMsg("");

    if (!selected) {
      setMsg("Please select an assignment first.");
      return;
    }

    if (!fileLink) {
      setMsg("Please add your submission file link.");
      return;
    }

    await addItem("submissions", {
      assignmentId: selected.id,
      assignmentTitle: selected.title,
      teacherUid: selected.teacherUid,
      studentUid: currentUser.uid,
      studentName: currentUser.name,
      fileLink,
      status: "Submitted"
    });

    await addActivity(
      "Assignment submitted",
      `${currentUser.name} submitted ${selected.title}`
    );

    setMsg("Assignment submitted successfully.");
    setSelected(null);
    setFileLink("");
  }

  return (
    <main className="page classroom-page">
      <section className="classroom-header">
        <div>
          <span className="classroom-badge">Assignments</span>
          <h1>Classwork</h1>
          <p>View your assigned tasks and submit your work.</p>
        </div>

        <div className="classroom-header-icon">
          <ClipboardList size={38} />
        </div>
      </section>

      <section className="classroom-layout">
        <div className="classroom-feed">
          {assignments.map((assignment) => (
            <button
              key={assignment.id}
              className={
                selected?.id === assignment.id
                  ? "classroom-assignment-card active"
                  : "classroom-assignment-card"
              }
              onClick={() => {
                setSelected(assignment);
                setMsg("");
              }}
            >
              <div className="assignment-icon">
                <BookOpen size={22} />
              </div>

              <div className="assignment-content">
                <h3>{assignment.title || "Untitled Assignment"}</h3>

                <div className="assignment-meta">
                  <span>{getCourseText(assignment)}</span>
                  <span>{assignment.deadline || "No deadline"}</span>
                </div>

                {assignment.details && <p>{assignment.details}</p>}
              </div>
            </button>
          ))}

          {assignments.length === 0 && (
            <div className="classroom-empty">
              <ClipboardList size={42} />
              <h3>No assignments available</h3>
              <p>No assignment has been published for your semester yet.</p>
            </div>
          )}
        </div>

        <aside className="classroom-submit-box">
          <div className="submit-box-head">
            <div className="submit-icon">
              <FileUp size={24} />
            </div>

            <div>
              <h2>Your Work</h2>
              <p>
                {selected
                  ? selected.title
                  : "Select an assignment to submit your work."}
              </p>
            </div>
          </div>

          {selected && (
            <div className="selected-assignment-info">
              <div>
                <CalendarDays size={18} />
                <span>Deadline: {selected.deadline || "No deadline"}</span>
              </div>

              <div>
                <BookOpen size={18} />
                <span>Course: {getCourseText(selected)}</span>
              </div>
            </div>
          )}

          <form className="form" onSubmit={submitAssignment}>
            <Input
              label="Submission File Link"
              value={fileLink}
              onChange={setFileLink}
              placeholder="Paste Google Drive / file link"
              required
            />

            {msg && (
              <p className={msg.includes("successfully") ? "success" : "error"}>
                {msg}
              </p>
            )}

            <Button type="submit">
              {selected ? "Submit Assignment" : "Select Assignment"}
            </Button>
          </form>

          {msg.includes("successfully") && (
            <div className="submit-success-box">
              <CheckCircle size={20} />
              <span>Your assignment has been submitted.</span>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}