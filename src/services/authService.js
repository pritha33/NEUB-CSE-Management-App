import {
  auth,
  db,
  firebaseReady,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  reload,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp
} from "../firebase/firebase";

function checkFirebase() {
  if (!firebaseReady) {
    throw new Error("Firebase is not connected.");
  }
}

function getErrorMessage(error) {
  const code = error?.code || "";

  if (code === "auth/email-already-in-use") {
    return "This email is already registered. Please login or use another email.";
  }

  if (code === "auth/invalid-email") {
    return "Please enter a valid email address.";
  }

  if (code === "auth/weak-password") {
    return "Password is too weak. Use at least 8 characters.";
  }

  if (code === "auth/invalid-credential") {
    return "Invalid email or password.";
  }

  if (code === "auth/wrong-password") {
    return "Incorrect password.";
  }

  if (code === "auth/user-not-found") {
    return "No account found with this email.";
  }

  if (code === "auth/network-request-failed") {
    return "Network problem. Please check your internet connection.";
  }

  if (code === "auth/too-many-requests") {
    return "You cannot login right now. Too many attempts. Please try again later.";
  }

  if (code === "auth/operation-not-allowed") {
    return "Email/password authentication is not enabled in Firebase.";
  }

  if (code === "permission-denied") {
    return "Firestore permission denied. Please check Firestore rules.";
  }

  return error?.message || "Something went wrong. Please try again.";
}

function removeUndefinedFields(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  );
}

export async function registerUser(profile) {
  checkFirebase();

  if (!profile.role) {
    throw new Error(
      "Account role missing. Please select Student, Teacher, or Admin again."
    );
  }

  if (!["student", "teacher", "admin"].includes(profile.role)) {
    throw new Error("Invalid account role.");
  }

  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      profile.email.trim(),
      profile.password
    );

    // Send real Firebase verification email
    await sendEmailVerification(credential.user);

    const cleanProfile = { ...profile };
    delete cleanProfile.password;
    delete cleanProfile.secretCode;

    const userData = removeUndefinedFields({
      ...cleanProfile,
      role: profile.role,
      uid: credential.user.uid,
      email: credential.user.email,
      emailVerified: false,
      accountStatus: "Pending Verification",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    await setDoc(doc(db, "users", credential.user.uid), userData);

    await addDoc(collection(db, "activities"), {
      userUid: credential.user.uid,
      role: profile.role,
      title: "Registered",
      description: `${profile.name} registered. Verification email was sent.`,
      createdAt: serverTimestamp()
    });

    // Force logout after registration
    await signOut(auth);

    return {
      ...userData,
      verificationEmailSent: true
    };
  } catch (error) {
    console.error("Registration error:", error);

    try {
      await signOut(auth);
    } catch (signOutError) {
      console.error("Sign out error:", signOutError);
    }

    throw new Error(getErrorMessage(error));
  }
}

export async function loginUser(email, password) {
  checkFirebase();

  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    await reload(credential.user);

    // Block login if email is not verified
    if (!credential.user.emailVerified) {
      await sendEmailVerification(credential.user);
      await signOut(auth);

      throw new Error(
        "Your email is not verified. A new verification link has been sent to your email. Please verify your email first, then login."
      );
    }

    const snap = await getDoc(doc(db, "users", credential.user.uid));

    if (!snap.exists()) {
      await signOut(auth);
      throw new Error("User profile not found in database.");
    }

    const profile = snap.data();

    await setDoc(
      doc(db, "users", credential.user.uid),
      {
        emailVerified: true,
        accountStatus: "Verified",
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    await addDoc(collection(db, "activities"), {
      userUid: credential.user.uid,
      role: profile.role,
      title: "Logged in",
      description: `${profile.name || credential.user.email} logged in`,
      createdAt: serverTimestamp()
    });

    return {
      ...profile,
      uid: credential.user.uid,
      email: credential.user.email,
      emailVerified: true,
      accountStatus: "Verified"
    };
  } catch (error) {
    console.error("Login error:", error);

    try {
      await signOut(auth);
    } catch (signOutError) {
      console.error("Sign out error:", signOutError);
    }

    throw new Error(getErrorMessage(error));
  }
}

export async function logoutUser() {
  checkFirebase();
  await signOut(auth);
}

export async function resetPassword(email) {
  checkFirebase();

  if (!email) {
    throw new Error("Please enter your email address.");
  }

  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error) {
    console.error("Password reset error:", error);
    throw new Error(getErrorMessage(error));
  }
}

export async function resendVerification() {
  checkFirebase();

  if (!auth.currentUser) {
    throw new Error("No logged-in user found.");
  }

  try {
    await sendEmailVerification(auth.currentUser);
    return true;
  } catch (error) {
    console.error("Resend verification error:", error);
    throw new Error(getErrorMessage(error));
  }
}