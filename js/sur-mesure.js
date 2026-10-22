import { loadTestimonials } from './data.js';

document.addEventListener('DOMContentLoaded', async () => {
  initAnimations();
  await loadCustomTestimonials();
});

// Animation for elements
function initAnimations() {
  // Animate hero elements
  const heroElements = document.querySelectorAll('.fade-in');
  heroElements.forEach((element, index) => {
    setTimeout(() => {
      element.style.animationDelay = `${index * 0.2}s`;
      element.classList.add('animate');
    }, 100);
  });
  
  // Animate elements on scroll with IntersectionObserver
  const elementsToAnimate = document.querySelectorAll('.intro-content, .process-step, .specialty-card, .testimonial-card, .cta-content');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  elementsToAnimate.forEach(element => {
    element.classList.add('animate-element');
    observer.observe(element);
  });
}

// Load testimonials specifically for custom tailoring
async function loadCustomTestimonials() {
  try {
    const testimonialSlider = document.getElementById('testimonial-slider');
    if (!testimonialSlider) return;
    
    // In a real app, we would fetch custom testimonials for the sur-mesure page
    // For now, we'll use the same testimonials but add a more specific content
    const testimonials = await loadTestimonials();
    
    // Add custom content related to tailoring
    const customTestimonials = testimonials.map(testimonial => {
      const customContent = getCustomTestimonialContent(testimonial.id);
      return {
        ...testimonial,
        content: customContent
      };
    });
    
    // Insert testimonial cards
    testimonialSlider.innerHTML = '';
    
    if (customTestimonials.length === 0) {
      testimonialSlider.innerHTML = '<p class="no-testimonials">Aucun témoignage pour le moment.</p>';
      return;
    }
    
    customTestimonials.forEach(testimonial => {
      const card = createTestimonialCard(testimonial);
      testimonialSlider.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading testimonials:', error);
    const testimonialSlider = document.getElementById('testimonial-slider');
    if (testimonialSlider) {
      testimonialSlider.innerHTML = '<p class="no-testimonials">Erreur lors du chargement des témoignages.</p>';
    }
  }
}

// Get custom testimonial content based on ID
function getCustomTestimonialContent(id) {
  const customContents = [
    "Le costume sur mesure que j'ai commandé chez Couturier Créatif était parfait pour mon mariage. La qualité du tissu, les finitions impeccables et l'ajustement parfait ont fait toute la différence. Je me sentais élégant et à l'aise tout au long de cette journée spéciale.",
    "Ma robe de soirée sur mesure a été confectionnée avec un soin incroyable. Les détails personnalisés que j'ai pu choisir ont rendu cette pièce vraiment unique. J'ai reçu de nombreux compliments et je me sentais vraiment belle dans cette création.",
    "Pour mes costumes professionnels, je ne fais plus confiance qu'à Couturier Créatif. La différence entre un costume de confection et un costume sur mesure est incomparable. L'investissement en vaut vraiment la peine pour un vêtement qui durera des années."
  ];
  
  // Return content based on ID (using modulo to ensure we stay within array bounds)
  return customContents[(id - 1) % customContents.length];
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