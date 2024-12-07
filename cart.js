
// Ambil keranjang dari LocalStorage
let cart = JSON.parse(localStorage.getItem("cart")) || {};

// Simpan keranjang ke LocalStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Hitung total harga
function calculateTotal() {
  return Object.values(cart).reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);
}

// Render keranjang
function renderCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  if (Object.keys(cart).length === 0) {
    cartItems.innerHTML = `<p>Kosong Dong!</p>`;
    document.getElementById("cart-total").textContent = "Total: Rp 0";
    return;
  }

  Object.entries(cart).forEach(([id, product]) => {
    const itemHTML = `
      <div class="cart-item" data-id="${id}">
        <img src="${product.image}" alt="${product.name}">
        <div class="cart-item-details">
          <p class="cart-item-title">${product.name}</p>
          <p class="cart-item-price">Rp ${product.price.toLocaleString("id-ID")}</p>
        </div>
        <div class="cart-item-controls">
          <button class="decrease-quantity">-</button>
          <input type="number" value="${product.quantity}" class="quantity-input" min="1">
          <button class="increase-quantity">+</button>
        </div>
        
      </div>
    `;
    cartItems.innerHTML += itemHTML;
  });

  document.getElementById("cart-total").textContent = `Total: Rp ${calculateTotal().toLocaleString("id-ID")}`;

  attachEventListeners();
}

// Tambahkan event listener
function attachEventListeners() {
  // Tombol kurang
  document.querySelectorAll(".decrease-quantity").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.closest(".cart-item").dataset.id;
  
      if (cart[id]) {
        if (cart[id].quantity > 1) {
          cart[id].quantity--;
        } else {
          // Hapus produk dari keranjang jika kuantitasnya menjadi 0
          delete cart[id];
        }
  
        // Jika keranjang kosong, reset menjadi array kosong
        if (Object.keys(cart).length === 0) {
          cart = [];
        }
  
        saveCart();
        renderCart();
      }
    });
  });
  

  // Tombol tambah
  document.querySelectorAll(".increase-quantity").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.closest(".cart-item").dataset.id;
      cart[id].quantity++;
      saveCart();
      renderCart();
    });
  });

  // Input manual
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", (e) => {
      const id = e.target.closest(".cart-item").dataset.id;
      const newQuantity = parseInt(e.target.value, 10);

      if (isNaN(newQuantity) || newQuantity < 1) {
        alert("Jumlah harus lebih dari 0!");
        e.target.value = cart[id].quantity;
      } else {
        cart[id].quantity = newQuantity;
        saveCart();
        renderCart();
      }
    });
  });
}

// Tombol "Checkout"
document.getElementById("checkout").addEventListener("click", () => {
  const total = calculateTotal();
  if (total === 0) {
    alert("Keranjang Anda kosong!");
    return;
  }

  const message = `Halo, saya ingin memesan produk berikut:\n\n` +
    Object.values(cart)
      .map(
        (product) =>
          `- ${product.name} (x${product.quantity}): Rp ${(product.price * product.quantity).toLocaleString("id-ID")}`
      )
      .join("\n") +
    `\n\nTotal: Rp ${total.toLocaleString("id-ID")}`;

  const waURL = `https://wa.me/6287776714687?text=${encodeURIComponent(message)}`;
  localStorage.removeItem("cart"); // Hapus keranjang setelah checkout
  window.location.href = waURL;
});



// Render keranjang saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Validasi bahwa `cart` adalah array
  if (!Array.isArray(cart)) {
    console.warn("Keranjang tidak valid saat dimuat, mengatur ulang ke array kosong.");
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  renderCart();
});


