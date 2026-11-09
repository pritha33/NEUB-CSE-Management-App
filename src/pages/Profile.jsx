import Card from "../components/Card";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { currentUser, resendVerification } = useAuth();
  const u = currentUser;

  async function resend() {
    try {
      await resendVerification();
      alert("Verification email sent again.");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <main className="page">
      <div className="page-head">
        <span className="badge">{u.role}</span>
        <h1>Profile</h1>
        <p>Your profile information.</p>
      </div>

      <section className="grid two">
        <Card title="Name" subtitle={u.name} />
        <Card title="Email" subtitle={u.email} />
        <Card title="Role" subtitle={u.role} />
        <Card title="Email Verified" subtitle={u.emailVerified ? "Yes" : "No"} />
        {u.studentId && <Card title="Student ID" subtitle={u.studentId} />}
        {u.teacherId && <Card title="Teacher ID" subtitle={u.teacherId} />}
        {u.adminId && <Card title="Admin ID" subtitle={u.adminId} />}
        {u.year && <Card title="Year" subtitle={u.year} />}
        {u.semester && <Card title="Semester" subtitle={u.semester} />}
      </section>

      {!u.emailVerified && <Button onClick={resend}>Resend Verification Email</Button>}
    </main>
  );
}
