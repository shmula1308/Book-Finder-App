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
      case "home":
        app.burgerNav();
        break;
      case "librariesPage":
        app.burgerNav();
        app.displayStoredLibraries();
        break;
      case "createLibraryPage":
        app.burgerNav();
        app.createLibrary();
        break;
      case "addBooksPage":
        app.burgerNav();
        app.searchBooks();
        app.addBooksPageUI();
        break;
    }
  },

  burgerNav: () => {
    const mobileHeader = document.querySelector(".navbar-mobile__header");
    mobileHeader.addEventListener("click", (ev) => {
      if (ev.target.closest(".burger")) {
        const mobileMenu = document.querySelector(".navbar__menu--mobile");
        mobileMenu.classList.toggle("show-nav");
      }
    });
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

    app.libraries.forEach((library) => {
      const option = document.createElement("option");
      option.value = library.name;
      option.textContent = library.name;

      df.append(option);
    });
    select.innerHTML = "";
    select.appendChild(df);

    app.getSelectedLibrary();

    app.displayStoredBooks();
  },

  getSelectedLibrary: () => {
    const select = document.querySelector(".select");
    let selectedLibrary = [
      {
        title: select.value,
      },
    ];

    localStorage.setItem("selectedLibrary", JSON.stringify(selectedLibrary));

    select.addEventListener("change", (ev) => {
      let selectedLibrary = [
        {
          title: ev.target.value,
        },
      ];
      localStorage.setItem("selectedLibrary", JSON.stringify(selectedLibrary));
      app.displayStoredBooks();
    });
  },

  displayStoredBooks: () => {
    let selectedLibrary = JSON.parse(localStorage.getItem("selectedLibrary"));
    selectedLibrary = selectedLibrary[0].title;
    const displayBooksContainer = document.querySelector(
      ".display-books-container"
    );

    app.getStore();
    let library = app.libraries.filter((lib) => lib.name === selectedLibrary);

    let df = new DocumentFragment();

    library[0].books
      .sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1))
      .forEach((data, i) => {
        let book = document.createElement("div");
        book.classList.add("book");
        book.id = data.id;
        book.dataset.sort = data.title[0].toUpperCase();

        data.tags = !data.tags ? [] : data.tags;

        let tags = data.tags.map((tag) => {
          if (tag === "") return "";
          let span = `<span class="tag">${tag}</span>`;
          return span;
        });

        let tagsStr = data.tags.join(",");
        if (!tagsStr) tagsStr = "";

        let displayNotes = !data.notes ? "display:none" : "display:block";

        let notes = !data.notes ? "" : data.notes;

        let price = !data.price ? "" : data.price;

        book.innerHTML = `
      <div class="edit-form">
          <input class="manual-entry-form__input title-input" type="text" name="title" placeholder="Title">
          <input class="manual-entry-form__input author-input" type="text" name="authors" placeholder="Authors">
          <small>Separate author(s) with comma.</small>
          <textarea class="manual-entry-form__input description-input" name="description" id="description" cols="30" rows="10" placeholder='Description'></textarea>
          <small>(press enter to save)</small>
      </div> 
      <div class="inner-container">
        <div class="book__thumbnail">
          <img src="${data.image}" width='140px' alt="Book Thumbnail">
        </div>
        <div class="book__info">
        <div class="tag-input-container">
          <small for="tags" class="tag-small">Tags <span>(separate with comma / press enter to save)</small></label>
          <input class="tag-input" type="text" name="tags" value="${tagsStr}" id=${
          "tag_" + i
        }>
        </div>
         <div class="notes-input-container">
            <small for="notes" class="notes-small">Notes (press enter to save)</small>
            <textarea class="notes-input" type="text" name="notes" >${notes}</textarea>
         </div> 
        <div class="price-input-container">
          <small for="price" class="price-small">Price (cost or price of item / press enter to save)
          </small>
          <input class="price-input" type="text" name="price" value='${price}'  id=${
          "price_" + i
        }>
        </div> 
        <h4 class="book__title">${data.title}</h4>
        <span class="book__author">${data.author}</span>
        <div class="book__data">
          <span class="book__year">${data.year}</span>
          <span class="book__pages">${data.pages}</span>
          <span class="book__publisher">${data.publisher}</span>
          <span class="book__isbn13">${data.isbn13}</span>
          <span class="book__isbn10">${data.isbn10}</span>
        </div>
        <div class="price-tag">${!data.price ? "" : "$" + data.price}</div>
        <p class="book__description">${data.description}</p>
        <div class="tags">${tags.join("")}</div> 
        <div class="notes" style=${displayNotes}>
          <i class="fas fa-sticky-note" title="Add Notes"></i>
          ${data.notes}
        </div>
      </div>
    </div>
    <div class="book__controls">
      <i class="fas fa-ban cancel-btn" title="cancel"></i>
      <div class="controls-container">
        <i class="fas fa-pencil-alt" title="Edit" id="edit"></i>
        <i class="fas fa-tags" title="Tags" id="tags"></i>
        <i class="fas fa-sticky-note" title="Add Notes" id="notes"></i>
        <i class="fas fa-dollar-sign" title="Add Price" id="price"></i>
        <i class="fas fa-cart-plus" title="Purchase" id="purchase"></i>
        <i class="fas fa-trash-alt" title="Delete" id="delete"></i>
      </div>
    </div>`;

        df.append(book);
      });

    displayBooksContainer.innerHTML = "";
    displayBooksContainer.append(df);

    app.createLetterSeparators();

    app.filterBooks();

    const bookControls = document.querySelectorAll(".book__controls");
    bookControls.forEach((bookControl) => {
      bookControl.addEventListener("click", (ev) => {
        if (ev.target.closest("i")) {
          const action = ev.target.id;
          let bookId = ev.target.parentElement.parentElement.parentElement.id;
          app.editBookInYourLibraries(action, bookId);
          return;
        } else {
          return;
        }
      });
    });
  },

  createLetterSeparators: () => {
    app.libraries[0].books.sort((a, b) => (a.title > b.title ? -1 : 1));
    let booksDisplay = document.querySelector(".display-books-container");
    let books = document.querySelectorAll(".book");
    let letterSeparator = null;
    books.forEach((book) => {
      console.log(book.dataset.sort);
      if (!letterSeparator) {
        letterSeparator = book.dataset.sort;
        let separator = document.createElement("div");
        separator.classList.add("first-letter");
        separator.textContent = book.dataset.sort;
        book.parentElement.prepend(separator);
      }
      if (letterSeparator === book.dataset.sort) {
        letterSeparator = letterSeparator;
      }
      if (letterSeparator !== book.dataset.sort) {
        letterSeparator = book.dataset.sort;
        let separator = document.createElement("div");
        separator.classList.add("first-letter");
        separator.textContent = book.dataset.sort;
        booksDisplay.insertBefore(separator, book);
      }
    });
  },

  filterBooks: () => {
    let booksDisplay = document.querySelector(".display-books-container");
    const letters = document.querySelector(".letter_range");
    let books = document.querySelectorAll(".book");
    letters.addEventListener("click", (ev) => {
      if (ev.target.closest("span")) {
        document.querySelector(".selected").classList.remove("selected");
        ev.target.classList.add("selected");

        books.forEach((book) => {
          if (book.dataset.sort !== ev.target.textContent) {
            book.style.display = "none";
          }
          if (book.dataset.sort === ev.target.textContent) {
            book.style.display = "block";
          }
          if (ev.target.textContent === "ALL") {
            book.style.display = "block";
          }
        });
      } else {
        return;
      }
    });
  },

  editBookInYourLibraries: (action, bookId) => {
    switch (action) {
      case "edit":
        app.editFormInYourLibraries(bookId);
        break;
      case "tags":
        app.highlightSelectedBtn(action, bookId);
        app.getBookTags(bookId);
        break;
      case "notes":
        app.highlightSelectedBtn(action, bookId);
        app.addBookNotes(bookId);
        break;
      case "price":
        app.highlightSelectedBtn(action, bookId);
        app.addBookPrice(bookId);
        break;
      case "purchase":
        app.purchaseBook(bookId);
        break;
      case "delete":
        app.deleteBookFromStoreAndDOM(bookId);
        break;
    }
  },

  deleteBookFromStoreAndDOM: (bookId) => {
    app.getStore();
    const selectedLibrary = JSON.parse(localStorage.getItem("selectedLibrary"));
    const library = selectedLibrary[0].title;
    const storedLibrary = app.libraries.filter((lib) => lib.name === library);
    let books = storedLibrary[0].books;
    const updatedBooksArr = books.filter((book) => book.id !== bookId);

    const updatedLibrary = app.libraries.map((lib) =>
      lib.name === library
        ? { ...lib, books: (lib.books = updatedBooksArr) }
        : lib
    );
    localStorage.setItem("libraries", JSON.stringify(updatedLibrary));
    app.displayAlert("warning", "Items was deleted from your library!");

    // Remove Book from DOM
    const domBook = document.getElementById(bookId);
    domBook.remove();
  },

  editFormInYourLibraries: (bookId) => {
    const book = document.getElementById(bookId);

    // Add edit form
    const editForm = book.querySelector(".edit-form");
    editForm.classList.toggle("add-edit-form");

    // Remove book data
    const bookData = book.querySelector(".inner-container");
    bookData.classList.toggle("remove-book-data");

    // Remove book controls
    const controls = book.querySelector(".controls-container");
    controls.classList.toggle("remove-controls");

    //Add cancel button
    let cancelBtn = book.querySelector(".cancel-btn");
    cancelBtn.classList.add("add-cancel-btn");

    //When user clicks cancel button, remove cancel button and show book controls
    cancelBtn.addEventListener("click", (ev) => {
      controls.classList.remove("remove-controls");
      cancelBtn.classList.remove("add-cancel-btn");
      // Remove edit form and show book data
      editForm.classList.remove("add-edit-form");
      bookData.classList.remove("remove-book-data");
    });

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
        // Remove edit inputs and show book data
        const editForm = book.querySelector(".edit-form");
        const bookData = book.querySelector(".inner-container");
        editForm.classList.remove("add-edit-form");
        bookData.classList.remove("remove-book-data");

        // Show book controls
        let controls = book.querySelector(".controls-container");
        controls.classList.remove("remove-controls");
        // Remove cancel button
        let cancelBtn = book.querySelector(".cancel-btn");
        cancelBtn.classList.remove("add-cancel-btn");

        let updatedInfo = {
          title: titleText.textContent,
          author: authorText.textContent,
          description: descriptionText.textContent,
        };
        app.updateBookInfoInStore(updatedInfo, bookId);
      }
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
      let selectedLibrary = JSON.parse(localStorage.getItem("selectedLibrary"));
      if (selectedLibrary == null) {
        app.displayAlert("warning", "Please create a library first");
        return;
      }
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
      book.id = data.id;
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
          <button class='btn btn--add-item' data-id="addBook"> + Add Item</button>
          <button class="btn btn--delete-item" data-id="deleteBook"
          }>Delete Item</button>
        </div>
        <div class="book__info">
          <div class="tag-input-container">
            <small for="tags" class="tag-small">Tags <span>(separate with comma / press enter to save)</small></label>
            <input class="tag-input" type="text" name="tags" id=${"tag_" + i}>
          </div>
          <div class="notes-input-container">
              <small for="notes" class="notes-small">Notes (press enter to save)</small>
              <textarea class="notes-input" type="text" name="notes"></textarea>
          </div>
          <div class="price-input-container">
            <small for="price" class="price-small">Price (cost or price of item / press enter to save)</small>
            <input class="price-input" type="text" name="price" id=${
              "price_" + i
            }>
          </div> 
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
          <div class="price-tag"></div>
          <p class="book__description">${b.description}</p>
          <div class="tags"></div>
          <div class="notes">
            <i class="fas fa-sticky-note" title="Add Notes"></i>
          </div>
      </div>`;

      df.append(book);
    });

    displayBooksContainer.innerHTML = "";
    displayBooksContainer.append(df);

    displayBooksContainer.addEventListener("click", (ev) => {
      if (ev.target.dataset.id === "addBook") {
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
          description:
            addedBook.querySelector(".book__description").textContent,
          id: addedBook.id,
        };

        app.addBookToLibrary(book, addedBook.id);
      }
      if (ev.target.dataset.id === "deleteBook") {
        let bookId = ev.target.parentElement.parentElement.parentElement.id;
        console.log(bookId);
        app.deleteBookFromStore(bookId);
        const displayedBook = document.getElementById(bookId);
        const addItemBtn = displayedBook.querySelector(".btn--add-item");
        addItemBtn.style.display = "block";
        const deleteItemBtn = displayedBook.querySelector(".btn--delete-item");
        deleteItemBtn.style.display = "none";
      }
    });
  },

  addBookToLibrary: (book, bookId) => {
    const selectedLibrary = JSON.parse(
      localStorage.getItem("selectedLibrary")
    )[0].title;

    app.getStore();

    const storedLibrary = app.libraries.filter(
      (library) => library.name === selectedLibrary
    );

    let libraryHasBook = storedLibrary[0].books.filter(
      (storedBook) => storedBook.id === book.id
    );

    if (libraryHasBook.length) {
      app.displayAlert("warning", "Item already exists in your library!");
      return;
    }

    let updatedLibrary = storedLibrary[0].books.push(book);

    const updatedLibraries = app.libraries.map((library) => {
      if (library.title === selectedLibrary) {
        return updatedLibrary;
      } else {
        return library;
      }
    });

    localStorage.setItem("libraries", JSON.stringify(updatedLibraries));

    app.displayAlert(
      "alert-succes",
      "Item was succesfully added to your library!"
    );

    app.addControlsToDisplayedBook(bookId);
  },

  displayAlert: (alertClass, alertMessage) => {
    const alertContainer = document.querySelector(".alert");
    const alertMsg = document.querySelector(".alert__message");
    alertContainer.classList.add(alertClass);
    alertMsg.textContent = alertMessage;
    alertContainer.addEventListener("click", (ev) => {
      if (ev.target.closest("i")) {
        alertContainer.classList.remove(alertClass);
      }
    });
    setTimeout(() => {
      alertContainer.classList.remove(alertClass);
    }, 3000);
  },

  // Try to solve this by adding it to the HTML then hide it.
  addControlsToDisplayedBook: (storedBookId) => {
    const displayedBook = document.getElementById(storedBookId);
    const bookControls = document.createElement("div");
    bookControls.classList.add("book__controls");
    bookControls.innerHTML = `
    <i class="fas fa-ban cancel-btn" title="cancel"></i>
    <div class="controls-container">
      <i class="fas fa-pencil-alt" title="Edit" id="edit"></i>
      <i class="fas fa-tags" title="Tags" id="tags"></i>
      <i class="fas fa-sticky-note" title="Add Notes" id="notes"></i>
      <i class="fas fa-dollar-sign" title="Add Price" id="price"></i>
      <i class="fas fa-cart-plus" title="Purchase" id="purchase"></i>
      <i class="fas fa-trash-alt" title="Delete" id="delete"></i>
    </div>
    `;
    displayedBook.append(bookControls);

    const addItemBtn = displayedBook.querySelector(".btn--add-item");
    addItemBtn.style.display = "none";
    const deleteItemBtn = displayedBook.querySelector(".btn--delete-item");
    deleteItemBtn.style.display = "block";

    bookControls.addEventListener("click", (ev) => {
      if (ev.target.closest("i")) {
        const action = ev.target.id;
        app.editStoredBook(action, storedBookId);
        return;
      } else {
        return;
      }
    });
  },

  editStoredBook: (action, bookId) => {
    console.log(action);
    switch (action) {
      case "edit":
        app.changeBookInfo(bookId);
        break;
      case "tags":
        app.highlightSelectedBtn(action, bookId);
        app.getBookTags(bookId);
        break;
      case "notes":
        app.highlightSelectedBtn(action, bookId);
        app.addBookNotes(bookId);
        break;
      case "price":
        app.highlightSelectedBtn(action, bookId);
        app.addBookPrice(bookId);
        break;
      case "purchase":
        app.purchaseBook(bookId);
        break;
      case "delete":
        app.deleteBookFromStore(bookId);
        break;
    }
  },

  highlightSelectedBtn: (btnId, bookId) => {
    let book = document.getElementById(bookId);
    const selectedBtn = book.querySelector("#" + btnId);
    selectedBtn.classList.toggle("control-active");
  },

  deactivateBtn: (bookId) => {
    const book = document.getElementById(bookId);
    const controlBtnsArr = book.querySelectorAll(".book__controls i");
    controlBtnsArr.forEach((btn) => btn.classList.remove("control-active"));
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
        // Remove edit inputs and show book data
        const editForm = book.querySelector(".edit-form");
        const bookData = book.querySelector(".inner-container");
        editForm.classList.remove("add-edit-form");
        bookData.classList.remove("remove-book-data");

        // Show book controls
        let controls = book.querySelector(".controls-container");
        controls.classList.remove("remove-controls");
        // Remove cancel button
        let cancelBtn = book.querySelector(".cancel-btn");
        cancelBtn.classList.remove("add-cancel-btn");
        console.log("hello");

        let updatedInfo = {
          title: titleText.textContent,
          author: authorText.textContent,
          description: descriptionText.textContent,
        };
        app.updateBookInfoInStore(updatedInfo, bookId);
      }
    });
  },

  updateBookInfoInStore: (updatedInfo, bookId) => {
    app.getStore();
    const selectedLibrary = JSON.parse(localStorage.getItem("selectedLibrary"));
    const library = selectedLibrary[0].title;
    const storedLibrary = app.libraries.filter((lib) => lib.name === library);
    let books = storedLibrary[0].books;
    const bookToUpdate = books.filter((book) => book.id === bookId);

    const updatedBook = {
      ...bookToUpdate[0],
      ...updatedInfo,
    };

    const updatedBooksArr = books.map((book) =>
      book.id === bookId ? updatedBook : book
    );

    const updatedLibrary = app.libraries.map((lib) =>
      lib.name === library
        ? { ...lib, books: (lib.books = updatedBooksArr) }
        : lib
    );

    localStorage.setItem("libraries", JSON.stringify(updatedLibrary));
  },

  toggleEditForm: (bookId) => {
    // Get book
    console.log(bookId);
    const book = document.getElementById(bookId);
    // Get edit form
    const editForm = book.querySelector(".edit-form");
    // Get book data container
    const bookData = book.querySelector(".inner-container");
    // Toggle on/off class for edit form
    editForm.classList.toggle("add-edit-form");
    // Toggle on/off class for book data container
    bookData.classList.toggle("remove-book-data");
    //Toggle other controls and cancel button

    let controls = book.querySelector(".controls-container");
    controls.classList.toggle("remove-controls");

    let cancelBtn = book.querySelector(".cancel-btn");
    cancelBtn.classList.toggle("add-cancel-btn");

    //When user clicks cancel button, remove cancel button and show book controls
    cancelBtn.addEventListener("click", (ev) => {
      controls.classList.remove("remove-controls");
      cancelBtn.classList.remove("add-cancel-btn");
      // Remove edit form and show book data
      editForm.classList.remove("add-edit-form");
      bookData.classList.remove("remove-book-data");
    });
  },

  getBookTags: (bookId) => {
    const book = document.getElementById(bookId);
    const tagInputContainer = book.querySelector(".tag-input-container");
    tagInputContainer.classList.toggle("open");

    const tagInput = tagInputContainer.querySelector(".tag-input");

    tagInput.addEventListener("keyup", (ev) => {
      let tags = ev.target.value.split(",");
      if (ev.code === "Enter") {
        tagInputContainer.classList.remove("open");
        app.deactivateBtn(bookId);
        // Update local storage
        let updatedInfo = {
          tags: [...tags],
        };
        app.updateBookInfoInStore(updatedInfo, bookId);
      }

      if (ev.target.value.length === 0) {
        document.querySelector(".tags").innerHTML = "";
        return;
      }

      app.addTagsToUI(tags, bookId);
    });
  },

  addTagsToUI: (tags, bookId) => {
    const book = document.getElementById(bookId);
    book.querySelector(".tags").innerHTML = "";
    let df = new DocumentFragment();

    tags.map((tag) => {
      let span = document.createElement("span");
      span.classList.add("tag");
      span.textContent = tag;
      df.append(span);
    });
    book.querySelector(".tags").append(df);
  },

  addBookNotes: (bookId) => {
    // Opens the input for notes
    const book = document.getElementById(bookId);
    const notesInputContainer = book.querySelector(".notes-input-container");
    notesInputContainer.classList.toggle("open-notes");

    const notesInput = notesInputContainer.querySelector(".notes-input");
    notesInput.addEventListener("keyup", (ev) => {
      if (ev.code === "Enter") {
        let notesWrapper = book.querySelector(".notes");

        if (ev.target.value.trim().length === 0) {
          notesWrapper.style.display = "none";
          notesInputContainer.classList.remove("open-notes");
          app.deactivateBtn(bookId);
          return;
        }

        notesWrapper.innerHTML = "";
        notesWrapper.innerHTML = `<i class="fas fa-sticky-note" title="Add Notes"></i> ${ev.target.value}`;
        notesWrapper.style.display = "block";
        notesInputContainer.classList.remove("open-notes");
        app.deactivateBtn(bookId);

        // Update local storage

        let updatedInfo = {
          notes: ev.target.value,
        };
        app.updateBookInfoInStore(updatedInfo, bookId);
      }
    });
  },

  addBookPrice: (bookId) => {
    // Opens the input for price
    const book = document.getElementById(bookId);
    const priceInputContainer = book.querySelector(".price-input-container");
    priceInputContainer.classList.toggle("open-price-input");

    const priceInput = priceInputContainer.querySelector(".price-input");
    priceInput.addEventListener("keyup", (ev) => {
      if (ev.code === "Enter") {
        let priceWrapper = book.querySelector(".price-tag");
        priceWrapper.textContent = "$" + ev.target.value;
        app.deactivateBtn(bookId);
        priceInputContainer.classList.remove("open-price-input");

        // Update local storage
        let updatedInfo = {
          price: ev.target.value,
        };
        app.updateBookInfoInStore(updatedInfo, bookId);
      }
    });
  },

  purchaseBook: (bookId) => {
    const book = document.getElementById(bookId);
    let title = book.querySelector(".book__title");
    let titleQuery = title.textContent.split(" ").join("+");
    let link = document.createElement("a");
    link.target = "_blank";
    link.href = `https://www.amazon.com/s?k=${titleQuery}&i=stripbooks-intl-ship&ref=nb_sb_noss_2`;
    link.click();
  },

  deleteBookFromStore: (bookId) => {
    app.getStore();
    const selectedLibrary = JSON.parse(localStorage.getItem("selectedLibrary"));
    const library = selectedLibrary[0].title;
    const storedLibrary = app.libraries.filter((lib) => lib.name === library);
    let books = storedLibrary[0].books;
    const updatedBooksArr = books.filter((book) => book.id !== bookId);

    const updatedLibrary = app.libraries.map((lib) =>
      lib.name === library
        ? { ...lib, books: (lib.books = updatedBooksArr) }
        : lib
    );
    localStorage.setItem("libraries", JSON.stringify(updatedLibrary));
    app.displayAlert("warning", "Items was deleted from your library!");
    app.removeControlsFromDeletedBook(bookId);
  },

  removeControlsFromDeletedBook: (bookId) => {
    const displayedBook = document.getElementById(bookId);
    let bookControls = displayedBook.querySelector(".book__controls");
    bookControls.remove();
    const addItemBtn = displayedBook.querySelector(".btn--add-item");
    addItemBtn.style.display = "block";
    const deleteItemBtn = displayedBook.querySelector(".btn--delete-item");
    deleteItemBtn.style.display = "none";
  },

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
    let selectedLibrary = JSON.parse(localStorage.getItem("selectedLibrary"));

    if (selectedLibrary === null) {
      app.displayAlert("warning", "Please create a library first");
      return;
    }
    selectedLibrary = selectedLibrary[0].title;

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

        app.addBooksManually();
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

  addBooksManually: () => {
    const form = document.querySelector(".manual-entry-form");
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const title = document.getElementById("title");
      const authors = document.getElementById("authors");
      const description = document.getElementById("description");
      let year = document.getElementById("year");
      let month = document.getElementById("month");
      let day = document.getElementById("day");
      const publisher = document.getElementById("publisher");
      const isbn = document.getElementById("misbn");
      const pages = document.getElementById("pages");

      year = !year.value ? "" : year.value;
      month = !month.value ? "" : month.value;
      day = !day.value ? "" : day.value;

      const yearPublished = [year, month, day]
        .filter((str) => str !== "")
        .join("-");

      const book = {
        title: title.value,
        author: authors.value,
        description: description.value,
        year: yearPublished,
        publisher: publisher.value,
        image: "images/book-image-placeholder.png",
        isbn10: "",
        isbn13: isbn.value,
        pages: pages.value,
        id: "id_" + Math.floor(Math.random() * Date.now()),
      };

      app.addBookToLibrary(book);
      app.displayAlert("alert-succes", "Your item was succesfully created!");
      form.reset();
    });
  },

  err: (error) => {
    console.log(error.message);
  },
};

app.init();
