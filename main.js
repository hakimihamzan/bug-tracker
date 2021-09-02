import { auth, firebaseUtils, Timestamp } from "./component/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// sidebar nav buttons behavior
// removing class names from list of nodes
function removeClassNameFromNodes(allItems, classNameToRemove) {
  for (let i = 0; i < allItems.length; i++) {
    allItems[i].classList.remove(classNameToRemove);
  }
}

let allSideButton = document.querySelectorAll(".side-btn");

//adding click listener to each sidebar button and added color
for (let i = 0; i < allSideButton.length; i++) {
  let button = allSideButton[i];
  button.addEventListener("click", () => {
    removeClassNameFromNodes(allSideButton, "select");
    button.classList.add("select");
  });
}

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
// handling click outside of demo drop-down
window.onclick = function (event) {
  if (!event.target.matches(".demo")) {
    document.querySelector(".demo-popup").style.visibility = "hidden";
    isDemoDropHidden = true;
  }
};

// login & logout behavior
let login = document.querySelector(".login button");
let logout = document.querySelector(".logout");
let loginInfo = document.querySelector(".login-info");
let userGreetings = document.querySelector(".user-greet");

isUserLoggedIn();

//changing the dom based on state of user's login, checking if already existing users
function isUserLoggedIn() {
  onAuthStateChanged(auth, (user) => {
    if (user != null) {
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
    } else {
      console.log("no user loggedin");
      userGreetings.innerHTML = "";
      demoButton.style.visibility = "visible";
      changeLogInOutBtnVisibility(login, loginInfo, logout, false);
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

logout.addEventListener("click", () => {
  // remove signed in token
  firebaseUtils.signOut();
  // change the dom after logout
  isUserLoggedIn();
});

// --------------
// manager and developer can only CRU but not delete - real manager can delete
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

let a = "dummyedited2";
let clos = "";
let creat = Timestamp.now();
let desc = "edit sidebar please1";
let githu = "https://github.com/hakimihamzan/threeJS";
let submitr = "mr man";
let title = "sidebar sucks2";
let uid = "6BBYVXknuKi6uNpSgsMf";

// firebaseUtils.addDoc(a, clos, creat, desc, githu, submitr, title);
// firebaseUtils.onSnapshot();
// firebaseUtils.deleteDoc("cCy3bcytFYaJUobI0UHm");
// firebaseUtils.updateDoc(a, clos, creat, desc, githu, submitr, title, uid);

// submitter can create tickets and get tickets -- subscribe to tickets - checked
// developer can subscribe, create, update - checked
// project manager can crud - checked

// signing in --demo accounts
// firebaseUtils.signInWithEmailAndPassword(managerDemo.email, managerDemo.password);
