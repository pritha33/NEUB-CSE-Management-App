import Card from "../components/Card";
import Button from "../components/Button";

export default function RegisterRole({ setPage }) {
  return (
    <main className="page">
      <div className="page-head">
        <span className="badge">Registration</span>
        <h1>Choose Account Type</h1>
        <p>Student selects year and semester. Teacher/Admin must use secret code.</p>
      </div>

      <section className="grid three">
        <Card title="Student" subtitle="Register with year and semester." onClick={() => setPage("studentRegister")} />
        <Card title="Teacher" subtitle="Register with teacher secret code." onClick={() => setPage("teacherRegister")} />
        <Card title="Admin" subtitle="Register with admin secret code." onClick={() => setPage("adminRegister")} />
      </section>

      <Button variant="outline" onClick={() => setPage("home")}>Back Home</Button>
    </main>
  );
}
