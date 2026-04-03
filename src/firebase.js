import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore, collection, doc, getDocs, addDoc, updateDoc,
  onSnapshot, query, orderBy, setDoc, serverTimestamp
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmcg7ES3Lb0zlgQvKyxMzpUA3w668DtmY",
  authDomain: "tainan-crm-sales.firebaseapp.com",
  projectId: "tainan-crm-sales",
  storageBucket: "tainan-crm-sales.firebasestorage.app",
  messagingSenderId: "408153689266",
  appId: "1:408153689266:web:18d46a7de91c01517dcdab",
  measurementId: "G-HGWWGFJ8T2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const APP_ID = "tainan-crm-v1";
const ADMIN_ID = "bruce_admin";

export const leadsRef = () =>
  collection(db, "artifacts", APP_ID, "users", ADMIN_ID, "leads");

export const initAuth = (onReady) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) onReady(user);
    else signInAnonymously(auth).catch(console.error);
  });
};

export const fbSetLead = async (id, data) => {
  await setDoc(doc(leadsRef(), String(id)), data);
};

export const fbUpdateLead = async (id, updates) => {
  await updateDoc(doc(leadsRef(), String(id)), {
    ...updates,
    _updated: serverTimestamp()
  });
};

export const fbListenLeads = (callback) => {
  const q = query(leadsRef(), orderBy("capacity", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ ...d.data(), _docId: d.id })));
  });
};
