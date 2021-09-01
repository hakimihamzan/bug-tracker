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
let loggedIn = false;

let login = document.querySelector(".login button");
let logout = document.querySelector(".logout");
let loginInfo = document.querySelector(".login-info");

login.addEventListener("click", () => {
  loggedIn = true;
  login.style.visibility = "hidden";
  loginInfo.style.visibility = "hidden";
  logout.style.visibility = "visible";
});

logout.addEventListener("click", () => {
  loggedIn = false;
  login.style.visibility = "visible";
  loginInfo.style.visibility = "visible";
  logout.style.visibility = "hidden";
});

let userGreetings = document.querySelector(".user-greet");
