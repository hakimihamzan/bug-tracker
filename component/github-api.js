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
        console.log(githubRepoList);

        addGitBtn.style.visibility = "hidden";

        let convertedList = githubRepoList.map((item, i) => {
          return `<a href="${item}" target="_blank">Repo: #${i}</a>`;
        });

        document.querySelector(".optional").innerHTML = `
            <div class="dropdown">
              <div class="dropbtn">
                <div>GIT REPO ADDED: ${githubRepoList.length}</div>
                <div class="dispose-git"><i style="font-size: 1.3rem;" class="far fa-trash-alt filter-grey"></i></div>
              </div>
              <div class="dropdown-content">
              ${convertedList.join(" ")}
              </div>
            </div> 
        `;

        document.querySelector(".dispose-git").addEventListener("click", emptyGitRepoList);
      });
    });
    //   debugger;
  }

  fetch(apiEndpoint + queryString, httpOptions)
    .then(downloadRes)
    .then(handleData);
}

function emptyGitRepoList() {
  githubRepoList = [];
  document.querySelector(".optional").innerHTML = `
    <i>Optional</i> - suggest a GitHub repo to help solve <i class="fas fa-plus ml-5"></i>
  `;
  console.log(githubRepoList);
}

export { callingApi, githubRepoList, emptyGitRepoList };
