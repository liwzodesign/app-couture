import { getProductById, formatPrice } from './data.js';
import { addToCart } from './cart.js';

document.addEventListener('DOMContentLoaded', async () => {
  const productId = getProductIdFromURL();
  if (!productId) {
    displayError('Produit non spécifié.');
    return;
  }

  try {
    const product = await getProductById(productId);
    if (!product) {
      displayError('Produit introuvable.');
      return;
    }
    displayProduct(product);
  } catch (error) {
    displayError('Produit introuvable.');
  }
});

function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function displayProduct(product) {
  const gallery = document.getElementById('product-gallery');
  const info = document.getElementById('product-info');

  // Clear previous content
  gallery.innerHTML = '';
  info.innerHTML = '';

  // Create main image with zoom on click
  const mainImage = document.createElement('img');
  mainImage.src = product.images[0];
  mainImage.alt = product.name;
  mainImage.className = 'main-product-image zoomable';
  mainImage.loading = 'lazy';
  mainImage.tabIndex = 0;
  mainImage.setAttribute('aria-label', 'Image principale du produit, cliquez pour agrandir');

  mainImage.addEventListener('click', () => {
    openImageModal(product.images[0]);
  });
  mainImage.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      openImageModal(product.images[0]);
    }
  });

  gallery.appendChild(mainImage);

  // Create thumbnails
  if (product.images.length > 1) {
    const thumbnailsContainer = document.createElement('div');
    thumbnailsContainer.className = 'thumbnails-container';

    product.images.forEach((imgSrc, index) => {
      const thumb = document.createElement('img');
      thumb.src = imgSrc;
      thumb.alt = `${product.name} - image ${index + 1}`;
      thumb.className = 'thumbnail-image zoomable';
      thumb.loading = 'lazy';
      thumb.tabIndex = 0;
      thumb.setAttribute('aria-label', `Voir l'image ${index + 1}`);

      thumb.addEventListener('click', () => {
        mainImage.src = imgSrc;
        openImageModal(imgSrc);
      });
      thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          mainImage.src = imgSrc;
          openImageModal(imgSrc);
        }
      });

      thumbnailsContainer.appendChild(thumb);
    });

    gallery.appendChild(thumbnailsContainer);
  }

  // Product info
  const discountedPrice = product.discount > 0
    ? product.price * (1 - product.discount / 100)
    : product.price;

  info.innerHTML = `
    <h1>${product.name}</h1>
    <p class="product-category">${product.category}</p>
    <p class="product-description">${product.description}</p>
    <p class="product-fabric"><strong>Tissu :</strong> ${product.fabric}</p>
    <p class="product-colors"><strong>Couleurs disponibles :</strong> ${product.colors.join(', ')}</p>
    <p class="product-sizes"><strong>Tailles disponibles :</strong> ${product.sizes.join(', ')}</p>
    <p class="product-price">
      ${product.discount > 0 ?
        `<span class="original-price">${formatPrice(product.price)}</span> ${formatPrice(discountedPrice)}` :
        formatPrice(product.price)}
    </p>
    <a href="/categories/catalogue.html" class="btn btn-secondary" aria-label="Retour au catalogue">Retour au catalogue</a>
    <button id="add-to-cart-btn" class="btn btn-primary" aria-label="Ajouter au panier">Ajouter au panier</button>
  `;

  addImageModal();

  const addToCartBtn = document.getElementById('add-to-cart-btn');
  addToCartBtn.addEventListener('click', () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: discountedPrice,
      image: product.images[0],
    });
  });
}

function displayError(message) {
  const main = document.querySelector('main');
  main.innerHTML = `<p class="error-message">${message}</p>`;
}

function addImageModal() {
  if (document.getElementById('image-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'image-modal';
  modal.className = 'image-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Zoom image produit');

  modal.innerHTML = `
    <div class="image-modal-content">
      <button id="modal-close" class="modal-close" aria-label="Fermer la fenêtre zoom">&times;</button>
      <img id="modal-image" src="" alt="Image zoomée du produit" />
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = document.getElementById('modal-close');
  const modalImage = document.getElementById('modal-image');

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    modalImage.src = '';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      modalImage.src = '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
      modalImage.src = '';
    }
  });
}

function openImageModal(src) {
  const modal = document.getElementById('image-modal');
  const modalImage = document.getElementById('modal-image');
  if (modal && modalImage) {
    modalImage.src = src;
    modal.style.display = 'block';
  }
}