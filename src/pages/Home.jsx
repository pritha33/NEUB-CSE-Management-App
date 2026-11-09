import { GraduationCap } from "lucide-react";
import Button from "../components/Button";

export default function Home({ setPage }) {
  return (
    <main className="simple-home">
      <div className="simple-home-card">
        <div className="education-logo">
          <GraduationCap size={72} />
        </div>

        <h1>NEUB CSE Management App</h1>

        <p>Academic management system for students, teachers and admin.</p>

        <Button onClick={() => setPage("login")}>Get Started</Button>
      </div>
    </main>
  );
}