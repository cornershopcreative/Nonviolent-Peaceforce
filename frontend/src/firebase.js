import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqKusDaO45WzAxB1B5dXV0VAx4nwU47X8",
  authDomain: "dssd-np.firebaseapp.com",
  projectId: "dssd-np",
  storageBucket: "dssd-np.firebasestorage.app",
  messagingSenderId: "219366802033",
  appId: "1:219366802033:web:18e994a53ecd9eeca891d0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
