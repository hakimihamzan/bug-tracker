import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { onAuthStateChanged, GoogleAuthProvider, getAuth, signOut, signInWithPopup, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { collection, doc, Timestamp, onSnapshot, deleteDoc, getDocs, getDoc, getFirestore, addDoc, updateDoc, limit, orderBy, query, where } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

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
const bugsCollection = collection(db, "bugs");

// first thing first -- allow google sign-in in authentication firebase
const provider = new GoogleAuthProvider();

snapShotListen();

function signInWithPopupMain() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // console.log(token);
      // The signed-in user info.
      const user = result.user;
      // console.log(user);
      location.reload();
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
      location.reload();
    })
    .catch((error) => {
      // An error happened.
    });
}

// --------------------------------------------------

let developersList = ["tilak", "zeeshan", "boss", "boss2", "dev", "goku", "unassigned"];
let statusList = ["completed", "pending", "proceeding", "submitted"];
let prioList = ["high", "medium", "low", "closed"];

function creatingSelectOptionsForAssign(list, data) {
  let assignedValue = data.assigned_to.toLowerCase();
  list.push(assignedValue);
  let newList = [...new Set(list)];
  let returnedList = newList.map((i) => {
    if (i == assignedValue) {
      return `<option selected value="${i}">${capitalizeFirstLetter(i)}</option>`;
    } else {
      return `<option value="${i}">${capitalizeFirstLetter(i)}</option>`;
    }
  });
  return returnedList.join(" ");
}

function creatingSelectOptionsForPrio(list, data) {
  let assignedValue = data.prio.toLowerCase();
  list.push(assignedValue);
  let newList = [...new Set(list)];
  let returnedList = newList.map((i) => {
    if (i == assignedValue) {
      return `<option selected value="${i}">${capitalizeFirstLetter(i)}</option>`;
    } else {
      return `<option value="${i}">${capitalizeFirstLetter(i)}</option>`;
    }
  });
  return returnedList.join(" ");
}

function creatingSelectOptionsForStatus(list, data) {
  let assignedValue = data.status.toLowerCase();
  list.push(assignedValue);
  let newList = [...new Set(list)];
  let returnedList = newList.map((i) => {
    if (i == assignedValue) {
      return `<option selected value="${i}">${i.toUpperCase()}</option>`;
    } else {
      return `<option value="${i}">${i.toUpperCase()}</option>`;
    }
  });
  return returnedList.join(" ");
}

async function readDoc(uid) {
  const docRef = doc(db, "bugs", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let data = docSnap.data();
    document.querySelector(".more-info").innerHTML = `
      <div class="top-row-more-info">
        <div class="outer submitter">
          <label class="submitter-label">Submitter</label>
          <div class="submitter-value">${data.submitter}</div>
        </div>
        <div class="outer assigned">
          <label>Assigned to</label>
        <div class="assigned-value">
          <select class="form-select assigned-value selected-assigned">
            ${creatingSelectOptionsForAssign(developersList, data)}
          </select>
        </div>
        </div>
        <div class="outer created-at">
          <div class="created-at-inner">
            <label>Created at</label>
            <div class="" style="color: midnightblue;">${data.created_at.toDate()}</div>
          </div>
        </div>
        <div class="outer project">
          <img id="" src="img/logo-new.svg" alt="bug tracker logo" />
        </div>
      </div>    
      <div class="outer title">
        <label>Title</label>
        <div class="title-value">${capitalizeFirstLetter(data.title)}</div>
      </div>
      <div class="outer description">
        <label>Description</label>
        <div class="description-value">
        ${capitalizeFirstLetter(data.description)}
        <span style="color: blue;"> # Filler text start -- Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus quae autem sequi maiores ullam? Inventore blanditiis nisi error nulla similique beatae voluptates nobis, provident ex rem? Quam facilis illo doloribus, ipsam sequi .</span>  
        </div>
      </div>
      <div class="bottom-row-more-info">
        <div class="outer status">
          <label>Status</label>
          <select class="form-select ${data.status} selected-status">
          ${creatingSelectOptionsForStatus(statusList, data)}
          </select>
        </div>
        <div class="outer prio">
          <label>Priority</label>
          <select class="form-select ${data.prio} selected-prio">
            ${creatingSelectOptionsForPrio(prioList, data)}
          </select>
        </div>
      </div>
      `;

    onAuthStateChanged(auth, (user) => {
      if (user != null) {
        if (user.email == "dev@goo.com") {
          document.querySelector("button.delete").disabled = "true";
          document.querySelector("select.selected-assigned").disabled = "true";
        }
        if (user.email != "manager@goo.com" && user.email != "dev@goo.com") {
          document.querySelector("button.delete").disabled = "true";
          document.querySelector("select.selected-assigned").disabled = "true";
          document.querySelector("button.update").disabled = "true";
          document.querySelector("select.selected-status").disabled = "true";
          document.querySelector("select.selected-prio").disabled = "true";
        }
      } else {
        let allSelect = document.querySelectorAll("select");
        allSelect.forEach((item) => {
          item.disabled = "true";
        });
      }
    });
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}

async function creatingBug(assigned_to, closed_at, created_at, description, github_repo, submitter, title, prio, status, gitRepoList) {
  try {
    const docRef = await addDoc(bugsCollection, {
      assigned_to: assigned_to,
      closed_at: closed_at,
      created_at: created_at,
      description: description,
      github_repo: github_repo,
      submitter: submitter,
      title: title,
      prio: prio,
      status: status,
      deleteBug: null,
      gitRepoList: gitRepoList,
      bugs: "bugs",
    });

    console.log("Document written with ID: ", docRef.id);
    location.reload();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
function removeClassNameFromNodes(allItems, classNameToRemove) {
  for (let i = 0; i < allItems.length; i++) {
    allItems[i].classList.remove(classNameToRemove);
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function deleteBug(uid) {
  await deleteDoc(doc(db, "bugs", uid));
}

function createTableRow(snapshotChange) {
  let upperCaseStatus = snapshotChange.doc.data().status.toUpperCase();
  let capitalPrio = capitalizeFirstLetter(snapshotChange.doc.data().prio);
  let assigned_to = snapshotChange.doc.data().assigned_to;
  let newTRData = document.createElement("tr");

  newTRData.setAttribute("data-id", snapshotChange.doc.id);

  newTRData.innerHTML = `
      <td>${snapshotChange.doc.data().submitter}</td>
      <td><span class="${snapshotChange.doc.data().status}">${upperCaseStatus}</span> <span data-id="${snapshotChange.doc.id}"class="a-tag">${snapshotChange.doc.data().title}</span> - ${snapshotChange.doc.data().description}</td>
      <td><span class="${snapshotChange.doc.data().prio}">${capitalPrio}</span></td>
      <td> <span class="${assigned_to}">${assigned_to}</span></td>
      <td>Bug Tracker</td>
  `;

  if (snapshotChange.doc.data().deleteBug) {
    newTRData.classList.add("deleted-row");
  }
  return newTRData;
}
let totalNumberOfBug;
function snapShotListen() {
  const q = query(bugsCollection, where("bugs", "==", "bugs"), orderBy("created_at", "desc"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        let newTRData = createTableRow(change);
        document.querySelector("table.data").appendChild(newTRData);
      }
      if (change.type === "modified") {
        // animation purpose
        let allTD = document.querySelectorAll(".td-anim");
        removeClassNameFromNodes(allTD, "td-anim");

        // find the row that is modified
        let oldTRData = document.querySelector(`[data-id='${change.doc.id}']`);
        let parentToReplace = oldTRData.parentElement;

        let newTRData = createTableRow(change);
        newTRData.classList.add("td-anim");
        parentToReplace.replaceChild(newTRData, oldTRData);
      }
      if (change.type === "removed") {
        let tr = document.querySelector(`[data-id='${change.doc.id}']`);
        let allTD = document.querySelectorAll(".td-anim");
        removeClassNameFromNodes(allTD, "td-anim");
        document.querySelector("table.data").removeChild(tr);
      }
    });

    //setting numbers of bug
    document.getElementById("bug-number").innerHTML = snapshot.docs.length;

    let allATag = document.querySelectorAll("span.a-tag");

    allATag.forEach((item) => {
      item.addEventListener("click", (e) => {
        location.href = location.origin + location.pathname + "#" + e.target.dataset.id;
      });
    });
  });
}

async function demoAccountSignIn(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // console.log(userCredential);
      // Signed in
      const user = userCredential.user;
      location.reload();

      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

let firebaseUtils = {
  removeClassNameFromNodes: removeClassNameFromNodes,
  signInWithPopup: signInWithPopupMain,
  signOut: signOutMain,
  addDoc: creatingBug,
  deleteDoc: deleteBug,
  onSnapshot: snapShotListen,
  // updateDoc: updateBug,
  signInWithEmailAndPassword: demoAccountSignIn,
  getDoc: readDoc,
};

export { firebaseUtils, auth, Timestamp, db };
