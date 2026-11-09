import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import ProtectedNotice from "../components/ProtectedNotice";
import { useAuth } from "../context/AuthContext";

export default function ForgotPassword({ setPage }) {
  const { forgotPassword, firebaseReady } = useAuth();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    try {
      setLoading(true);
      await forgotPassword(email);
      setMsg("Recovery instructions have been sent to your email address.");
    } catch (error) {
      setMsg(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page auth-page">
      <Card title="Recover Account" subtitle="Enter your registered email address to receive password recovery instructions.">
        <ProtectedNotice setPage={setPage} />
        <form className="form" onSubmit={submit}>
          <Input label="Email Address" value={email} onChange={setEmail} type="email" required />
          {msg && <p className={msg.includes("sent") || msg.includes("Recovery") ? "success" : "error"}>{msg}</p>}
          <Button type="submit" disabled={loading || !firebaseReady}>{loading ? "Sending..." : "Send Recovery Email"}</Button>
          <Button variant="outline" onClick={() => setPage("login")}>Back to Login</Button>
        </form>
      </Card>
    </main>
  );
}
