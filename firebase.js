import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4FdbW_vbv9arM3reWwHhJdLk7_J169E0",
  authDomain: "sarisa-matcha.firebaseapp.com",
  projectId: "sarisa-matcha",
  storageBucket: "sarisa-matcha.firebasestorage.app",
  messagingSenderId: "405203449829",
  appId: "1:405203449829:web:44e1cc523db82b57dae10c",
  measurementId: "G-2G7H703NMK",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ทำหน้าตาให้เหมือน window.storage เดิม เพื่อสลับใช้ง่าย
export const storage = {
  async get(key) {
    const ref = doc(db, "storage", key);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { key, value: snap.data().value };
  },
  async set(key, value) {
    const ref = doc(db, "storage", key);
    await setDoc(ref, { value });
    return { key, value };
  },
  async delete(key) {
    const ref = doc(db, "storage", key);
    await deleteDoc(ref);
    return { key, deleted: true };
  },
  async list(prefix = "") {
    const snap = await getDocs(collection(db, "storage"));
    const keys = snap.docs
      .map((d) => d.id)
      .filter((k) => k.startsWith(prefix));
    return { keys };
  },
};
