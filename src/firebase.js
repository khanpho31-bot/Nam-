import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
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

// บีบอัดรูปภาพก่อนแปลงเป็น base64 เพื่อไม่ให้เกิน 1MB
export function compressImage(file, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

