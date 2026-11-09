import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import ProtectedNotice from "../components/ProtectedNotice";
import { useAuth } from "../context/AuthContext";

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

export default function StudentRegister({ setPage }) {
  const { register, firebaseReady } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    year: "1st Year",
    semester: "1st Semester"
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value
    }));
  };

  async function submit(e) {
    e.preventDefault();
    setMsg("");

    if (form.password.length < 8) {
      setMsg("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        year: form.year,
        semester: form.semester,
        role: "student"
      });

      setMsg(
        "Account created. Verification link has been sent to your email. Please verify first, then login."
      );

      setForm({
        name: "",
        email: "",
        password: "",
        year: "1st Year",
        semester: "1st Semester"
      });

      setTimeout(() => {
        setPage("login");
      }, 3000);
    } catch (error) {
      setMsg(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page auth-page">
      <Card title="Student Registration">
        <ProtectedNotice setPage={setPage} />

        <form className="form" onSubmit={submit}>
          <Input
            label="Full Name"
            value={form.name}
            onChange={(value) => set("name", value)}
            required
          />

          <Input
            label="Email Address"
            value={form.email}
            onChange={(value) => set("email", value)}
            type="email"
            required
          />

          <Input
            label="Password"
            value={form.password}
            onChange={(value) => set("password", value)}
            type="password"
            showPasswordToggle
            required
          />

          <Select
            label="Year"
            value={form.year}
            onChange={(value) => set("year", value)}
            options={years}
          />

          <Select
            label="Semester"
            value={form.semester}
            onChange={(value) => set("semester", value)}
            options={semesters}
          />

          {msg && (
            <p
              className={
                msg.includes("created") || msg.includes("sent")
                  ? "success"
                  : "error"
              }
            >
              {msg}
            </p>
          )}

          <Button type="submit" disabled={loading || !firebaseReady}>
            {loading ? "Creating..." : "Create Account"}
          </Button>

          <Button variant="outline" onClick={() => setPage("registerRole")}>
            Back
          </Button>
        </form>
      </Card>
    </main>
  );
}