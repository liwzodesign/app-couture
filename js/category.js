import { formatPrice } from './main.js';
import { searchProducts, getProductsByGender } from './data.js';

document.addEventListener('DOMContentLoaded', async () => {
  initCategoryPage();
  initFilterHandlers();
});

// Get current category from the page URL
function getCurrentCategory() {
  const path = window.location.pathname;
  if (path.includes('/categories/homme')) {
    return 'homme';
  } else if (path.includes('/categories/femme')) {
    return 'femme';
  }
  return null;
}

// Initialize category page
async function initCategoryPage() {
  const category = getCurrentCategory();
  
  if (!category) {
    console.error('Category not found');
    return;
  }
  
  // Update banner for the category page
  updateCategoryBanner(category);
  
  // Load products for this category
  await loadCategoryProducts(category);
  
  // Initialize pagination
  initPagination();
  
  // Make filter toggle work
  initFilterToggle();
}

function updateCategoryBanner(category) {
  const banner = document.querySelector('.category-banner');
  if (!banner) return;
  
  // Update banner background image based on category
  if (category === 'homme') {
    banner.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/category-men-banner.jpg')";
  } else if (category === 'femme') {
    banner.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/category-women-banner.jpg')";
  }
}

async function loadCategoryProducts(category, filters = {}) {
  try {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;
    
    // Show loading state
    productsContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
    
    // Get products for this category
    const products = await getProductsByGender(category);
    
    // Apply any filters
    let filteredProducts = products;
    
    // Filter by type
    if (filters.type) {
      filteredProducts = filteredProducts.filter(p => p.type === filters.type);
    }
    
    // Filter by price range
    if (filters.price) {
      const [min, max] = filters.price.split('-').map(p => parseInt(p) || 0);
      
      if (max) {
        filteredProducts = filteredProducts.filter(p => p.price >= min && p.price <= max);
      } else {
        // For "100000+" case
        filteredProducts = filteredProducts.filter(p => p.price >= min);
      }
    }
    
    // Filter by color
    if (filters.color) {
      const colorFilter = filters.color.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.colors.some(c => c.toLowerCase() === colorFilter)
      );
    }
    
    // Sort products
    if (filters.sort) {
      sortProducts(filteredProducts, filters.sort);
    }
    
    // Display products
    productsContainer.innerHTML = '';
    
    if (filteredProducts.length === 0) {
      productsContainer.innerHTML = `
        <div class="no-products">
          <i class="fas fa-search"></i>
          <h3>Aucun produit trouvé</h3>
          <p>Essayez de modifier vos filtres ou de faire une recherche différente.</p>
        </div>
      `;
      return;
    }
    
    // Create product cards
    filteredProducts.forEach(product => {
      const card = createProductCard(product);
      productsContainer.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading category products:', error);
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
      productsContainer.innerHTML = `
        <div class="no-products">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Erreur de chargement</h3>
          <p>Impossible de charger les produits. Veuillez réessayer plus tard.</p>
        </div>
      `;
    }
  }
}

function sortProducts(products, sortBy) {
  switch (sortBy) {
    case 'price-low':
      products.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      products.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      products.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'newest':
      products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      break;
    default:
      // No sorting
      break;
  }
}

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
  
  card.innerHTML = `
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      ${tagHTML}
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
        <a href="/product-detail.html?id=${product.id}" class="view-btn">
          Voir détails <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
  
  return card;
}

function initFilterHandlers() {
  const category = getCurrentCategory();
  if (!category) return;
  
  // Search input
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  
  if (searchInput && searchBtn) {
    // Search on enter key
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        applyFilters();
      }
    });
    
    // Search on button click
    searchBtn.addEventListener('click', () => {
      applyFilters();
    });
  }
  
  // Filter selects
  const typeFilter = document.getElementById('type-filter');
  const priceFilter = document.getElementById('price-filter');
  const colorFilter = document.getElementById('color-filter');
  const sortBy = document.getElementById('sort-by');
  
  // Add change event listeners to all filters
  [typeFilter, priceFilter, colorFilter, sortBy].forEach(filter => {
    if (filter) {
      filter.addEventListener('change', () => {
        applyFilters();
      });
    }
  });
  
  // Function to gather all filter values and apply them
  function applyFilters() {
    const filters = {
      gender: category
    };
    
    // Get search query
    if (searchInput && searchInput.value.trim()) {
      filters.query = searchInput.value.trim();
    }
    
    // Get type filter
    if (typeFilter && typeFilter.value) {
      filters.type = typeFilter.value;
    }
    
    // Get price filter
    if (priceFilter && priceFilter.value) {
      filters.price = priceFilter.value;
    }
    
    // Get color filter
    if (colorFilter && colorFilter.value) {
      filters.color = colorFilter.value;
    }
    
    // Get sort option
    if (sortBy && sortBy.value) {
      filters.sort = sortBy.value;
    }
    
    // Load products with filters
    loadCategoryProducts(category, filters);
  }
}

function initPagination() {
  const pageNumbers = document.querySelectorAll('.page-number');
  const prevPageBtn = document.querySelector('.prev-page');
  const nextPageBtn = document.querySelector('.next-page');
  
  if (pageNumbers.length > 0) {
    pageNumbers.forEach((pageNumber) => {
      pageNumber.addEventListener('click', () => {
        // Remove active class from all pages
        pageNumbers.forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked page
        pageNumber.classList.add('active');
        
        // In a real application, this would load the products for the selected page
        // For this demo, we'll just scroll to the top of the products section
        const productsSection = document.querySelector('.products-section');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
  
  if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
      const activePage = document.querySelector('.page-number.active');
      const prevPage = activePage?.previousElementSibling;
      
      if (prevPage && prevPage.classList.contains('page-number')) {
        prevPage.click();
      }
    });
  }
  
  if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
      const activePage = document.querySelector('.page-number.active');
      const nextPage = activePage?.nextElementSibling;
      
      if (nextPage && nextPage.classList.contains('page-number')) {
        nextPage.click();
      }
    });
  }
}

function initFilterToggle() {
  const filterToggleBtn = document.querySelector('.filter-toggle-btn');
  const filterOptions = document.querySelector('.filter-options');
  
  if (filterToggleBtn && filterOptions) {
    filterToggleBtn.addEventListener('click', () => {
      filterOptions.classList.toggle('active');
      
      // Update aria-expanded attribute
      const isExpanded = filterOptions.classList.contains('active');
      filterToggleBtn.setAttribute('aria-expanded', isExpanded);
    });
  }
}