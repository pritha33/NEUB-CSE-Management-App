import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import ProtectedNotice from "../components/ProtectedNotice";
import { useAuth } from "../context/AuthContext";
import { SECRET_CODES } from "../config/secrets";

export default function TeacherAdminRegister({ setPage, role }) {
  const { register, firebaseReady } = useAuth();

  const isTeacher = role === "teacher";
  const isAdmin = role === "admin";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    secretCode: ""
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

    if (!isTeacher && !isAdmin) {
      setMsg("Account role missing. Please go back and select Teacher or Admin.");
      return;
    }

    const correctCode = isTeacher
      ? SECRET_CODES.teacher
      : SECRET_CODES.admin;

    if (form.secretCode !== correctCode) {
      setMsg("Invalid secret code.");
      return;
    }

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
        role: isTeacher ? "teacher" : "admin",
        department: "CSE",
        secretCode: form.secretCode
      });

      setMsg(
        isTeacher
          ? "Teacher account created. Verification link has been sent to your email. Please verify first, then login."
          : "Admin account created. Verification link has been sent to your email. Please verify first, then login."
      );

      setForm({
        name: "",
        email: "",
        password: "",
        secretCode: ""
      });

      setTimeout(() => {
        setPage("login");
      }, 3000);
    } catch (error) {
      console.error("Teacher/Admin registration error:", error);
      setMsg(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page auth-page">
      <Card title={isTeacher ? "Teacher Registration" : "Admin Registration"}>
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

          <Input
            label={isTeacher ? "Teacher Secret Code" : "Admin Secret Code"}
            value={form.secretCode}
            onChange={(value) => set("secretCode", value)}
            type="password"
            showPasswordToggle
            required
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
            {loading
              ? "Creating..."
              : isTeacher
              ? "Create Teacher Account"
              : "Create Admin Account"}
          </Button>

          <Button variant="outline" onClick={() => setPage("registerRole")}>
            Back
          </Button>
        </form>
      </Card>
    </main>
  );
}