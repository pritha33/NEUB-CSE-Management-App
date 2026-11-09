import Card from "../../components/Card";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { filterForStudent } from "../../utils/filters";

export default function StudentMaterials() {
  const { currentUser } = useAuth();
  const { store, addActivity } = useData();

  const materials = filterForStudent(store.materials || [], currentUser);

  async function openMaterial(material) {
    await addActivity(
      "Material opened",
      `${currentUser.name} opened ${material.title}`
    );

    if (material.link) {
      window.open(material.link, "_blank");
    } else {
      alert("No material link found.");
    }
  }

  return (
    <main className="page">
      <div className="page-head">
        <h1>Study Materials</h1>
        <p>Download materials uploaded for your semester.</p>
      </div>

      <section className="grid two">
        {materials.map((material) => (
          <Card
            key={material.id}
            title={material.title || "Untitled Material"}
            subtitle={`${material.courseName || material.course || "Course not set"} ${
              material.courseCode ? `(${material.courseCode})` : ""
            }
Uploaded by ${material.teacherName || "Teacher"}
${material.year || currentUser.year} • ${material.semester || currentUser.semester}`}
          >
            <Button onClick={() => openMaterial(material)}>
              Download / Open
            </Button>
          </Card>
        ))}

        {materials.length === 0 && (
          <Card
            title="No materials"
            subtitle="No material uploaded yet."
          />
        )}
      </section>
    </main>
  );
}