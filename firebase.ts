// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPfmOxCwosGySvIbtHJmDu1e8jQekpwM4",
  authDomain: "signupnetflix-b115c.firebaseapp.com",
  projectId: "signupnetflix-b115c",
  storageBucket: "signupnetflix-b115c.appspot.com",
  messagingSenderId: "515767951109",
  appId: "1:515767951109:web:00113c7b3c196106e3a16c",
  measurementId: "G-ZBXF6X2C7C"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()

export default app
export { auth, db }