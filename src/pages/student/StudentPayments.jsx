import { useEffect, useState } from "react";
import {
  Mail,
  CheckCircle,
  ArrowLeft,
  Smartphone
} from "lucide-react";

import Button from "../../components/Button";
import Input from "../../components/Input";
import Card from "../../components/Card";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { moneyTotal } from "../../utils/filters";

import {
  auth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from "../../firebase/firebase";

export default function StudentPayments() {
  const { currentUser } = useAuth();
  const { store, addItem, addActivity } = useData();

  const [step, setStep] = useState("list");
  const [selectedPaymentId, setSelectedPaymentId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState("");
  const [pendingPayment, setPendingPayment] = useState(null);

  const payments = store.payments || [];

  // Paid payments of current student
  const myPayments = payments.filter(
    (payment) => payment.studentUid === currentUser.uid
  );
  const paidPayments = myPayments.filter((p) => p.status === "Paid");
  const studentPaidSetupIds = paidPayments.map((p) => p.setupId);

  // Available payments
  const paymentSetups = payments.filter((payment) => {
    const isSetup = !payment.studentUid;
    if (!isSetup) return false;

    const alreadyPaid = studentPaidSetupIds.includes(payment.id);
    if (alreadyPaid) return false;

    if (payment.type === "Society Fee") return true;
    if (payment.type === "Semester Fee") {
      return (
        payment.year === currentUser.year &&
        payment.semester === currentUser.semester
      );
    }
    return false;
  });

  const selectedPayment = paymentSetups.find(
    (payment) => payment.id === selectedPaymentId
  );

  const totalPaid = moneyTotal(paidPayments);

  function getPaymentSetupIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("payment_setup_id");
  }

  useEffect(() => {
    async function completePaymentFromEmailLink() {
      const url = window.location.href;

      if (!isSignInWithEmailLink(auth, url)) return;

      const setupId = getPaymentSetupIdFromUrl();
      if (!setupId) return setMsg("Payment reference not found.");

      const savedEmail =
        window.localStorage.getItem("emailForPaymentConfirm") ||
        currentUser?.email;

      const savedPaymentText = window.localStorage.getItem(
        `pending_payment_${setupId}`
      );

      if (!savedEmail || !savedPaymentText) {
        return setMsg("Payment data not found. Please try again.");
      }

      let savedPayment;
      try {
        savedPayment = JSON.parse(savedPaymentText);
      } catch {
        return setMsg("Invalid payment data.");
      }

      try {
        await signInWithEmailLink(auth, savedEmail, url);

        const paidRecord = {
          setupId,
          type: savedPayment.type,
          amount: savedPayment.amount,
          status: "Paid",
          year: savedPayment.year || "All",
          semester: savedPayment.semester || "All",
          studentUid: currentUser.uid,
          studentName: currentUser.name,
          studentEmail: currentUser.email,
          method: "Mobile Payment",
          mobileNumber: savedPayment.mobileNumber,
          emailConfirmed: true,
          paidAt: new Date().toISOString()
        };

        await addItem("payments", paidRecord);

        await addActivity(
          "Payment completed",
          `${currentUser.name} paid ${savedPayment.type} - ${savedPayment.amount} BDT`
        );

        setPendingPayment(paidRecord);

        window.localStorage.removeItem("emailForPaymentConfirm");
        window.localStorage.removeItem(`pending_payment_${setupId}`);
        window.history.replaceState({}, "", window.location.pathname);

        setStep("success");
        setMsg("Payment completed successfully!");
      } catch (error) {
        console.error(error);
        setMsg(
          error.code
            ? `${error.code}: ${error.message}`
            : "Email confirmation failed. Please try again."
        );
      }
    }

    if (currentUser?.email) {
      completePaymentFromEmailLink();
    }
  }, [currentUser]);

  function startPayment() {
    setMsg("");
    if (paymentSetups.length === 0) {
      setMsg("No available payment found. All payments are completed.");
      return;
    }
    setSelectedPaymentId(paymentSetups[0].id);
    setStep("payment");
  }

  async function sendEmailConfirmation(e) {
    e.preventDefault();
    setMsg("");

    if (!selectedPayment) {
      setMsg("Please select a payment.");
      return;
    }

    if (!mobileNumber || mobileNumber.length < 11) {
      setMsg("Please enter a valid mobile banking number.");
      return;
    }

    if (!pin || pin.length < 4) {
      setMsg("Please enter your PIN.");
      return;
    }

    try {
      const paymentData = {
        setupId: selectedPayment.id,
        type: selectedPayment.type,
        amount: selectedPayment.amount,
        year: selectedPayment.year || "All",
        semester: selectedPayment.semester || "All",
        mobileNumber,
        studentUid: currentUser.uid,
        studentName: currentUser.name,
        studentEmail: currentUser.email
      };

      const actionCodeSettings = {
        url: `${window.location.origin}/?payment_setup_id=${selectedPayment.id}`,
        handleCodeInApp: true
      };

      await sendSignInLinkToEmail(auth, currentUser.email, actionCodeSettings);

      window.localStorage.setItem("emailForPaymentConfirm", currentUser.email);
      window.localStorage.setItem(
        `pending_payment_${selectedPayment.id}`,
        JSON.stringify(paymentData)
      );

      setPendingPayment(paymentData);
      setStep("email");
      setMsg("Confirmation email sent. Please verify to complete payment.");
    } catch (error) {
      console.error(error);
      setMsg(
        error.code
          ? `${error.code}: ${error.message}`
          : "Confirmation email could not be sent. Please try again."
      );
    }
  }

  function confirmEmailAndCompletePayment() {
    setMsg("Please open your registered email and click the confirmation link.");
  }

  function resetPayment() {
    setStep("list");
    setSelectedPaymentId("");
    setMobileNumber("");
    setPin("");
    setPendingPayment(null);
    if (step === "success") {
      setMsg("Payment completed successfully!");
    }
  }

  // Render
  return (
    <main className="page payment-page">
      {step === "payment" && (
        <section className="bkash-shell">
          <button className="payment-back-btn" onClick={resetPayment}>
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="bkash-card">
            <div className="bkash-header">
              <div className="bkash-logo">
                <Smartphone size={34} />
              </div>
              <h1>NEUB Payment</h1>
              <p>Complete your payment securely</p>
            </div>
            <form className="form bkash-form" onSubmit={sendEmailConfirmation}>
              <label className="field">
                <span>Payment Type</span>
                <select
                  value={selectedPaymentId}
                  onChange={(e) => setSelectedPaymentId(e.target.value)}
                  required
                >
                  <option value="">Select Payment</option>
                  {paymentSetups.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.type} - {p.amount} BDT
                      {p.type === "Semester Fee"
                        ? ` (${p.year} - ${p.semester})`
                        : " (All Students)"}
                    </option>
                  ))}
                </select>
              </label>
              <Input
                label="Registered Email"
                value={currentUser.email}
                onChange={() => {}}
                type="email"
                required
              />
              <Input
                label="Amount"
                value={selectedPayment?.amount || ""}
                onChange={() => {}}
                type="number"
                required
              />
              <Input
                label="Mobile Banking Number"
                value={mobileNumber}
                onChange={setMobileNumber}
                placeholder="01XXXXXXXXX"
                required
              />
              <Input
                label="PIN"
                value={pin}
                onChange={setPin}
                type="password"
                showPasswordToggle
                required
              />
              {msg && <p className={msg.includes("success") ? "success" : "error"}>{msg}</p>}
              <Button type="submit">Done Payment</Button>
            </form>
          </div>
        </section>
      )}
      {step === "email" && (
        <section className="email-confirm-box">
          <div className="email-icon"><Mail size={46} /></div>
          <h1>Confirm Your Email</h1>
          <p>A payment confirmation link has been sent to your registered email.</p>
          <strong>{currentUser.email}</strong>
          <button onClick={confirmEmailAndCompletePayment}>Confirm Email Verification</button>
          <Button variant="outline" onClick={() => setStep("payment")}>Back to Payment</Button>
        </section>
      )}
      {step === "success" && (
        <section className="payment-success-box">
          <div className="success-icon"><CheckCircle size={58} /></div>
          <h1>Payment Done</h1>
          <p>Your payment has been completed successfully.</p>
          <div className="success-details">
            <div><span>Payment Type</span><strong>{pendingPayment?.type}</strong></div>
            <div><span>Amount</span><strong>{pendingPayment?.amount} BDT</strong></div>
            <div><span>Email</span><strong>{currentUser.email}</strong></div>
            <div><span>Paid Time</span><strong>{new Date(pendingPayment?.paidAt).toLocaleString()}</strong></div>
          </div>
          <Button onClick={resetPayment}>View Updated Payment Status</Button>
        </section>
      )}
      {step === "list" && (
        <>
          <section className="payment-overview">
            <div>
              <span className="badge">Payment</span>
              <h1>Payment Status</h1>
              <p>View your payment history and complete new payments.</p>
            </div>
            <Button onClick={startPayment}>Make Payment</Button>
          </section>

          {msg && <p className={msg.includes("success") ? "success" : "error"}>{msg}</p>}

          <section className="payment-summary-grid">
            <Card title="Total Paid" subtitle={`${totalPaid} BDT`} />
            <Card title="Paid Records" subtitle={`${paidPayments.length}`} />
            <Card title="Available Payments" subtitle={`${paymentSetups.length}`} />
            <Card title="Registered Email" subtitle={currentUser.email} />
          </section>

          <section className="grid two">
            {myPayments.length === 0 ? (
              <Card title="No payment record" subtitle="No payment information has been found for your account." />
            ) : (
              myPayments.map((payment) => (
                <Card
                  key={payment.id}
                  title={`${payment.type} - ${payment.status}`}
                  subtitle={`Amount: ${payment.amount} BDT\nMethod: ${payment.method || "N/A"}\nPaid Time: ${
                    payment.paidAt ? new Date(payment.paidAt).toLocaleString() : "N/A"
                  }`}
                />
              ))
            )}
          </section>
        </>
      )}
    </main>
  );
}