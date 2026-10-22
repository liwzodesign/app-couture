const cartContainer = document.getElementById('cart-container');
const clearCartBtn = document.getElementById('clear-cart');
const checkoutBtn = document.getElementById('checkout');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to calculate total price
function calculateTotal() {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Function to add product to cart
export function addToCart(product) {
  const existingIndex = cart.findIndex(item => item.id === product.id);
  if (existingIndex !== -1) {
    cart[existingIndex].quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  alert(`${product.name} a été ajouté au panier.`);
}

// Function to display cart items
function displayCart() {
  if (!cartContainer) return;

  cartContainer.innerHTML = '';

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Votre panier est vide.</p>';
    checkoutBtn.disabled = true;
    clearCartBtn.disabled = true;
    return;
  }

  checkoutBtn.disabled = false;
  clearCartBtn.disabled = false;

  cart.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';

    itemDiv.innerHTML = `
      <div class="cart-item-info">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image" />
        <div>
          <h3>${item.name}</h3>
          <p>Prix unitaire : ${formatPrice(item.price)}</p>
          <p>Quantité : 
            <button class="quantity-btn" data-index="${index}" data-action="decrease" aria-label="Diminuer la quantité">-</button>
            ${item.quantity}
            <button class="quantity-btn" data-index="${index}" data-action="increase" aria-label="Augmenter la quantité">+</button>
          </p>
          <p>Sous-total : ${formatPrice(item.price * item.quantity)}</p>
        </div>
      </div>
      <button class="remove-btn" data-index="${index}" aria-label="Supprimer cet article du panier"><i class="fas fa-trash"></i></button>
    `;

    cartContainer.appendChild(itemDiv);
  });

  const totalDiv = document.createElement('div');
  totalDiv.className = 'cart-total';
  totalDiv.innerHTML = `<h3>Total : ${formatPrice(calculateTotal())}</h3>`;
  cartContainer.appendChild(totalDiv);

  // Add event listeners for quantity buttons and remove buttons
  const quantityButtons = cartContainer.querySelectorAll('.quantity-btn');
  quantityButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-index'));
      const action = button.getAttribute('data-action');
      if (action === 'increase') {
        cart[index].quantity++;
      } else if (action === 'decrease' && cart[index].quantity > 1) {
        cart[index].quantity--;
      }
      saveCart();
      displayCart();
    });
  });

  const removeButtons = cartContainer.querySelectorAll('.remove-btn');
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-index'));
      cart.splice(index, 1);
      saveCart();
      displayCart();
    });
  });
}

// Clear cart
if (clearCartBtn) {
  clearCartBtn.addEventListener('click', () => {
    if (confirm('Voulez-vous vraiment vider le panier ?')) {
      cart = [];
      saveCart();
      displayCart();
    }
  });
}

// Stripe public test key (example)
const stripePublicKey = 'pk_test_51MxxxxxxYourTestKeyHere';

// Load Stripe.js script dynamically
function loadStripeScript() {
  return new Promise((resolve, reject) => {
    if (window.Stripe) {
      resolve(window.Stripe);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.onload = () => resolve(window.Stripe);
    script.onerror = () => reject(new Error('Failed to load Stripe.js'));
    document.head.appendChild(script);
  });
}

// Checkout button with Stripe integration
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', async () => {
    if (cart.length === 0) {
      alert('Votre panier est vide.');
      return;
    }
    try {
      const Stripe = await loadStripeScript();
      const stripe = Stripe(stripePublicKey);

      // Create a checkout session on the server or simulate here
      // Since no backend, simulate a checkout session with line items

      const lineItems = cart.map(item => ({
        price_data: {
          currency: 'xof',
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100), // amount in cents
        },
        quantity: item.quantity,
      }));

      // Redirect to Stripe Checkout (using Stripe's client-only integration for demo)
      const { error } = await stripe.redirectToCheckout({
        lineItems: lineItems,
        mode: 'payment',
        successUrl: window.location.origin + '/success.html',
        cancelUrl: window.location.origin + '/cart.html',
      });

      if (error) {
        alert(error.message);
      }
    } catch (err) {
      alert('Erreur lors de la tentative de paiement : ' + err.message);
    }
  });
}

// Format price helper (assuming prices are in XOF)
function formatPrice(price) {
  return price.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' });
}

document.addEventListener('DOMContentLoaded', () => {
  displayCart();
});
