import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { GoogleAuthProvider, getAuth, signOut, signInWithPopup, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { collection, doc, Timestamp, onSnapshot, deleteDoc, getDocs, getFirestore, addDoc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

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
const db = getFirestore(app);

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

// --------------------------------------------------

const bugsCollection = collection(db, "bugs");

async function creatingBug(assigned_to, closed_at, created_at, description, github_repo, submitter, title) {
  try {
    const docRef = await addDoc(bugsCollection, {
      assigned_to: assigned_to,
      closed_at: closed_at,
      created_at: created_at,
      description: description,
      github_repo: github_repo,
      submitter: submitter,
      title: title,
      bugs: "bugs",
    });

    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function deleteBug(uid) {
  await deleteDoc(doc(db, "bugs", uid));
}

function removeClassNameFromNodes(allItems, classNameToRemove) {
  for (let i = 0; i < allItems.length; i++) {
    allItems[i].classList.remove(classNameToRemove);
  }
}

async function snapShotListen() {
  const q = query(collection(db, "bugs"), where("bugs", "==", "bugs"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        console.log("Added something: ", change.doc.data(), change.doc.id);
        let statusH;
        let prio;
        if (change.doc.data().status == "pending") {
          statusH = "PENDING";
        } else if (change.doc.data().status == "submitted") {
          statusH = "SUBMITTED";
        } else if (change.doc.data().status == "inprogress") {
          statusH = "IN PROGRESS";
        } else if (change.doc.data().status == "completed") {
          statusH = "COMPLETED";
        }
        if (change.doc.data().prio == "high") {
          prio = "High";
        } else if (change.doc.data().prio == "medium") {
          prio = "Medium";
        } else if (change.doc.data().prio == "low") {
          prio = "Low";
        }

        const tr = `
        <tr class="td-anim" data-id="${change.doc.id}">
          <td>2</td>
          <td>${change.doc.data().submitter}</td>
          <td><span class="${change.doc.data().status}">${statusH}</span> ${change.doc.data().title} - ${change.doc.data().description}</td>
          <td><span class="${change.doc.data().prio}">${prio}</span></td>
          <td>${change.doc.data().assigned_to}</td>
          <td>1 day ago</td>
        </tr>
        `;

        document.querySelector("table.data").insertAdjacentHTML("beforeend", tr);
      }
      if (change.type === "modified") {
        console.log("Modified something: ", change.doc.data(), change.doc.id);

        let allTD = document.querySelectorAll(".td-anim");
        removeClassNameFromNodes(allTD, "td-anim");

        let statusH;
        let prio;
        if (change.doc.data().status == "pending") {
          statusH = "PENDING";
        } else if (change.doc.data().status == "submitted") {
          statusH = "SUBMITTED";
        } else if (change.doc.data().status == "inprogress") {
          statusH = "IN PROGRESS";
        } else if (change.doc.data().status == "completed") {
          statusH = "COMPLETED";
        }
        if (change.doc.data().prio == "high") {
          prio = "High";
        } else if (change.doc.data().prio == "medium") {
          prio = "Medium";
        } else if (change.doc.data().prio == "low") {
          prio = "Low";
        }

        let oldTRData = document.querySelector(`[data-id='${change.doc.id}']`);
        let parentToReplace = oldTRData.parentElement;

        let newTRData = document.createElement("tr");
        newTRData.classList.add("td-anim");
        newTRData.setAttribute("data-id", change.doc.id);

        newTRData.innerHTML = `
        <tr>
          <td>2</td>
          <td>${change.doc.data().submitter}</td>
          <td><span class="${change.doc.data().status}">${statusH}</span> ${change.doc.data().title} - ${change.doc.data().description}</td>
          <td><span class="${change.doc.data().prio}">${prio}</span></td>
          <td>${change.doc.data().assigned_to}</td>
          <td>1 day ago</td>
        </tr>
        `;

        // const tr = `
        // <tr data-id="${change.doc.id}">
        //   <td>2</td>
        //   <td>${change.doc.data().submitter}</td>
        //   <td><span class="${change.doc.data().status}">STATUS</span> ${change.doc.data().title} - ${change.doc.data().description}</td>
        //   <td><span class="${change.doc.data().prio}">PRIO</span></td>
        //   <td>${change.doc.data().assigned_to}</td>
        //   <td>1 day ago</td>
        // </tr>
        // `;

        parentToReplace.replaceChild(newTRData, oldTRData);
      }
      if (change.type === "removed") {
        console.log("removed something: ", change.doc.data(), change.doc.id);
      }
    });
  });
}

async function updateBug(assigned_to, closed_at, created_at, description, github_repo, submitter, title, uid) {
  const tempRef = doc(db, "bugs", uid);
  await updateDoc(tempRef, {
    assigned_to: assigned_to,
    closed_at: closed_at,
    created_at: created_at,
    description: description,
    github_repo: github_repo,
    submitter: submitter,
    title: title,
    bugs: "bugs",
  });
}

async function demoAccountSignIn(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log(userCredential);
      // Signed in
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

let firebaseUtils = {
  signInWithPopup: signInWithPopupMain,
  signOut: signOutMain,
  addDoc: creatingBug,
  deleteDoc: deleteBug,
  onSnapshot: snapShotListen,
  updateDoc: updateBug,
  signInWithEmailAndPassword: demoAccountSignIn,
};

export { firebaseUtils, auth, Timestamp };
