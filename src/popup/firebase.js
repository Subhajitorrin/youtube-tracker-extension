// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCgnjdC8qWFJkvX7g19zDzdfV6LUKg2flU",
    authDomain: "orrintube-a000a.firebaseapp.com",
    projectId: "orrintube-a000a",
    storageBucket: "orrintube-a000a.appspot.com",
    messagingSenderId: "748053546368",
    appId: "1:748053546368:web:973b8b863632173e8e2d65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
export { app, auth,db }