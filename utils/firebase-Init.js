import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyCSnaQNXAjZP6bIa1clbgeLgtyl8lefsDI",
  authDomain: "voisascript-2ae9b-firebase.firebaseapp.com",
  projectId: "voisascript-2ae9b-firebase",
  storageBucket: "voisascript-2ae9b-firebase.appspot.com",
  messagingSenderId: "273565279743",
  appId: "1:273565279743:web:ee59c0342479e89a5ef3ca",
  measurementId: "G-V4YJEW95HZ"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)