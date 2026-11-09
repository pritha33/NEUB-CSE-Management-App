import { useEffect, useMemo, useState } from "react";
import TopNav from "./components/TopNav";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import RegisterRole from "./pages/RegisterRole";
import StudentRegister from "./pages/StudentRegister";
import TeacherAdminRegister from "./pages/TeacherAdminRegister";
import Profile from "./pages/Profile";
import Activity from "./pages/Activity";

import StudentDashboard from "./pages/dashboards/StudentDashboard";
import TeacherDashboard from "./pages/dashboards/TeacherDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";

import StudentNotices from "./pages/student/StudentNotices";
import StudentRoutine from "./pages/student/StudentRoutine";
import StudentMaterials from "./pages/student/StudentMaterials";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentPayments from "./pages/student/StudentPayments";

import TeacherUpdates from "./pages/teacher/TeacherUpdates";
import TeacherMaterials from "./pages/teacher/TeacherMaterials";
import TeacherAssignments from "./pages/teacher/TeacherAssignments";
import Submissions from "./pages/teacher/Submissions";

import AdminNotices from "./pages/admin/AdminNotices";
import AdminRoutine from "./pages/admin/AdminRoutine";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminUsers from "./pages/admin/AdminUsers";

import { useAuth } from "./context/AuthContext";

export default function App() {
  const { currentUser, authLoading } = useAuth();
  const [page, setPage] = useState("home");

  useEffect(() => {
    if (currentUser?.role) {
      const url = window.location.href;

      const hasPaymentLink =
        url.includes("mode=signIn") || url.includes("payment_id");

      if (hasPaymentLink && currentUser.role === "student") {
        setPage("payments");
      } else {
        setPage(`${currentUser.role}Dashboard`);
      }
    }
  }, [currentUser?.uid]);

  const PageComponent = useMemo(() => {
    const props = { setPage };

    if (authLoading) {
      return (
        <main className="page">
          <div className="loader">Loading...</div>
        </main>
      );
    }

    if (!currentUser) {
      if (page === "login") return <Login {...props} />;
      if (page === "forgot") return <ForgotPassword {...props} />;
      if (page === "registerRole") return <RegisterRole {...props} />;
      if (page === "studentRegister") return <StudentRegister {...props} />;
      if (page === "teacherRegister")
        return <TeacherAdminRegister {...props} role="teacher" />;
      if (page === "adminRegister")
        return <TeacherAdminRegister {...props} role="admin" />;
      return <Home {...props} />;
    }

    if (page === "profile") return <Profile {...props} />;
    if (page === "myActivity") return <Activity {...props} />;
    if (page === "allActivity") return <Activity {...props} all />;

    if (currentUser.role === "student") {
      if (page === "notices") return <StudentNotices {...props} />;
      if (page === "routine") return <StudentRoutine {...props} />;
      if (page === "materials") return <StudentMaterials {...props} />;
      if (page === "studentAssignments")
        return <StudentAssignments {...props} />;
      if (page === "payments") return <StudentPayments {...props} />;
      return <StudentDashboard {...props} />;
    }

    if (currentUser.role === "teacher") {
      if (page === "teacherUpdates") return <TeacherUpdates {...props} />;
      if (page === "teacherMaterials") return <TeacherMaterials {...props} />;
      if (page === "teacherAssignments")
        return <TeacherAssignments {...props} />;
      if (page === "submissions") return <Submissions {...props} />;
      return <TeacherDashboard {...props} />;
    }

    if (currentUser.role === "admin") {
      if (page === "adminNotices") return <AdminNotices {...props} />;
      if (page === "adminRoutine") return <AdminRoutine {...props} />;
      if (page === "adminPayments") return <AdminPayments {...props} />;
      if (page === "adminStudents")
        return <AdminUsers {...props} type="student" />;
      if (page === "adminTeachers")
        return <AdminUsers {...props} type="teacher" />;
      return <AdminDashboard {...props} />;
    }

    return <Home {...props} />;
  }, [page, currentUser, authLoading]);

  return (
    <div className="app">
      <TopNav page={page} setPage={setPage} />
      {PageComponent}
    </div>
  );
}