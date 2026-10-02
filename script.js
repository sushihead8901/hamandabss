/* =========================
   ITB'S BOOK DATABASE
========================= */

const books = [

  {
    title: "The Last Summer",
    author: "Luis",
    category: "Young Adult",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=700&q=80",
    description:
      "A young adult story about friendship, change, and one unforgettable summer."
  },

  {
    title: "Beyond the Door",
    author: "Pablo",
    category: "Fiction",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&w=700&q=80",
    description:
      "A fictional adventure that begins when an ordinary door leads somewhere unexpected."
  },

  {
    title: "Understanding Space",
    author: "Luis",
    category: "Non-Fiction",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=700&q=80",
    description:
      "An introduction to space, planets, stars, galaxies, and the universe."
  },

  {
    title: "The Life of an Inventor",
    author: "Pablo",
    category: "Biography",
    price: 11.99,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=700&q=80",
    description:
      "Explore the life, challenges, and accomplishments of a famous inventor."
  },

  {
    title: "Mystery at Midnight",
    author: "Luis",
    category: "Fiction",
    price: 10.99,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=700&q=80",
    description:
      "A mysterious story filled with clues, strange events, and unexpected discoveries."
  },

  {
    title: "Growing Up",
    author: "Pablo",
    category: "Young Adult",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=700&q=80",
    description:
      "A coming-of-age story about school, friendship, and figuring out what comes next."
  }

];


/* =========================
   CART
========================= */

let cart = [];

let currentBook = null;

let currentCategory = "All";


/* =========================
   DISPLAY BOOKS
========================= */

function displayBooks(list) {

  const grid = document.getElementById("book-grid");

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


  list.forEach((book, index) => {

    const card = document.createElement("article");

    card.className = "book-card";

    card.onclick = () => openProduct(book);


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

        <p class="price">
          $${book.price.toFixed(2)}
        </p>

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
    .forEach(btn => btn.classList.remove("active"));


  button.classList.add("active");


  applyFilters();

}


/* =========================
   SEARCH
========================= */

function searchBooks() {

  applyFilters();

}


function applyFilters() {

  const search =
    document
      .getElementById("search")
      .value
      .toLowerCase();


  let filtered = books.filter(book => {

    const matchesCategory =
      currentCategory === "All" ||
      book.category === currentCategory;


    const matchesSearch =
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search) ||
      book.category.toLowerCase().includes(search);


    return matchesCategory && matchesSearch;

  });


  displayBooks(filtered);

}


/* =========================
   PRODUCT WINDOW
========================= */

function openProduct(book) {

  currentBook = book;


  document.getElementById("modal-image").src =
    book.image;


  document.getElementById("modal-title").textContent =
    book.title;


  document.getElementById("modal-category").textContent =
    book.category;


  document.getElementById("modal-author").textContent =
    "Written by " + book.author;


  document.getElementById("modal-description").textContent =
    book.description;


  document.getElementById("modal-price").textContent =
    "$" + book.price.toFixed(2);


  document
    .getElementById("product-modal")
    .classList.add("show");

}


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


  cart.push(currentBook);


  updateCart();


  closeProduct();

}


/* =========================
   CART DISPLAY
========================= */

function updateCart() {

  document.getElementById("cart-count").textContent =
    cart.length;


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


    item.className = "cart-item";


    item.innerHTML = `

      <div>

        <strong>${book.title}</strong>

        <br>

        <small>$${book.price.toFixed(2)}</small>

      </div>

      <button onclick="removeFromCart(${index})">
        ✕
      </button>

    `;


    container.appendChild(item);

  });


  document.getElementById("cart-total").textContent =
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
   CLOSE WHEN CLICKING
   OUTSIDE WINDOW
========================= */

window.onclick = function(event) {

  if (event.target.id === "product-modal") {
    closeProduct();
  }


  if (event.target.id === "cart-modal") {
    closeCart();
  }

};


/* =========================
   START WEBSITE
========================= */

displayBooks(books);
updateCart();
