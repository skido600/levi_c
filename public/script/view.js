class view {
  constructor() {
    this.display = document.querySelector("#display");
    this.inputValue = document.querySelector("#input_main");
    this.languageFilter = document.querySelector("#language-filter");
    this.loaderOverlay = document.querySelector(".loader-overlay");
    this.searchButton = document.querySelector("#search_button");
    this.loader = document.querySelector(".loader");

    this.searchButton.addEventListener("click", this.handleSearch);
    this.inputValue.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        this.handleSearch();
      }
    });

    this.languageFilter.addEventListener("change", this.handleSelect);
  }

  async fetchData() {
    this.showLoader();

    try {
      let response = await fetch("./data.json");
      this.data = await response.json();
      this.displayData(this.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      await this.delay(3000);
      this.hideLoader();
    }
  }
  showLoader() {
    this.loaderOverlay.style.display = "flex";
  }

  hideLoader() {
    this.loaderOverlay.style.display = "none";
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  displayData(data) {
    if (data.length === 0) {
      this.display.innerHTML = `
        <div class="text-center p-6 bg-yellow-100 border border-yellow-300 rounded-md">
          <p class="text-yellow-800">No results found. Please make your search more specific or try different keywords.
           for javascript visit <span class="text-blue-600"><a href="https://javascript.info/">javascript.info</a><span/>
           
          </p>
        </div>
      `;
      // return;
    } else {
      this.display.innerHTML = "";
      data.forEach((item) => {
        let article = document.createElement("article");
        article.className = "bg-white p-6 rounded-lg shadow-md mb-4";

        article.innerHTML = `
              <h4 class="text-xl font-semibold mb-2 cli">
                Tip Title: <span class="font-bold black">${item.title}</span>
              </h4>
              <p class="mb-4 cli">
                Description: <span class="font-bold black">${item.description}</span>
              </p>
              <h6 class="cli">
                Language: <span class="font-bold black">${item.language}</span>
              </h6>
            `;

        this.display.appendChild(article);
      });
    }
  }

  handleSearch = () => {
    let searchTerm = this.inputValue.value.toLowerCase();
    let filteredData = this.data.filter((item) => {
      return (
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.language.toLowerCase().includes(searchTerm)
      );
    });
    this.displayData(filteredData);
  };

  handleSelect = () => {
    let selectedLanguage = this.languageFilter.value.toLowerCase();

    if (selectedLanguage === "") {
      this.displayData(this.data);
    } else {
      let filteredData = this.data.filter((item) => {
        return item.language.toLowerCase() === selectedLanguage;
      });
      this.displayData(filteredData);
    }
  };
}

let viewMe = new view();
viewMe.fetchData();
