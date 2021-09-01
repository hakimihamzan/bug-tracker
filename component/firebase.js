import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithRedirect, signOut, createUserWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { collection, doc, onSnapshot, deleteDoc, getDocs, getFirestore, addDoc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIMvU2eCe1yIx6pI2fYDwkh58gHtzm6Co",
  authDomain: "bug-tracker-b45c7.firebaseapp.com",
  projectId: "bug-tracker-b45c7",
  storageBucket: "bug-tracker-b45c7.appspot.com",
  messagingSenderId: "898623931961",
  appId: "1:898623931961:web:e583f553ce056cfb822fe8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// first thing first -- allow google sign-in in authentication firebase
const provider = new GoogleAuthProvider();

function signInWithPopupMain() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      console.log(token);
      // The signed-in user info.
      const user = result.user;
      console.log(user);
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
}

function signOutMain() {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
}

let firebaseUtils = {
  //   //checking if user logged in or not
  //   onAuthStateChanged: () => {
  //     let isLoggedin = false;
  //     onAuthStateChanged(auth, (user) => {
  //       if (user != null) {
  //         console.log("logged in: " + user.displayName);
  //         isLoggedin = true;
  //       } else {
  //         console.log("no user");
  //         isLoggedin = false;
  //       }
  //       return isLoggedin;
  //     });
  //   },
  signInWithPopup: signInWithPopupMain,
  signOut: signOutMain,
};

export { firebaseUtils, auth };
