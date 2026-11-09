export function studentVisible(item, student) {
  const yearOk = !item.year || item.year === "All" || item.year === student.year;
  const semesterOk = !item.semester || item.semester === "All" || item.semester === student.semester;
  return yearOk && semesterOk;
}

export function filterForStudent(list, student) {
  return (list || []).filter((item) => studentVisible(item, student));
}

export function filterOwnStudentRecords(list, student) {
  return (list || []).filter((item) => item.studentUid === student.uid);
}

export function filterForTeacher(list, teacher) {
  return (list || []).filter((item) => item.teacherUid === teacher.uid);
}

export function moneyTotal(list) {
  return (list || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

export function formatDate(value) {
  if (!value) return "Just now";
  if (value.toDate) return value.toDate().toLocaleString();
  return String(value);
}
