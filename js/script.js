let searchMethodsContainer = document.querySelector(".search-method-container");

searchMethodsContainer.addEventListener("click", (ev) => {
  if (ev.target.closest("input")) {
    document.querySelector(".checked").classList.remove("checked");
    document.querySelector(".bg").classList.remove("bg");
    ev.target.parentElement.classList.add("bg");
    ev.target.previousElementSibling.classList.add("checked");
  }
});

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
