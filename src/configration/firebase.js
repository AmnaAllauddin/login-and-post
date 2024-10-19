import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQPjcTyBtyCnUv1MTwFlGzf-yFog-l9FQ",
  authDomain: "test-3af17.firebaseapp.com",
  projectId: "test-3af17",
  storageBucket: "test-3af17.appspot.com",
  messagingSenderId: "186107718940",
  appId: "1:186107718940:web:256784981d5dcb64421ed9",
  measurementId: "G-LRR5TJ8WZ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const database = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider(); // Keep this for later use

export { auth, provider, database, storage };
