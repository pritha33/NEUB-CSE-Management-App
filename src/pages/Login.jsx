import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Card from "../components/Card";
import ProtectedNotice from "../components/ProtectedNotice";
import { useAuth } from "../context/AuthContext";

function getLoginErrorMessage(error) {
  const code = error?.code || "";

  if (code === "auth/too-many-requests") {
    return "You cannot login right now. Too many attempts. Please try again later.";
  }

  if (code === "auth/invalid-credential") {
    return "Invalid email or password. Please check your login details.";
  }

  if (code === "auth/user-not-found") {
    return "No account found with this email address.";
  }

  if (code === "auth/wrong-password") {
    return "Incorrect password. Please try again.";
  }

  if (code === "auth/invalid-email") {
    return "Please enter a valid email address.";
  }

  if (code === "auth/network-request-failed") {
    return "Network problem. Please check your internet connection.";
  }

  return "Login failed. Please try again.";
}

export default function Login({ setPage }) {
  const { login, firebaseReady } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setMsg("");

    try {
      setLoading(true);

      const user = await login(email, password);
      setPage(`${user.role}Dashboard`);
    } catch (error) {
      setMsg(getLoginErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page auth-page">
      <Card
        title="Account Login"
        subtitle="Access your department account using your registered email address."
      >
        <ProtectedNotice setPage={setPage} />

        <form onSubmit={submit} className="form">
          <Input
            label="Email Address"
            value={email}
            onChange={setEmail}
            type="email"
            required
          />

          <Input
            label="Password"
            value={password}
            onChange={setPassword}
            type="password"
            showPasswordToggle
            required
          />

          {msg && <p className="error">{msg}</p>}

          <Button type="submit" disabled={loading || !firebaseReady}>
            {loading ? "Signing in..." : "Login"}
          </Button>

          <Button variant="outline" onClick={() => setPage("forgot")}>
            Forgot Password?
          </Button>

          <Button variant="ghost" onClick={() => setPage("registerRole")}>
            Create New Account
          </Button>
        </form>
      </Card>
    </main>
  );
}