const app = {
  searchMethodBtn: "isbn",
  addBooksMethod: "search",
  libraries: [],

  init: () => {
    document.addEventListener("DOMContentLoaded", app.getSelectedPage);
  },

  getSelectedPage: () => {
    let page = document.body.id;
    switch (page) {
      case "librariesPage":
        app.displayStoredLibraries();
        app.displayStoredBooks();
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
      const libraryName = document.querySelector(
        ".create-library__form__input"
      ).value;

      const library = {
        name: libraryName,
        books: [],
      };
      app.setStore(library);
      location.assign("./libraries.html");
    });
  },

  displayStoredLibraries: () => {
    const select = document.querySelector(".select");
    app.getStore();
    if (app.libraries === null) return;

    let df = new DocumentFragment();

    console.log(app.libraries);
    app.libraries.forEach((library) => {
      const option = document.createElement("option");
      option.value = library.name;
      option.textContent = library.name;

      df.append(option);
    });
    select.innerHTML = "";
    select.appendChild(df);
    app.displayStoredBooks();
  },

  displayStoredBooks: () => {
    document.querySelector(".select").addEventListener("change", (ev) => {
      app.getStore();
      let selectedLibrary = [
        {
          title: ev.target.value,
        },
      ];
      localStorage.setItem("selectedLibrary", JSON.stringify(selectedLibrary));
    });
  },

  setStore: (library) => {
    if (JSON.parse(localStorage.getItem("libraries")) === null) {
      app.libraries = [];
      app.libraries.push(library);
      localStorage.setItem("libraries", JSON.stringify(app.libraries));
    } else {
      app.libraries = JSON.parse(localStorage.getItem("libraries"));
      app.libraries.push(library);
      localStorage.setItem("libraries", JSON.stringify(app.libraries));
    }
  },

  getStore: () => {
    app.libraries = JSON.parse(localStorage.getItem("libraries"));
  },

  searchBooks: () => {
    const searchInput = document.getElementById("search-input");
    const searchForm = document.getElementById("search-form");
    searchForm.addEventListener("submit", (ev) => {
      ev.preventDefault();
      //Search with ISBN number
      let url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${searchInput.value
        .split("-")
        .join("")}`;
      //Search with keywords
      if (app.searchMethodBtn === "keywords") {
        url = `https://www.googleapis.com/books/v1/volumes?q=${searchInput.value}`;
      }

      let req = new Request(url, {
        method: "GET",
        mode: "cors",
      });

      fetch(req)
        .then((resp) => resp.json())
        .then(app.displaySearchResult)
        .catch(app.err);
    });
  },

  displaySearchResult: (result) => {
    const displayBooksContainer = document.querySelector(
      ".display-books-container"
    );

    if (result.items === undefined) {
      let p = document.createElement("p");
      p.textContent = "No Results";
      p.classList.add("no-result");
      displayBooksContainer.append(p);
      return;
    }

    let df = new DocumentFragment();

    result.items.forEach((data, i) => {
      let b = app.prepareBookData(data);

      let book = document.createElement("div");
      book.classList.add("book");
      book.id = "book_" + i;
      book.innerHTML = `
      <form class="edit-form">
        <input class="edit-form__input title-input" type="text" name="title" id=${
          "title_" + i
        } placeholder="Title">
        <input class="edit-form__input author-input" type="text" name="authors" id=${
          "author_" + i
        } placeholder="Authors">
        <small>Separate author(s) with comma.</small>
        <textarea class="edit-form__input description-input" name="description" id=${
          "description_" + i
        } cols="30" rows="10" placeholder='Description'></textarea>
        <small>shift + enter for newline</small>
        <small>(press enter to save)</small>
      </form>
      <div class="inner-container">
        <div class="book__thumbnail">
          <img src=${b.thumbnail} width='140px' alt="Book Thumbnail">
          <button class='btn btn--add-item'><i class="fas fa-plus-circle"></i>Add Item</button>
          <button class="btn btn--delete-item" id=${
            "deleteBook_" + i
          }>Delete Item</button>
        </div>
        <div class="book__info">
          <h4 class="book__title">${b.title}</h4>
          <span class="book__author">${b.authors}</span>
          <div class="book__data">
            <span class="book__year">${b.datePublished}</span>
            <span class="book__pages">${b.pages} pages</span>
            <span class="book__publisher">${b.publisher}</span>
            <span class="book__isbn10">ISBN-10: ${
              !b.isbn[0] ? "no data" : b.isbn[0].identifier
            }</span>
            <span class="book__isbn13">ISBN-13: ${
              !b.isbn[1] ? "no data" : b.isbn[1].identifier
            }</span>
          </div>
          <p class="book__description">${b.description}</p>
        </div>
      </div>`;

      df.append(book);
    });

    displayBooksContainer.innerHTML = "";
    displayBooksContainer.append(df);

    displayBooksContainer.addEventListener("click", app.addBookToLibrary);
  },

  addBookToLibrary: (ev) => {
    if (ev.target.closest("button")) {
      const addedBook = ev.target.parentElement.parentElement.parentElement;
      const book = {
        image: addedBook.querySelector("img").src,
        title: addedBook.querySelector(".book__title").textContent,
        author: addedBook.querySelector(".book__author").textContent,
        year: addedBook.querySelector(".book__year").textContent,
        pages: addedBook.querySelector(".book__pages").textContent,
        publisher: addedBook.querySelector(".book__publisher").textContent,
        isbn10: addedBook.querySelector(".book__isbn10").textContent,
        isbn13: addedBook.querySelector(".book__isbn13").textContent,
        description: addedBook.querySelector(".book__description").textContent,
        id: addedBook.id,
      };

      const selectedLibrary = JSON.parse(
        localStorage.getItem("selectedLibrary")
      )[0].title;

      app.getStore();

      const storedLibrary = app.libraries.filter(
        (library) => library.name === selectedLibrary
      );
      let updatedLibrary = storedLibrary[0].books.push(book);

      const updatedLibraries = app.libraries.map((library) => {
        if (library.title === selectedLibrary) {
          return updatedLibrary;
        } else {
          return library;
        }
      });

      localStorage.setItem("libraries", JSON.stringify(updatedLibraries));
      app.addControlsToStoredBook(addedBook.id);
    }
  },

  addControlsToStoredBook: (storedBookId) => {
    console.log(storedBookId);
    const storedBook = document.getElementById(storedBookId);
    const bookControls = document.createElement("div");
    bookControls.classList.add("book__controls");
    bookControls.innerHTML = `<i class="fas fa-ban" id="cancel-edit" style="display:none"></i>
    <div class="controls-container">
    <i class="fas fa-pencil-alt" title="Edit" id="edit"></i>
    <i class="fas fa-tags" title="Tags" id="tags"></i>
    <i class="fas fa-sticky-note" title="Add Notes" id="notes"></i>
    <i class="fas fa-dollar-sign" title="Add Price" id="price"></i>
    <i class="fas fa-cart-plus" title="Purchase" id="purchase"></i>
    <i class="fas fa-trash-alt" title="Delete" id="delete"></i>
    </div>
    `;
    storedBook.append(bookControls);

    const addItemBtn = storedBook.querySelector(".btn--add-item");
    addItemBtn.style.display = "none";
    const deleteItemBtn = storedBook.querySelector(".btn--delete-item");
    deleteItemBtn.style.display = "block";

    deleteItemBtn.addEventListener("click", (ev) => {
      console.log(ev.target);
    });

    bookControls.addEventListener("click", (ev) => {
      if (ev.target.closest("i")) {
        const action = ev.target.id;
        app.editStoredBook(action, storedBookId);
      } else {
        return;
      }
    });
  },

  editStoredBook: (action, bookId) => {
    switch (action) {
      case "edit":
        app.changeBookInfo(bookId);
        break;
      case "tags":
        app.addBookTags(bookId);
        break;
      case "notes":
        app.addBookNotes(bookId);
        break;
      case "price":
        app.addBookPrice(bookId);
        break;
      case "purchase":
        app.purchaseBook(bookId);
        break;
      case "delete":
        app.deleteBook(bookId);
        break;
    }
  },

  changeBookInfo: (bookId) => {
    app.toggleEditForm(bookId);
    const book = document.getElementById(bookId);
    const editForm = book.querySelector(".edit-form");
    let titleText = book.querySelector(".book__title");
    let authorText = book.querySelector(".book__author");
    let descriptionText = book.querySelector(".book__description");

    let titleInput = editForm.querySelector(".title-input");
    titleInput.value = titleText.textContent;
    let authorInput = editForm.querySelector(".author-input");
    authorInput.value = authorText.textContent;
    let descriptionInput = editForm.querySelector(".description-input");
    descriptionInput.value = descriptionText.textContent;

    editForm.addEventListener("keyup", (ev) => {
      if (ev.code === "Enter") {
        titleText.textContent = titleInput.value;
        authorText.textContent = authorInput.value;
        descriptionText.textContent = descriptionInput.value;
        app.changeBookInfo(bookId); // Think about this! Doesnt look right even though it works
      }
    });
  },

  toggleEditForm: (bookId) => {
    // Get book
    const book = document.getElementById(bookId);
    // Get edit form
    const editForm = book.querySelector(".edit-form");
    // Get book data container
    const bookData = book.querySelector(".inner-container");
    // Toggle on/off class for edit form
    editForm.classList.toggle("add-edit-form");
    // Toggle on/off class for book data container
    bookData.classList.toggle("remove-book-data");

    // book
    //   .querySelector(".controls-container")
    //   .classList.toggle("remove-controls");
    // book.querySelector("#cancel-edit").style.display = "block";
  },
  addBookTags: (bookId) => {
    console.log(bookId);
  },
  addBookNotes: (bookId) => {
    console.log(bookId);
  },
  addBookPrice: (bookId) => {
    console.log(bookId);
  },
  purchaseBook: (bookId) => {
    console.log(bookId);
  },
  deleteBook: (bookId) => {
    console.log(bookId);
  },

  removeControlsFromStoredBook: () => {},

  prepareBookData: (book) => {
    let bookObj = {
      thumbnail:
        book.volumeInfo.imageLinks === undefined
          ? "./images/book-image-placeholder.png"
          : book.volumeInfo.imageLinks.thumbnail,
      title:
        book.volumeInfo.title === undefined
          ? "No title"
          : book.volumeInfo.title,
      authors:
        book.volumeInfo.authors === undefined
          ? "Author Unknown"
          : book.volumeInfo.authors.join(" | "),
      datePublished:
        book.volumeInfo.publishedDate === undefined
          ? "no info"
          : book.volumeInfo.publishedDate,
      pages:
        book.volumeInfo.pageCount === undefined
          ? "no info"
          : book.volumeInfo.pageCount,
      publisher:
        book.volumeInfo.publisher === undefined
          ? "no info"
          : book.volumeInfo.publisher,
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
    // Update title depending on which library has been selected
    const selectedLibrary = JSON.parse(
      localStorage.getItem("selectedLibrary")
    )[0].title;
    document.querySelector(".add-books__title").textContent =
      "Add Books to" + " " + selectedLibrary;
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
        const searchForm = document.getElementById("search-form");
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
        const searchForm = document.getElementById("search-form");
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
        app.searchMethodBtn = "keywords";
      }
      if (ev.target.id === "isbn") {
        const addBooksInput = document.querySelector(".add-books__form__input");
        addBooksInput.placeholder = "ISBN";
        app.searchMethodBtn = "isbn";
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
