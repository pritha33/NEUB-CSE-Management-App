import Card from "../../components/Card";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { filterForStudent } from "../../utils/filters";

export default function StudentRoutine() {
  const { currentUser } = useAuth();
  const { store } = useData();

  const routines = filterForStudent(store.routines || [], currentUser);

  function getSchedule(routine) {
    if (Array.isArray(routine.schedule) && routine.schedule.length > 0) {
      return routine.schedule;
    }

    return [
      {
        day: routine.day || "Day not set",
        time: routine.time || "Time not set",
        room: routine.room || "Room not set"
      }
    ];
  }

  return (
    <main className="page">
      <div className="page-head">
       
        <h1>Class Routine</h1>
        <p>
          {currentUser.year} • {currentUser.semester}
        </p>
      </div>

      <section className="grid two">
        {routines.length === 0 ? (
          <Card
            title="No Routine"
            subtitle="Routine has not been published yet."
          />
        ) : (
          routines.map((routine) => (
            <Card
              key={routine.id}
              title={`${routine.courseName || routine.course || "Course"} ${
                routine.courseCode ? `(${routine.courseCode})` : ""
              }`}
              subtitle={`Teacher: ${routine.teacher || "Not assigned"}`}
            >
              <div className="student-routine-list">
                {getSchedule(routine).map((item, index) => (
                  <div className="student-routine-row" key={index}>
                    <strong>{item.day}</strong>
                    <span>Time: {item.time || "Not set"}</span>
                    <span>Room: {item.room || "Not set"}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))
        )}
      </section>
    </main>
  );
}