/* =========================
   SUPABASE CONNECTION
========================= */

const SUPABASE_URL =
  "https://wxxzdeokudocewgtykuy.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_PDhLn71THPJKLnjGXZDmrg_Qv3KOGGJ";


/* =========================
   ITB'S BOOK DATABASE
========================= */

let books = [];


/* =========================
   CART
========================= */

let cart = [];

let currentBook = null;

let currentCategory = "All";


/* =========================
   LOAD BOOKS FROM SUPABASE
========================= */

async function loadBooks() {

  try {

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/itb_contacts?select=id,name,number,type_of_book&order=id.asc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );


    if (!response.ok) {
      throw new Error(
        `Supabase returned ${response.status}`
      );
    }


    const data = await response.json();


    /*
      Convert Supabase rows into the format
      used by the ITB store.
    */

    books = data.map(book => ({

      id: book.id,

      title: book.name,

      author: "ITB Author",

      category: book.type_of_book || "Fiction",

      /*
        Your current "number" column contains
        "Out of Stock" for the Dino Nuggets book.

        Since there is no price column yet,
        the store uses $0.00 until a price is added.
      */

      price: 0,

      stock: book.number,

      image:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80",

      description:
        book.number === "Out of Stock"
          ? "This book is currently out of stock."
          : "A book available from ITB'S — Ink to Books."

    }));


    console.log(
      "Books successfully loaded from Supabase:",
      books
    );


    displayBooks(books);

  }

  catch (error) {

    console.error(
      "Could not load books from Supabase:",
      error
    );


    const grid =
      document.getElementById("book-grid");


    grid.innerHTML = `
      <p style="
        grid-column:1/-1;
        text-align:center;
        padding:50px;
        color:#b00020;
      ">
        We couldn't load the books right now.
        Please try again later.
      </p>
    `;

  }

}


/* =========================
   DISPLAY BOOKS
========================= */

function displayBooks(list) {

  const grid =
    document.getElementById("book-grid");


  grid.innerHTML = "";


  if (list.length === 0) {

    grid.innerHTML = `
      <p style="
        grid-column:1/-1;
        text-align:center;
        padding:50px;
        color:#777;
      ">
        No books found.
      </p>
    `;

    return;

  }


  list.forEach(book => {

    const card =
      document.createElement("article");


    card.className =
      "book-card";


    card.onclick = () =>
      openProduct(book);


    card.innerHTML = `

      <img
        src="${book.image}"
        alt="${book.title} book cover"
      >

      <div class="book-info">

        <span class="book-category">
          ${book.category}
        </span>

        <h3>${book.title}</h3>

        <p class="author">
          By ${book.author}
        </p>

        ${
          book.stock === "Out of Stock"
            ? `<p class="price">Out of Stock</p>`
            : `<p class="price">$${book.price.toFixed(2)}</p>`
        }

      </div>

    `;


    grid.appendChild(card);

  });

}


/* =========================
   CATEGORY FILTER
========================= */

function filterBooks(category, button) {

  currentCategory = category;


  document
    .querySelectorAll(".category")
    .forEach(btn =>
      btn.classList.remove("active")
    );


  button.classList.add("active");


  applyFilters();

}


/* =========================
   SEARCH
========================= */

function searchBooks() {

  applyFilters();

}


/* =========================
   APPLY FILTERS
========================= */

function applyFilters() {

  const search =
    document
      .getElementById("search")
      .value
      .toLowerCase();


  const filtered =
    books.filter(book => {

      const matchesCategory =
        currentCategory === "All" ||
        book.category === currentCategory;


      const matchesSearch =

        book.title
          .toLowerCase()
          .includes(search)

        ||

        book.author
          .toLowerCase()
          .includes(search)

        ||

        book.category
          .toLowerCase()
          .includes(search);


      return (
        matchesCategory &&
        matchesSearch
      );

    });


  displayBooks(filtered);

}


/* =========================
   PRODUCT WINDOW
========================= */

function openProduct(book) {

  currentBook = book;


  document.getElementById(
    "modal-image"
  ).src = book.image;


  document.getElementById(
    "modal-title"
  ).textContent = book.title;


  document.getElementById(
    "modal-category"
  ).textContent = book.category;


  document.getElementById(
    "modal-author"
  ).textContent =
    "Written by " + book.author;


  document.getElementById(
    "modal-description"
  ).textContent =
    book.description;


  document.getElementById(
    "modal-price"
  ).textContent =
    book.stock === "Out of Stock"
      ? "Out of Stock"
      : "$" + book.price.toFixed(2);


  document
    .getElementById("product-modal")
    .classList.add("show");

}


/* =========================
   CLOSE PRODUCT
========================= */

function closeProduct() {

  document
    .getElementById("product-modal")
    .classList.remove("show");

}


/* =========================
   ADD TO CART
========================= */

function addCurrentBook() {

  if (!currentBook) return;


  if (currentBook.stock === "Out of Stock") {

    alert(
      "Sorry! This book is currently out of stock."
    );

    return;

  }


  cart.push(currentBook);


  updateCart();


  closeProduct();

}


/* =========================
   CART DISPLAY
========================= */

function updateCart() {

  document.getElementById(
    "cart-count"
  ).textContent = cart.length;


  const container =
    document.getElementById("cart-items");


  container.innerHTML = "";


  let total = 0;


  if (cart.length === 0) {

    container.innerHTML =
      "<p>Your cart is empty.</p>";

  }


  cart.forEach((book, index) => {

    total += book.price;


    const item =
      document.createElement("div");


    item.className =
      "cart-item";


    item.innerHTML = `

      <div>

        <strong>
          ${book.title}
        </strong>

        <br>

        <small>
          $${book.price.toFixed(2)}
        </small>

      </div>

      <button
        onclick="removeFromCart(${index})"
      >
        ✕
      </button>

    `;


    container.appendChild(item);

  });


  document.getElementById(
    "cart-total"
  ).textContent =
    total.toFixed(2);

}


/* =========================
   REMOVE FROM CART
========================= */

function removeFromCart(index) {

  cart.splice(index, 1);

  updateCart();

}


/* =========================
   CART WINDOW
========================= */

function openCart() {

  updateCart();


  document
    .getElementById("cart-modal")
    .classList.add("show");

}


function closeCart() {

  document
    .getElementById("cart-modal")
    .classList.remove("show");

}


/* =========================
   CLOSE MODALS
   WHEN CLICKING OUTSIDE
========================= */

window.onclick = function(event) {

  if (
    event.target.id ===
    "product-modal"
  ) {

    closeProduct();

  }


  if (
    event.target.id ===
    "cart-modal"
  ) {

    closeCart();

  }

};


/* =========================
   START WEBSITE
========================= */

updateCart();

loadBooks();
