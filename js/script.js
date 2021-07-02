let searchMethodsContainer = document.querySelector(".search-method-container");

searchMethodsContainer.addEventListener("click", (ev) => {
  if (ev.target.closest("input")) {
    document.querySelector(".checked").classList.remove("checked");
    document.querySelector(".bg").classList.remove("bg");
    ev.target.parentElement.classList.add("bg");
    ev.target.previousElementSibling.classList.add("checked");
  }
});
