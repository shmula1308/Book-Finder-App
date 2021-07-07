const app = {
  baseURL: "https://www.googleapis.com/books/v1/volumes?q=search+terms",

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
        app.searchBooks();
        app.addBooksPageUI();
        break;
    }
  },
  createLibrary: () => {
    let form = document.querySelector(".create-library__form");
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
    });
  },
  searchBooks: () => {
    const searchInput = document.getElementById("search-input");
    const searchForm = document.getElementById("search-form");
    console.log(searchForm);
    searchForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      let url = `https://www.googleapis.com/books/v1/volumes?q=${searchInput.value}`;
      let req = new Request(url, {
        method: "GET",
        mode: "cors",
      });

      fetch(req)
        .then((resp) => resp.json())
        .then(app.displayBooks)
        .catch(app.err);
    });
  },

  displayBooks: (result) => {
    console.log("items", result.items);
    const displayBooksContainer = document.querySelector(
      ".display-books-container"
    );

    let df = new DocumentFragment();

    result.items.forEach((data) => {
      let b = app.prepareBookData(data);
      let book = document.createElement("div");
      book.classList.add("book");
      book.innerHTML = `
      <div class="book__thumbnail">
        <img src=${b.thumbnail} width='140px' alt="Book Thumbnail">
        <button class='btn btn--add-item'><i class="fas fa-plus-circle"></i>Add Item</button>
      </div>
      <div class="book__info">
        <h4 class="book__title">${data.volumeInfo.title}</h4>
        <span class="book__author">${data.volumeInfo.authors.join("\n")}</span>
        <div class="book__data">
          <span class="book__year">${b.datePublished}</span>
          <span class="book__pages">${b.pages}</span>
          <span class="book__publisher">${b.publisher}</span>
          <span class="book__isbn13">ISBN-10: ${
            !b.isbn[0] ? "" : b.isbn[0].identifier
          }</span>
          <span class="book__isbn10">ISBN-13: ${
            !b.isbn[1] ? "" : b.isbn[1].identifier
          }</span>
        </div>
        <p class="book__description">${b.description}</p>
      </div>`;

      df.append(book);
    });
    console.log("hello");
    displayBooksContainer.innerHTML = "";
    displayBooksContainer.append(df);
  },

  prepareBookData: (book) => {
    let bookObj = {
      thumbnail:
        book.volumeInfo.imageLinks === undefined
          ? ""
          : book.volumeInfo.imageLinks.thumbnail,
      datePublished:
        book.volumeInfo === undefined ? "" : book.volumeInfo.publishedDate,
      pages: book.volumeInfo === undefined ? "" : book.volumeInfo.pageCount,
      publisher: book.volumeInfo === undefined ? "" : book.volumeInfo.publisher,
      isbn:
        book.volumeInfo.industryIdentifiers === undefined
          ? ""
          : book.volumeInfo.industryIdentifiers,
      description:
        book.volumeInfo.description === undefined
          ? "no description available"
          : book.volumeInfo.description,
    };
    return bookObj;
  },

  showLoading: () => {},

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

  err: (error) => {
    console.log(error.message);
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
