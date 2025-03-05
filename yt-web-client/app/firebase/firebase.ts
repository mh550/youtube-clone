// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  User,
  UserCredential
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCm6z0_HMabNYv-srf9_hLg6TPbWonEgew",
  authDomain: "yt-clone-demo.firebaseapp.com",
  projectId: "yt-clone-demo",
  appId: "1:67546736160:web:43c6d9ccc6fef42a6ffe45"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();

/**
 * Signs the user in with a Google popup.
 * @returns a promise that resolves with the user's credentials.
 */
export function signInWithGoogle(): Promise<UserCredential> {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

/**
 * Signs the user out.
 * @returns a promise that resolves when the user is signed out.
 */
export function signOut(): Promise<void> {
  return auth.signOut();
}

/**
 * Trigger a callback when user auth state changes.
 * @returns A function to unsubscribe callback.
 */
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}