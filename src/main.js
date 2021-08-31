let allSideButton = document.querySelectorAll(".side-btn");

for (let i = 0; i < allSideButton.length; i++) {
  let button = allSideButton[i];
  button.addEventListener("click", () => {
    removeClassNameFromNodes(allSideButton, "select");
    button.classList.add("select");
  });
}

function removeClassNameFromNodes(allItems, classNameToRemove) {
  for (let i = 0; i < allItems.length; i++) {
    allItems[i].classList.remove(classNameToRemove);
  }
}
