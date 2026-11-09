import { createContext, useContext, useEffect, useState } from "react";
import {
  db,
  firebaseReady,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "../firebase/firebase";
import { useAuth } from "./AuthContext";

const DataContext = createContext(null);

const emptyStore = {
  users: [],
  notices: [],
  routines: [],
  materials: [],
  assignments: [],
  submissions: [],
  payments: [],
  classUpdates: [],
  activities: []
};

export function DataProvider({ children }) {
  const { currentUser } = useAuth();
  const [store, setStore] = useState(emptyStore);

  useEffect(() => {
    if (!firebaseReady || !currentUser) {
      setStore(emptyStore);
      return;
    }

    const names = [
      "users",
      "notices",
      "routines",
      "materials",
      "assignments",
      "submissions",
      "payments",
      "classUpdates",
      "activities"
    ];

    const unsubs = names.map((name) => {
      const q = query(collection(db, name), orderBy("createdAt", "desc"));
      return onSnapshot(
        q,
        (snap) => {
          setStore((prev) => ({
            ...prev,
            [name]: snap.docs.map((d) => ({ id: d.id, ...d.data() }))
          }));
        },
        () => {
          const fallbackUnsub = onSnapshot(collection(db, name), (snap) => {
            setStore((prev) => ({
              ...prev,
              [name]: snap.docs.map((d) => ({ id: d.id, ...d.data() }))
            }));
          });
          return fallbackUnsub;
        }
      );
    });

    return () => unsubs.forEach((u) => u && u());
  }, [currentUser]);

  async function addItem(collectionName, data) {
    if (!firebaseReady) throw new Error("Firebase config missing.");
    const ref = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return ref.id;
  }

  async function updateItem(collectionName, id, data) {
    if (!firebaseReady) throw new Error("Firebase config missing.");
    await updateDoc(doc(db, collectionName, id), {
      ...data,
      updatedAt: serverTimestamp()
    });
  }

  async function deleteItem(collectionName, id) {
    if (!firebaseReady) throw new Error("Firebase config missing.");
    await deleteDoc(doc(db, collectionName, id));
  }

  async function addActivity(title, description, role = currentUser?.role) {
    if (!firebaseReady || !currentUser) return;
    await addItem("activities", {
      userUid: currentUser.uid,
      role,
      title,
      description
    });
  }

  return (
    <DataContext.Provider value={{ store, addItem, updateItem, deleteItem, addActivity }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
