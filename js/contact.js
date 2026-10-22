document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initFaqAccordion();
});

// Contact form handling
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Simple form validation
      if (!validateForm(contactForm)) {
        return;
      }
      
      // Show loading state
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
      
      // Remove any existing message
      const existingMessage = contactForm.querySelector('.form-message');
      if (existingMessage) {
        existingMessage.remove();
      }
      
      try {
        // In a real app, this would be an actual API call
        // For demo purposes, we'll simulate an API request with a timeout
        await simulateFormSubmission(contactForm);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-message success';
        successMessage.innerHTML = `
          <i class="fas fa-check-circle"></i>
          <p>Votre message a été envoyé avec succès. Nous vous contacterons très bientôt.</p>
        `;
        contactForm.appendChild(successMessage);
        
        // Reset form
        contactForm.reset();
        
      } catch (error) {
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'form-message error';
        errorMessage.innerHTML = `
          <i class="fas fa-exclamation-circle"></i>
          <p>Une erreur est survenue lors de l'envoi du message. Veuillez réessayer plus tard.</p>
        `;
        contactForm.appendChild(errorMessage);
        
        console.error('Form submission error:', error);
      } finally {
        // Restore button state
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        
        // Scroll to the message
        const message = contactForm.querySelector('.form-message');
        if (message) {
          message.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }
}

// Simulate form submission with a Promise
function simulateFormSubmission(form) {
  return new Promise((resolve, reject) => {
    // Get form data
    const formData = new FormData(form);
    const formObject = {};
    
    formData.forEach((value, key) => {
      formObject[key] = value;
    });
    
    console.log('Form data that would be sent:', formObject);
    
    // Simulate network request delay (1-2 seconds)
    setTimeout(() => {
      // Randomly succeed or fail (90% success rate for demo)
      const shouldSucceed = Math.random() < 0.9;
      
      if (shouldSucceed) {
        resolve({ success: true, message: 'Message sent successfully' });
      } else {
        reject(new Error('Network error'));
      }
    }, 1000 + Math.random() * 1000);
  });
}

// Basic form validation
function validateForm(form) {
  let isValid = true;
  const requiredFields = form.querySelectorAll('[required]');
  
  // Remove any previous validation messages
  const previousErrors = form.querySelectorAll('.validation-error');
  previousErrors.forEach(error => error.remove());
  
  // Check each required field
  requiredFields.forEach(field => {
    // Remove any previous error styling
    field.classList.remove('error');
    
    if (!field.value.trim()) {
      isValid = false;
      field.classList.add('error');
      
      // Add error message after the field
      const errorMessage = document.createElement('div');
      errorMessage.className = 'validation-error';
      errorMessage.textContent = 'Ce champ est requis';
      errorMessage.style.color = 'var(--color-error)';
      errorMessage.style.fontSize = '0.875rem';
      errorMessage.style.marginTop = '0.25rem';
      
      field.parentNode.appendChild(errorMessage);
    }
    
    // Email validation
    if (field.type === 'email' && field.value.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(field.value.trim())) {
        isValid = false;
        field.classList.add('error');
        
        // Add error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'validation-error';
        errorMessage.textContent = 'Veuillez entrer une adresse email valide';
        errorMessage.style.color = 'var(--color-error)';
        errorMessage.style.fontSize = '0.875rem';
        errorMessage.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorMessage);
      }
    }
  });
  
  return isValid;
}

// FAQ Accordion functionality
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Check if this item is already active
      const isActive = item.classList.contains('active');
      
      // Close all items
      faqItems.forEach(faq => {
        faq.classList.remove('active');
      });
      
      // If the clicked item wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
  
  // Open the first FAQ item by default
  if (faqItems.length > 0) {
    faqItems[0].classList.add('active');
  }
}