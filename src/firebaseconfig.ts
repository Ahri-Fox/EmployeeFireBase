import { initializeApp } from "firebase/app";

// Cấu hình Firebase (lấy từ Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyBgERzVjMeJD5Aq0_dGN9c0anK-392S894",
  authDomain: "employee-faafc.firebaseapp.com",
  projectId: "employee-faafc",
  storageBucket: "employee-faafc.firebasestorage.app",
  messagingSenderId: "74012223852",
  appId: "1:74012223852:web:25d5fd7eb4280c7f796b49",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
export default app;
