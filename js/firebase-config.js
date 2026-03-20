// ============================================
// FIREBASE CONFIGURATION
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAKLKLV7VL5sIa5jyZHaD4Ki4jyYFaRdBE",
  authDomain: "jarque-portfolio.firebaseapp.com",
  projectId: "jarque-portfolio",
  storageBucket: "jarque-portfolio.firebasestorage.app",
  messagingSenderId: "786205583293",
  appId: "1:786205583293:web:99c64044dcd205769ad4d4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Cloudinary config
const CLOUDINARY_CLOUD = 'dvbtqd57y';
const CLOUDINARY_PRESET = 'portfolio_upload';

// Upload file to Cloudinary
async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/upload`, {
    method: 'POST', body: formData
  });
  const data = await res.json();
  return data.secure_url;
}

export { db, doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc, updateDoc, uploadToCloudinary };
