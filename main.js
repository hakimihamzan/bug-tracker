import { auth, firebaseUtils, Timestamp } from "./component/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

//call for initial data
firebaseUtils.onSnapshot();

// sidebar nav buttons behavior
let allSideButton = document.querySelectorAll(".side-btn");
//adding click listener to each sidebar button and added color
for (let i = 0; i < allSideButton.length; i++) {
  let button = allSideButton[i];
  button.addEventListener("click", () => {
    firebaseUtils.removeClassNameFromNodes(allSideButton, "select");
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
window.onclick = function (event) {
  // handling click outside of demo drop-down
  if (!event.target.matches(".demo")) {
    document.querySelector(".demo-popup").style.visibility = "hidden";
    isDemoDropHidden = true;
  }

  // handling modal clicked outside during add a bug
  if (event.target.matches(".modal-show")) {
    document.querySelector(".modal-show").style.transform = "translateY(-150%)";
    document.querySelector(".modal-space").classList.remove("modal-anim");
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
      document.getElementById("app").style.transform = "translateY(1rem)";
      document.querySelector(".add-bug").style.transform = "translateY(-40px)";
      document.querySelector(".add-bug").style.opacity = "100";
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
    } else {
      document.querySelector(".add-bug").style.transform = "translateY(10px)";
      document.querySelector(".add-bug").style.opacity = "0";
      document.querySelector(".add-bug").style.visibility = "hidden";
      document.getElementById("app").style.transform = "translateY(0)";
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
  document.querySelector(".modal-show").style.transform = "translateY(0)";
  document.querySelector(".modal-space").classList.add("modal-anim");
});
