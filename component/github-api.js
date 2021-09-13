let githubRepoList = [];

function callingApi(searchQuery) {
  let apiEndpoint = "https://api.github.com/search/repositories?";
  let queryString = "q=" + encodeURIComponent(searchQuery);

  let httpOptions = {
    method: "GET",
  };

  function downloadRes(res) {
    return res.json();
  }

  function handleData(data) {
    let resultsArray = data.items;

    resultsArray.forEach((item, idx) => {
      let divResult = document.createElement("div");
      divResult.classList.add("result");
      divResult.innerHTML = `
            <div class="result-text">
                <span class="result-title"><a target="_blank" href="${item.html_url}">${item.full_name}</a></span>
                <span class="result-desc">${item.description}</span>
            </div>
            <div data-id=${item.html_url} class="add-github"><i class="add-git-repo fas fa-plus"></i></div>
    `;

      document.querySelector(".search-result").appendChild(divResult);

      let addGitBtn = divResult.children[1];
      addGitBtn.addEventListener("click", () => {
        let id = addGitBtn.getAttribute("data-id");
        githubRepoList.push(id);
        addGitBtn.style.visibility = "hidden";
        document.querySelector(".optional").style.fontWeight = "800";
        document.querySelector(".optional").style.cursor = "default";

        let convertedList = githubRepoList.map((item, i) => {
          return `<a href="${item}" target="_blank">Repo: #${i}</a>`;
        });

        document.querySelector(".optional").innerHTML = `
            <div class="dropdown">
              <div class="dropbtn">GIT REPO ADDED: ${githubRepoList.length}</div>
              <div class="dropdown-content">
              ${convertedList.join(" ")}
              </div>
            </div> 
        `;
        // document.querySelector(".optional").removeEventListener("click");
      });
    });
    //   debugger;
  }

  fetch(apiEndpoint + queryString, httpOptions)
    .then(downloadRes)
    .then(handleData);
}

export { callingApi, githubRepoList };
