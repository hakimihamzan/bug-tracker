import { auth, firebaseUtils, Timestamp, db, changeNumberToBeAssigned } from "./component/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { callingApi, emptyGitRepoList, githubRepoList } from "./component/github-api.js";

//check loggedin users
isUserLoggedIn();

// sidebar nav buttons behavior
let allSideButton = document.querySelectorAll(".side-btn");
//adding click listener to each sidebar button and added color
allSideButton.forEach((i, idx) => {
  i.addEventListener("click", () => {
    firebaseUtils.removeClassNameFromNodes(allSideButton, "select");
    i.classList.add("select");
    changeNumberToBeAssigned(i.getAttribute("data-id"));
  });
});

// demo sign in button dropdown
let isDemoDropHidden = true;
let demoButton = document.querySelector(".demo");
demoButton.addEventListener("click", () => {
  if (isDemoDropHidden) {
    document.querySelector(".demo-popup").style.visibility = "visible";
    isDemoDropHidden = false;
  } else {
    document.querySelector(".demo-popup").style.visibility = "hidden";
    isDemoDropHidden = true;
  }
});
window.onclick = function (event) {
  // handling click outside of demo drop-down
  if (!event.target.matches(".demo")) {
    document.querySelector(".demo-popup").style.visibility = "hidden";
    isDemoDropHidden = true;
  }

  // handling modal clicked outside during add a bug
  if (event.target.matches(".modal-show")) {
    document.querySelector(".modal-show").style.transform = "translateY(-150%)";
    // document.body.style.overflowY = "scroll";
    document.querySelector(".modal-space").classList.remove("modal-anim");
    document.querySelector("input.title").value = "";
    document.querySelector("span.input").innerText = "";
    document.querySelector(".github").classList.remove("github-space");
    document.querySelector(".api").style.transform = "translateY(-500%)";
    document.querySelector(".search-result").style.overflowY = "hidden";
    document.querySelector(".search-result").innerHTML = "";
    searchGitInput.value = "";
    emptyGitRepoList();
  }

  if (!event.target.matches("span.input")) {
    if (document.querySelector("span.input").innerText.length < 1) {
      document.querySelector("span.input + label").style.transform = "translateY(0)";
    }
  }

  if (!event.target.matches(".title")) {
    if (document.querySelector(".title").value.length < 1) {
      document.querySelector(".form-control input + label").style.transform = "translateY(0)";
    }
  }

  if (event.target.matches(".modal-more-info")) {
    document.querySelector(".modal-more-info").style.transform = "translateX(400%)";
    location.href = location.origin + location.pathname;
  }
};

// login & logout behavior
let login = document.querySelector(".login button");
let logout = document.querySelector(".logout");
let loginInfo = document.querySelector(".login-info");
let userGreetings = document.querySelector(".user-greet");

//changing the dom based on state of user's login, checking if already existing users

function isUserLoggedIn() {
  onAuthStateChanged(auth, (user) => {
    if (user != null) {
      document.getElementById("app").style.transform = "translateY(1rem)";
      document.querySelector(".add-bug").style.transform = "translateY(-40px)";
      document.querySelector(".add-bug").style.visibility = "visible";
      demoButton.style.visibility = "hidden";
      if (user.displayName != null) {
        console.log("hello " + user.displayName);
        userGreetings.innerHTML = `Hello, ${user.displayName}`;
        changeLogInOutBtnVisibility(login, loginInfo, logout, true);
      } else {
        console.log("hello " + user.email);
        userGreetings.innerHTML = `Hello, ${user.email}`;
        changeLogInOutBtnVisibility(login, loginInfo, logout, true);
      }
      document.querySelector("button.update").enabled = "true";
      document.querySelector("button.update").enabled = "true";
    } else {
      document.getElementById("app").style.transform = "translateY(0)";
      document.querySelector(".add-bug").style.transform = "translateY(10px)";
      document.querySelector(".add-bug").style.visibility = "hidden";
      console.log("no user loggedin");
      userGreetings.innerHTML = "";
      demoButton.style.visibility = "visible";
      changeLogInOutBtnVisibility(login, loginInfo, logout, false);
      document.querySelector("button.delete").disabled = "true";
      document.querySelector("button.update").disabled = "true";
    }
  });
}
// util function to change login/logout element based on user's loggedin
function changeLogInOutBtnVisibility(login, loginInfo, logout, isHideTwoElement) {
  if (isHideTwoElement) {
    login.style.visibility = "hidden";
    loginInfo.style.visibility = "hidden";
    logout.style.visibility = "visible";
  } else {
    login.style.visibility = "visible";
    loginInfo.style.visibility = "visible";
    logout.style.visibility = "hidden";
  }
}

login.addEventListener("click", () => {
  // google pop up with token
  firebaseUtils.signInWithPopup();
  // change the dom after login
  isUserLoggedIn();
});

// remove signed in token
logout.addEventListener("click", () => {
  firebaseUtils.signOut();
  // change the dom after logout
  isUserLoggedIn();
});

// --------------
// managerDemo can CRUD, devDemo can CRU
let managerDemo = {
  email: "manager@goo.com",
  password: "passwordtest",
};
let developerDemo = {
  email: "dev@goo.com",
  password: "passwordtest",
};

// demo account sign in
document.querySelector(".dev").addEventListener("click", () => {
  firebaseUtils.signInWithEmailAndPassword(developerDemo.email, developerDemo.password);
});
document.querySelector(".manager").addEventListener("click", () => {
  firebaseUtils.signInWithEmailAndPassword(managerDemo.email, managerDemo.password);
});

//submit a bug
let addBug = document.querySelector(".add-bug");

addBug.addEventListener("click", () => {
  window.scroll({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
  document.querySelector(".modal-show").style.transform = "translateY(0)";
  document.querySelector(".modal-show").style.position = "fixed";
  document.querySelector(".modal-space").classList.add("modal-anim");
});

// animate text inside
let title = document.querySelector(".form-control input");
title.addEventListener("focus", () => {
  document.querySelector(".form-control input + label").style.transform = "translateY(-40px)";
  document.querySelector("input.title").style.border = "0";
  document.querySelector("span.input").style.border = "0";
});

let desc = document.querySelector("span.input");
desc.addEventListener("focus", () => {
  document.querySelector("span.input + label").style.transform = "translateY(-40px)";
  document.querySelector("input.title").style.border = "0";
  document.querySelector("span.input").style.border = "0";
});

function handleGitHubResult() {
  if (!isGithubAPIon) {
    document.querySelector(".github").classList.add("github-space");
    document.querySelector(".api").style.transform = "translateY(0)";
    isGithubAPIon = true;
    // optionalGithubSuggestion.removeEventListener("click", handleGitHubResult);
  } else {
    isGithubAPIon = false;
    document.querySelector(".github").classList.remove("github-space");
    document.querySelector(".api").style.transform = "translateY(-500%)";
    // optionalGithubSuggestion.addEventListener("click", handleGitHubResult);
  }
}

let isGithubAPIon = false;
let optionalGithubSuggestion = document.querySelector(".optional");
optionalGithubSuggestion.addEventListener("click", handleGitHubResult);

let searchGitInput = document.querySelector(".api-input");
// git api
let searchGitBtn = document.querySelector(".search-icon");
searchGitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // console.log(searchGitInput.value);
  document.querySelector(".search-result").style.overflowY = "scroll";
  callingApi(searchGitInput.value);
});

document.querySelector(".close-icon").addEventListener("click", () => {
  isGithubAPIon = false;
  document.querySelector(".github").classList.remove("github-space");
  document.querySelector(".api").style.transform = "translateY(-500%)";
  document.querySelector(".search-result").style.overflowY = "hidden";
  document.querySelector(".search-result").innerHTML = "";
  searchGitInput.value = "";
});

let submitBugButton = document.querySelector(".submit-bug-btn");
submitBugButton.addEventListener("click", (e) => {
  e.preventDefault();
  let title = document.querySelector("input.title").value;
  let desc = document.querySelector("span.input").innerText;
  if (title != "" && desc != "") {
    let username;
    onAuthStateChanged(auth, (user) => {
      username = user.displayName != null ? user.displayName : user.email;
      console.log(username);
      firebaseUtils.addDoc("unassigned", "", Timestamp.now(), desc, username, title, "high", "submitted", githubRepoList);
      document.querySelector("input.title").value = "";
      document.querySelector("span.input").innerText = "";
    });
    // eventually remove modal
    document.querySelector(".modal-show").style.transform = "translateY(-150%)";
    document.querySelector(".modal-space").classList.remove("modal-anim");
  } else if (title == "" || desc == "") {
    document.querySelector("input.title").style.border = "2px solid red";
    document.querySelector("span.input").style.border = "2px solid red";
  }
});

window.addEventListener("popstate", () => {
  let currentPath = location.hash.substr(1);
  document.querySelector(".modal-more-info").style.transform = "translateX(0)";
  document.querySelector(".modal-more-info").style.position = "fixed";
  document.querySelector(".modal-more-info").style.overflowY = "scroll";
  document.querySelector(".more-info").setAttribute("data-id", currentPath);
  document.body.style.overflowY = "hidden";
  firebaseUtils.getDoc(currentPath);
});

// only for managerDemo account/ devDemo cant update this field. signifies a deletion
async function deleteThings(uid) {
  const tempRef = doc(db, "bugs", uid);
  await updateDoc(tempRef, {
    deleteBug: true,
  });
  document.querySelector(".modal-more-info").style.transform = "translateX(400%)";
  location.href = location.origin + location.pathname;
}

// only enable deleteButton when 2 people loggedin (admin, managerDemo)
// disable both update and deletebuttons when no user logged in
// devDemo can only update status, priority
// managerDemo can update Status, assign to people & update priority
async function updateThings(uid, status, prio, assignedTo) {
  const tempRef = doc(db, "bugs", uid);
  await updateDoc(tempRef, {
    status: status,
    prio: prio,
    assigned_to: assignedTo,
    deleteBug: null,
  });
  document.querySelector(".modal-more-info").style.transform = "translateX(400%)";
  location.href = location.origin + location.pathname;
}

let deleteBugButton = document.querySelector("button.delete");
deleteBugButton.addEventListener("click", function (e) {
  e.preventDefault();
  let uid = document.querySelector(".more-info").getAttribute("data-id");
  deleteThings(uid);
});

let updateBugButton = document.querySelector("button.update");
updateBugButton.addEventListener("click", (e) => {
  e.preventDefault();
  let uid = document.querySelector(".more-info").getAttribute("data-id");
  let status = document.querySelector("select.selected-status");
  let prio = document.querySelector("select.selected-prio");
  let assigned = document.querySelector("select.selected-assigned");
  updateThings(uid, status.value, prio.value, assigned.value);
});

let getStartedButton = document.querySelector(".get-started");
getStartedButton.addEventListener("click", () => {
  document.querySelector(".get-started-guide").style.transform = "translateY(0)";
  document.body.style.overflowY = "hidden";
});

let closeGetStarted = document.querySelector(".close");
closeGetStarted.addEventListener("click", () => {
  document.querySelector(".get-started-guide").style.transform = "translateY(500%)";
  document.body.style.overflowY = "scroll";
});
