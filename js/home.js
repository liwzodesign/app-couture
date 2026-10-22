import { formatPrice } from './main.js';
import { loadProducts, loadTestimonials } from './data.js';

// Featured products data
document.addEventListener('DOMContentLoaded', async () => {
  initFeaturedProducts();
  initTestimonials();
  initAnimations();
});

async function initFeaturedProducts() {
  try {
    const featuredCarousel = document.getElementById('featured-carousel');
    if (!featuredCarousel) return;
    
    const products = await loadProducts();
    
    // Filter to get only featured products
    const featuredProducts = products.filter(product => product.featured).slice(0, 4);
    
    // Insert product cards
    featuredCarousel.innerHTML = '';
    
    if (featuredProducts.length === 0) {
      featuredCarousel.innerHTML = '<p class="no-products">Aucun produit en vedette pour le moment.</p>';
      return;
    }
    
    featuredProducts.forEach(product => {
      const card = createProductCard(product);
      featuredCarousel.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading featured products:', error);
    const featuredCarousel = document.getElementById('featured-carousel');
    if (featuredCarousel) {
      featuredCarousel.innerHTML = '<p class="no-products">Erreur lors du chargement des produits.</p>';
    }
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
        <a href="/categories/product-detail.html?id=${product.id}" class="view-btn">
          Voir détails <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
  
  return card;
}

async function initTestimonials() {
  try {
    const testimonialsContainer = document.getElementById('testimonials-container');
    if (!testimonialsContainer) return;
    
    const testimonials = await loadTestimonials();
    
    // Insert testimonial cards
    testimonialsContainer.innerHTML = '';
    
    if (testimonials.length === 0) {
      testimonialsContainer.innerHTML = '<p class="no-testimonials">Aucun témoignage pour le moment.</p>';
      return;
    }
    
    testimonials.forEach(testimonial => {
      const card = createTestimonialCard(testimonial);
      testimonialsContainer.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading testimonials:', error);
    const testimonialsContainer = document.getElementById('testimonials-container');
    if (testimonialsContainer) {
      testimonialsContainer.innerHTML = '<p class="no-testimonials">Erreur lors du chargement des témoignages.</p>';
    }
  }
}

function createTestimonialCard(testimonial) {
  const card = document.createElement('div');
  card.className = 'testimonial-card';
  
  card.innerHTML = `
    <div class="testimonial-content">
      <p>${testimonial.content}</p>
    </div>
    <div class="testimonial-author">
      <img src="${testimonial.image}" alt="${testimonial.name}" class="testimonial-author-img" loading="lazy">
      <div class="testimonial-author-info">
        <h4>${testimonial.name}</h4>
        <p>${testimonial.role}</p>
      </div>
    </div>
  `;
  
  return card;
}

function initAnimations() {
  // Fade in hero elements
  const heroElements = document.querySelectorAll('.fade-in');
  heroElements.forEach((element, index) => {
    setTimeout(() => {
      element.style.animationDelay = `${index * 0.2}s`;
      element.classList.add('animate');
    }, 100);
  });
  
  // Animate elements on scroll
  const elementsToAnimate = document.querySelectorAll('.section-header, .product-card, .category-card, .testimonial-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  elementsToAnimate.forEach(element => {
    observer.observe(element);
  });
}
