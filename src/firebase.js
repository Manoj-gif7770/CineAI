// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBq45aCWuVzSR3p7_X50nbCTDoO5P7qo2M",
    authDomain: "cineai-2a2b9.firebaseapp.com",
    projectId: "cineai-2a2b9",
    storageBucket: "cineai-2a2b9.firebasestorage.app",
    messagingSenderId: "285341296796",
    appId: "1:285341296796:web:b76dff468e17bc8130e559",
    measurementId: "G-Y1PKL93JWH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);