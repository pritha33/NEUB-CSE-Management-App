import { initializeApp } from "firebase/app";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  onAuthStateChanged,
  reload
} from "firebase/auth";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzsvE9G_NXXKb_MfnKu4gusWd3z_Jnryw",
  authDomain: "neub-cse-management-840ae.firebaseapp.com",
  projectId: "neub-cse-management-840ae",
  storageBucket: "neub-cse-management-840ae.firebasestorage.app",
  messagingSenderId: "496700338766",
  appId: "1:496700338766:web:7e8dfdd61818e198f6091f"
};

export const firebaseReady =
  firebaseConfig.apiKey &&
  !firebaseConfig.apiKey.includes("PASTE_YOUR") &&
  firebaseConfig.projectId &&
  !firebaseConfig.projectId.includes("PASTE_YOUR");

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  onAuthStateChanged,
  reload,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp
};