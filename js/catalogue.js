import { loadProducts } from './data.js';

function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(price);
}
import { addToCart } from './cart.js';

document.addEventListener('DOMContentLoaded', async () => {
  const products = await loadProducts();
  const filtersForm = document.getElementById('filters-form');
  const resetButton = document.getElementById('reset-filters');
  const productsContainer = document.getElementById('products-container');

  // Initial display of all products
  displayProducts(products);

  // Handle filter form submission
  filtersForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const filters = getFilters();
    const filteredProducts = applyFilters(products, filters);
    displayProducts(filteredProducts);
  });

  // Handle reset filters
  resetButton.addEventListener('click', () => {
    filtersForm.reset();
    displayProducts(products);
  });

  // Get filters from form inputs
  function getFilters() {
    return {
      price: filtersForm['price'].value,
      type: filtersForm['type'].value,
      color: filtersForm['color'].value,
      fabric: filtersForm['fabric'].value,
      gender: filtersForm['gender'].value,
    };
  }

  // Apply filters to products array
  function applyFilters(products, filters) {
    return products.filter(product => {
      // Price filter
      if (filters.price) {
        const [min, max] = filters.price.split('-');
        const price = product.price;
        if (max) {
          if (price < parseInt(min) || price > parseInt(max)) return false;
        } else {
          if (price < parseInt(min)) return false;
        }
      }
      // Type filter
      if (filters.type && product.type !== filters.type) return false;
      // Color filter
      if (filters.color) {
        const colorFilter = filters.color.toLowerCase();
        if (!product.colors.some(c => c.toLowerCase().includes(colorFilter))) return false;
      }
      // Fabric filter
      if (filters.fabric) {
        if (!product.fabric.toLowerCase().includes(filters.fabric.toLowerCase())) return false;
      }
      // Gender filter
      if (filters.gender && product.gender !== filters.gender) return false;

      return true;
    });
  }

  // Display products in the container
  function displayProducts(products) {
    productsContainer.innerHTML = '';
    if (products.length === 0) {
      productsContainer.innerHTML = '<p>Aucun produit ne correspond aux filtres sélectionnés.</p>';
      return;
    }
    products.forEach(product => {
      const card = createProductCard(product);
      productsContainer.appendChild(card);
    });
  }

  // Create product card element with gallery thumbnails
  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    let tagHTML = '';
    if (product.isNew) {
      tagHTML = `<span class="product-tag">Nouveau</span>`;
    } else if (product.discount > 0) {
      tagHTML = `<span class="product-tag">-${product.discount}%</span>`;
    }

    const discountedPrice = product.discount > 0 
      ? product.price * (1 - product.discount / 100) 
      : product.price;

    // Main image and thumbnails gallery
    let galleryHTML = `
      <div class="product-image-main">
        <img src="${product.images[0]}" alt="${product.name}" loading="lazy" />
        ${tagHTML}
      </div>
    `;

    if (product.images.length > 1) {
      galleryHTML += `<div class="product-image-thumbnails">`;
      product.images.forEach((imgSrc, index) => {
        galleryHTML += `
          <img src="${imgSrc}" alt="${product.name} - image ${index + 1}" loading="lazy" class="thumbnail-image" data-index="${index}" />
        `;
      });
      galleryHTML += `</div>`;
    }

    card.innerHTML = `
      <div class="product-image">
        ${galleryHTML}
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <span class="product-category">${product.category}</span>
        <span class="product-price">
          ${product.discount > 0 ? 
            `<span class="original-price">${formatPrice(product.price)}</span> ${formatPrice(discountedPrice)}` : 
            formatPrice(product.price)}
        </span>
        <div class="product-actions">
          <a href="/categories/product-detail.html?id=${product.id}" class="view-btn" aria-label="Voir détails de ${product.name}">
            Voir détails <i class="fas fa-arrow-right"></i>
          </a>
          <button class="add-to-cart-btn" aria-label="Ajouter ${product.name} au panier">Ajouter au panier</button>
        </div>
      </div>
    `;

    // Add event listeners for thumbnail clicks to change main image
    if (product.images.length > 1) {
      const mainImage = card.querySelector('.product-image-main img');
      const thumbnails = card.querySelectorAll('.thumbnail-image');
      thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
          mainImage.src = thumb.src;
        });
      });
    }

    // Add event listener for add to cart button
    const addToCartBtn = card.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.discount > 0 ? discountedPrice : product.price,
        image: product.images[0],
      });
    });

    return card;
  }
});
