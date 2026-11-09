import Card from "./Card";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";

export default function ProtectedNotice({ setPage }) {
  const { firebaseReady } = useAuth();

  if (!firebaseReady) {
    return (
      <Card
        title="System setup required"
        subtitle="The account system is not connected yet. Please complete the project configuration before using login and registration."
      >
        <Button onClick={() => setPage("home")}>Go Home</Button>
      </Card>
    );
  }

  return null;
}
