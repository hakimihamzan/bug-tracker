import { auth, firebaseUtils } from "./component/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// sidabar nav buttons behavior
// removing class names from list of nodes
function removeClassNameFromNodes(allItems, classNameToRemove) {
  for (let i = 0; i < allItems.length; i++) {
    allItems[i].classList.remove(classNameToRemove);
  }
}

let allSideButton = document.querySelectorAll(".side-btn");

//adding click listener to each sidebar button
for (let i = 0; i < allSideButton.length; i++) {
  let button = allSideButton[i];
  button.addEventListener("click", () => {
    removeClassNameFromNodes(allSideButton, "select");
    button.classList.add("select");
  });
}

// login & logout functionality
let login = document.querySelector(".login button");
let logout = document.querySelector(".logout");
let loginInfo = document.querySelector(".login-info");
let userGreetings = document.querySelector(".user-greet");

isUserLoggedIn();

//changing the dom based on state of user's login
function isUserLoggedIn() {
  onAuthStateChanged(auth, (user) => {
    if (user != null) {
      console.log("hello " + user.displayName);
      userGreetings.innerHTML = `Hello, ${user.displayName}`;
      changeLogInOutBtnVisibility(login, loginInfo, logout, true);
    } else {
      console.log("no user loggedin");
      userGreetings.innerHTML = "";
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
