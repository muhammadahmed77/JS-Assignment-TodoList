import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAAcT-CGmCYtYnTFGW4zsBOMZ857pUvyIE",
  authDomain: "todo-list-d3483.firebaseapp.com",
  projectId: "todo-list-d3483",
  storageBucket: "todo-list-d3483.firebasestorage.app",
  messagingSenderId: "754458844203",
  appId: "1:754458844203:web:8fbb1f1a44a4939c011e6e",
  measurementId: "G-P4T645KT2X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs, addDoc, deleteDoc, doc, updateDoc };