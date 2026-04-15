

// =========================
// 🛍️ PRODUCTS
// =========================
const watches = [
  {
    name: "NEPTUNE EDGE",
    price: "₹4999",
    image: "watch 1.jpeg"
  },
  {
    name: "CRIMSON TITAN",
    price: "₹4899",
    image: "watch 2.jpeg"
  },
  {
    name: "LUNAR DOMINATOR",
    price: "₹4789",
    image: "watch 3.jpeg"
  }
];

const gallery = document.getElementById("gallery");

function loadProducts() {

  gallery.innerHTML = "";

  db.collection("products").get().then(snapshot => {

    snapshot.forEach(doc => {

      let w = doc.data();

      gallery.innerHTML += `
        <div class="item" onclick='handleProductClick(${JSON.stringify(w)})'>
          <img src="${w.image}">
          <h3>${w.name}</h3>
          <p class="price">${w.price}</p>
        </div>
      `;

    });

  });

}

window.onload = loadProducts;
// =========================
// 🎯 SHOW PRODUCTS
// =========================
watches.forEach(w => {
  gallery.innerHTML += `
    <div class="item">
      <img src="${w.image}">
      <h3>${w.name}</h3>
      <p class="price">${w.price}</p>

    </div>
  `;
});

// =========================
// 🔍 OPEN PRODUCT
// =========================

// =========================
// 🛒 ADD TO CART (FIRESTORE)
// =========================
function addToCart(product) {
  firebase.auth().onAuthStateChanged(user => {

    if (!user) {
      alert("Login first");
      return;
    }

    const userId = user.uid;

    db.collection("carts").doc(userId).get().then(doc => {

      let cart = [];

      if (doc.exists) {
        cart = doc.data().items || [];
      }

      let existing = cart.find(item => item.name === product.name);

      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        product.quantity = 1;
        cart.push(product);
      }

      db.collection("carts").doc(userId).set({
        items: cart
      });

      alert("Added to cart 🛒");
      updateCartCount();
    });

  });
}

// =========================
// 🛒 TOGGLE CART PANEL
// =========================
function toggleCart() {
  document.getElementById("cart-panel").classList.toggle("open");
  loadCart();
}

// =========================
// 📦 LOAD CART FROM FIRESTORE
// =========================
function loadCart() {

  firebase.auth().onAuthStateChanged(user => {

    if (!user) {
      console.log("No user logged in");
      return;
    }

    db.collection("carts").doc(user.uid)
      .onSnapshot(doc => {

        const container = document.getElementById("cart-items");
        let total = 0;
        container.innerHTML = "";

        if (!doc.exists || !doc.data().items) {
          container.innerHTML = "<p>Cart is empty</p>";
          document.getElementById("cart-total").innerText = "Total: ₹0";
          return;
        }

        let cart = doc.data().items;

        cart.forEach((item, index) => {

          let price = parseInt(item.price);
          let quantity = item.quantity || 1;

          total += price * quantity;

          container.innerHTML += `
            <div class="cart-item">
              
              <img src="${item.image}" style="width:60px; height:60px; object-fit:cover; border-radius:8px;">

              <div class="item-info">
                <h4>${item.name}</h4>
                <p>₹${price}</p>
              </div>

              <div class="item-controls">
                <button onclick="changeQty(${index}, -1)">−</button>
                <span>${quantity}</span>
                <button onclick="changeQty(${index}, 1)">+</button>
              </div>

              <button class="remove-btn" onclick="removeItem(${index})">✖</button>
            </div>
          `;
        });

        document.getElementById("cart-total").innerText = "Total: ₹" + total;

      });

  });

}
// =========================
// 🔢 UPDATE CART COUNT
// =========================
function updateCartCount() {

  firebase.auth().onAuthStateChanged(user => {

    if (!user) return;

    db.collection("carts").doc(user.uid).get().then(doc => {

      let count = 0;

      if (doc.exists) {
        let cart = doc.data().items;

        cart.forEach(item => {
          count += item.quantity || 1;
        });
      }

      document.getElementById("cart-count").innerText = count;

    });

  });

}

// =========================
// ❌ REMOVE ITEM
// =========================
function removeItem(index) {

  firebase.auth().onAuthStateChanged(user => {

    if (!user) return;

    db.collection("carts").doc(user.uid).get().then(doc => {

      let cart = doc.data().items;

      cart.splice(index, 1);

      db.collection("carts").doc(user.uid).set({
        items: cart
      });

      loadCart();

    });

  });

}

// =========================
// ➕➖ CHANGE QUANTITY
// =========================
function changeQty(index, change) {

  firebase.auth().onAuthStateChanged(user => {

    if (!user) return;

    db.collection("carts").doc(user.uid).get().then(doc => {

      let cart = doc.data().items;

      cart[index].quantity = (cart[index].quantity || 1) + change;

      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }

      db.collection("carts").doc(user.uid).set({
        items: cart
      });

      loadCart();

    });

  });

}

// =========================
// 🚀 INIT
// =========================
window.onload = function() {
  updateCartCount();
};




function toggleCart() {
  document.getElementById("cart-panel").classList.toggle("open");
  loadCart();
}


function logoutUser() {
  firebase.auth().signOut().then(() => {
    alert("Logged out 👋");
    window.location.href = "login.html";
  });
}


function openCollection() {
  document.getElementById("home-page").style.display = "none";
  document.getElementById("collection-page").style.display = "block";

  loadCollectionProducts();
}

function goHome() {
  document.getElementById("home-page").style.display = "block";
  document.getElementById("collection-page").style.display = "none";
}

function loadCollectionProducts() {

  const gallery = document.getElementById("collection-gallery");
  gallery.innerHTML = "";

  db.collection("products").get().then(snapshot => {

    snapshot.forEach(doc => {

      let p = doc.data();

      gallery.innerHTML += `
        <div class="item">
          <img src="${p.image}">
          <h3>${p.name}</h3>
          <p class="price">${p.price}</p>
        </div>
      `;

    });

  });

}

