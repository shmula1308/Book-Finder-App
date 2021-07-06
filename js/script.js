const app = {
  init: () => {
    document.addEventListener("DOMContentLoaded", app.getSelectedPage);
  },
  getSelectedPage: () => {
    let page = document.body.id;
    switch (page) {
      case "librariesPage":
        app.setStore();
        app.getStore();
        break;
      case "createLibraryPage":
        app.createLibrary();
        break;
      case "addBooksPage":
        app.addBooks();
        break;
    }
  },
  createLibrary: () => {
    let form = document.querySelector(".create-library__form");
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
    });
  },

  addBooks: () => {
    const addMethod = app.addBooksPageUI();
  },

  addBooksPageUI: () => {
    let searchMethodBtn = "isbn";
    let addBooksMethod = "search";
    // Select button container (Search / Manual Entry Buttons)
    const addBooksMethodButtons = document.querySelector(".add-books__list");
    addBooksMethodButtons.addEventListener("click", (ev) => {
      const clickedButton = ev.target.closest("button");
      if (clickedButton) {
        //Remove highlight from previously selected button
        addBooksMethodButtons
          .querySelector(".active")
          .classList.remove("active");
        //highlight currently selected button
        clickedButton.classList.add("active");
      } else {
        return;
      }
      //Change display depending on which button was clicked (search or manual button)
      // document.querySelector('.add-books__form').
      if (clickedButton.id === "manualBtn") {
        // Remove Search Form
        const searchForm = document.getElementById("search");
        searchForm.style.display = "none";
        //Remove book display
        const bookDisplay = document.querySelector(".display-books-container");
        bookDisplay.style.display = "none";
        //Show Manual Entry Form
        const manualEntryForm = document.querySelector(".manual-entry-form");
        manualEntryForm.style.display = "block";
      }
      if (clickedButton.id === "searchBtn") {
        // Show Search Form
        const searchForm = document.getElementById("search");
        searchForm.style.display = "block";
        //Show book display
        const bookDisplay = document.querySelector(".display-books-container");
        //Clear book display
        bookDisplay.innerHTML = "";
        bookDisplay.style.display = "block";
        //Remove Manual Entry Form
        const manualEntryForm = document.querySelector(".manual-entry-form");
        manualEntryForm.style.display = "none";
      }
    });

    // Get search method container
    let searchMethodsContainer = document.querySelector(
      ".search-method-container"
    );
    // Listen for click event and grab button that was clicked
    searchMethodsContainer.addEventListener("click", (ev) => {
      //Change placeholder text and clear input fields
      if (ev.target.id === "keywords") {
        const addBooksInput = document.querySelector(".add-books__form__input");
        addBooksInput.placeholder = "Keywords (Titles,Authors...)";
        addBooksInput.value = null;
      }
      if (ev.target.id === "isbn") {
        const addBooksInput = document.querySelector(".add-books__form__input");
        addBooksInput.placeholder = "ISBN";
        addBooksInput.value = null;
      }
      if (ev.target.closest("input")) {
        //Remove white checkbox from previously selected button
        document.querySelector(".checked").classList.remove("checked");
        // Remove highlight from previously selected button
        document.querySelector(".bg").classList.remove("bg");
        //Add highlight to currently selected button
        ev.target.parentElement.classList.add("bg");
        //Add white chcekbox to currently selected button
        ev.target.previousElementSibling.classList.add("checked");
      }
    });
  },

  setStore: () => {
    console.log("setstore");
  },

  getStore: () => {
    console.log("getstore");
  },
};

app.init();

// const tagInput = document.querySelector(".tag-input");
// function appendTags(tags) {
//   document.querySelector('.tags').innerHTML = "";
//   let df = new DocumentFragment()

//   tags.map(tag => {
//     let span = document.createElement('span');
//     span.classList.add('tag');
//     span.textContent = tag
//     df.append(span)

//   })
//    document.querySelector('.tags').append(df)
// }

// tagInput.addEventListener('keyup', (ev)=> {
//   if(ev.target.value.length === 0) {
//     document.querySelector('.tags').innerHTML = "";
//     return;
//   }
//     tags = ev.target.value.split(",")
//     document.querySelector('.tags').innerHTML = "";
//     appendTags(tags);
//   CODE FOR TAG BUTTONS
// })
