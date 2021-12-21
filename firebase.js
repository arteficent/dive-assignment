import firebase from "firebase";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvB5znLOuO30HR8URt4KQH8UXhyBRONtQ",
  authDomain: "diveassignment-bc30d.firebaseapp.com",
  projectId: "diveassignment-bc30d",
  storageBucket: "diveassignment-bc30d.appspot.com",
  messagingSenderId: "28944741380",
  appId: "1:28944741380:web:0f18ae1b58a66e5f03f151",
  measurementId: "G-D6LK23S4NP"
};
  

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {db, auth, provider};