const clear1_btn = document.getElementById("clear1-btn");
const cancel_btn = document.getElementById("cancel-btn");
const clear_warn = document.getElementById("clear-warning");
const save_btn = document.getElementById("save-btn");
const clear_btn = document.getElementById("clear-btn");
const searchBar = document.getElementById("search-bar");
const results = document.getElementById("results");
const titleInput = document.getElementById("title-input");
const authInput = document.getElementById("author-input");
const copiesInput = document.getElementById("copies-input");
let editIndex = null;
function saveBook() {
  let savedBooks = JSON.parse(localStorage.getItem("books")) || [];
  const title = document.getElementById("title-input").value.trim();
  const auth = document.getElementById("author-input").value.trim();
  const copies = document.getElementById("copies-input").value.trim();
  if (!title || !auth || !copies) return;
  if (editIndex === null) {
    savedBooks.push([title, auth, copies]);
  } else {
    savedBooks[editIndex] = [title, auth, copies];
    editIndex = null;
    save_btn.textContent = "Save"
  }
  localStorage.setItem("books", JSON.stringify(savedBooks));
  titleInput.value = "";
  authInput.value = "";
  copiesInput.value = "";
  renderResults();
}
function renderResults() {
  const query = searchBar.value.toLowerCase().trim();
  const storedBooks = JSON.parse(localStorage.getItem("books"));
  results.innerHTML = "";
  if (query === "") return;
  if (!storedBooks || storedBooks.length === 0) {
    results.innerHTML = `<p class="p">No saved books yet.</p>`;
    return;
  }
  const matchedBooks = storedBooks
    .map((book, originalIndex) => ({ book, originalIndex }))
    .filter(({ book }) => {
      const title = book[0].toLowerCase();
      const auth = book[1].toLowerCase();
      const copies = book[2].toLowerCase();
      return title.includes(query) || auth.includes(query);
    });
  if (matchedBooks.length === 0) {
    results.innerHTML = `<p class="p">There are no results that matched your query.</p>`;
  } else {
    matchedBooks.forEach(({ book, originalIndex }) => {
      const title = book[0];
      const auth = book[1];
      const copies = book[2];
      results.innerHTML += `
        <div>
          <p class="p"><strong>${title}</strong> by ${auth}. Copies: ${copies}</p>
          <button class="btn delete-btn" data-index="${originalIndex}">Delete</button>
          <button class="btn edit-btn" data-index="${originalIndex}">Edit</button>
        </div>
      `;
    });
  }
}
function deleteBook(index) {
  let storedBooks = JSON.parse(localStorage.getItem("books")) || [];
  storedBooks.splice(index, 1);
  localStorage.setItem("books", JSON.stringify(storedBooks));
  if (editIndex === Number(index)) {
    editIndex = null;
    save_btn.textContent = "Save";
    titleInput.value = "";
    authInput.value = "";
    copiesInput.value = "";
  }
  renderResults();
}
function editBook(index, newTitle, newAuth, newCopies) {
  let storedBooks = JSON.parse(localStorage.getItem("books")) || [];
  if (storedBooks[index]) {
    storedBooks[index] = [newTitle, newAuth, newCopies];
    localStorage.setItem("books", JSON.stringify(storedBooks));
  }
  renderResults();
}
save_btn.addEventListener("click", saveBook)
clear1_btn.addEventListener('click', () => {
  clear_warn.style.visibility = "visible";
  clear_btn.style.visibility = "visible";
  cancel_btn.style.visibility = "visible";
})
clear_btn.addEventListener("click", () => {
  localStorage.clear();
  results.innerHTML = "";
  alert("Local storage cleared.");
  clear_warn.style.visibility = "hidden";
  clear_btn.style.visibility = "hidden";
  cancel_btn.style.visibility = "hidden";
  editIndex = null;
  titleInput.value = "";
  authInput.value = "";
  copiesInput.value = "";
});
cancel_btn.addEventListener('click', () => {
  clear_warn.style.visibility = "hidden";
  clear_btn.style.visibility = "hidden";
  cancel_btn.style.visibility = "hidden";
})
searchBar.addEventListener("input", renderResults);
results.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const targetIndex = e.target.getAttribute("data-index");
    deleteBook(targetIndex);
  }
  if (e.target.classList.contains("edit-btn")) {
    const targetIndex = e.target.getAttribute("data-index");
    const storedBooks = JSON.parse(localStorage.getItem("books")) || [];
    const [currentTitle, currentAuth, currentCopies] = storedBooks[targetIndex];
    titleInput.value = currentTitle;
    authInput.value = currentAuth;
    copiesInput.value = currentCopies;
    editIndex = targetIndex;
    save_btn.textContent = "Update";
  }
});