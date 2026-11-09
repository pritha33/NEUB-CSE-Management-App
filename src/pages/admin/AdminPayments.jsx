import { useMemo, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import MetricCard from "../../components/MetricCard";
import { useData } from "../../context/DataContext";

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const semesters = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester"
];

const emptyForm = {
  type: "Semester Fee",
  amount: "",
  year: "1st Year",
  semester: "1st Semester"
};

function totalAmount(list) {
  return list.reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

function formatTime(value) {
  if (!value) return "Not paid yet";

  if (value.seconds) {
    return new Date(value.seconds * 1000).toLocaleString();
  }

  return String(value);
}

export default function AdminPayments() {
  const { store, addItem, updateItem, deleteItem, addActivity } = useData();

  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const payments = store.payments || [];
  const users = store.users || [];

  const students = users.filter((u) => u.role === "student");

  const semesterPayments = payments.filter((p) => p.type === "Semester Fee");
  const societyPayments = payments.filter((p) => p.type === "Society Fee");

  const paidRecords = payments.filter((p) => p.status === "Paid");

  const set = (key, value) => {
    setForm((previous) => ({
      ...previous,
      [key]: value
    }));
  };

  const filteredWhoPaid = useMemo(() => {
    return paidRecords.filter((payment) => {
      if (form.type === "Society Fee") {
        return payment.type === "Society Fee";
      }

      return (
        payment.type === "Semester Fee" &&
        payment.year === form.year &&
        payment.semester === form.semester
      );
    });
  }, [paidRecords, form.type, form.year, form.semester]);

  function resetForm() {
    setEditId(null);
    setForm(emptyForm);
  }

  function startEdit(payment) {
    setEditId(payment.id);

    setForm({
      type: payment.type || "Semester Fee",
      amount: payment.amount || "",
      year: payment.year || "1st Year",
      semester: payment.semester || "1st Semester"
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        type: form.type,
        amount: Number(form.amount),
        status: "Pending"
      };

      if (form.type === "Semester Fee") {
        payload.year = form.year;
        payload.semester = form.semester;
      } else {
        payload.year = "All";
        payload.semester = "All";
      }

      if (editId) {
        await updateItem("payments", editId, payload);

        await addActivity(
          "Payment updated",
          `Admin updated ${form.type} amount`,
          "admin"
        );
      } else {
        await addItem("payments", payload);

        await addActivity(
          "Payment added",
          `Admin added ${form.type} amount`,
          "admin"
        );
      }

      resetForm();
    } catch (error) {
      console.error("Payment save error:", error);
      alert(error.message || "Failed to save payment.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(payment) {
    const ok = window.confirm(`Delete ${payment.type} record?`);
    if (!ok) return;

    try {
      await deleteItem("payments", payment.id);

      await addActivity(
        "Payment deleted",
        `Admin deleted ${payment.type}`,
        "admin"
      );
    } catch (error) {
      alert(error.message || "Failed to delete payment.");
    }
  }

  return (
    <main className="page">
      <div className="page-head">
       
        <h1>Manage Payments</h1>
        <p>
          Admin can add, edit, delete payment amount and view who paid with time.
        </p>
      </div>

      <section className="metrics">
        <MetricCard
          title="Semester Fee Total"
          value={`${totalAmount(semesterPayments)} BDT`}
        />
        <MetricCard
          title="Society Fee Total"
          value={`${totalAmount(societyPayments)} BDT`}
        />
        <MetricCard title="Paid Records" value={paidRecords.length} />
        <MetricCard title="Students" value={students.length} />
      </section>

      <Card title={editId ? "Edit Payment Amount" : "Add Payment Amount"}>
        <form className="form" onSubmit={submit}>
          <Select
            label="Payment Type"
            value={form.type}
            onChange={(v) => set("type", v)}
            options={["Semester Fee", "Society Fee"]}
          />

          <Input
            label="Amount"
            value={form.amount}
            onChange={(v) => set("amount", v)}
            type="number"
            placeholder="Example: 5000"
            required
          />

          {form.type === "Semester Fee" && (
            <>
              <Select
                label="Year"
                value={form.year}
                onChange={(v) => set("year", v)}
                options={years}
              />

              <Select
                label="Semester"
                value={form.semester}
                onChange={(v) => set("semester", v)}
                options={semesters}
              />
            </>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : editId ? "Update Payment" : "Add Payment"}
          </Button>

          {editId && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel Edit
            </Button>
          )}
        </form>
      </Card>

      <Card title="Who Paid">
        {filteredWhoPaid.length === 0 ? (
          <p className="muted">No student has paid this selected payment yet.</p>
        ) : (
          <div className="payment-table">
            <div className="payment-row payment-head">
              <span>Name</span>
              <span>Email</span>
              <span>Type</span>
              <span>Amount</span>
              <span>Paid Time</span>
            </div>

            {filteredWhoPaid.map((payment) => (
              <div className="payment-row" key={payment.id}>
                <span>{payment.studentName || "Student"}</span>
                <span>{payment.studentEmail || "N/A"}</span>
                <span>{payment.type}</span>
                <span>{payment.amount} BDT</span>
                <span>{formatTime(payment.paidAt || payment.updatedAt)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <section className="grid two">
        {payments.length === 0 ? (
          <Card title="No Payment Setup" subtitle="No payment amount added yet." />
        ) : (
          payments.map((payment) => (
            <Card
              key={payment.id}
              title={payment.type}
              subtitle={`Amount: ${payment.amount} BDT
${payment.type === "Semester Fee" ? `${payment.year} • ${payment.semester}` : "For All Students"}`}
            >
              <div className="action-row">
                <Button variant="outline" onClick={() => startEdit(payment)}>
                  Edit
                </Button>

                <Button variant="danger" onClick={() => handleDelete(payment)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </section>
    </main>
  );
}