import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { Workbox } from 'workbox-window';

const firebaseConfig = {
  // Your Firebase config here
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const appState = {
  isMenuOpen: false,
  installPromptEvent: null,
  currentPage: getCurrentPage(),
  isLoggedIn: false,
  userData: null,
};

function getCurrentPage() {
  const path = window.location.pathname;
  
  if (path === '/' || path === '/index.html') return 'home';
  if (path.includes('/categories/homme')) return 'homme';
  if (path.includes('/categories/femme')) return 'femme';
  if (path.includes('/sur-mesure')) return 'sur-mesure';
  if (path.includes('/contact')) return 'contact';
  if (path.includes('/admin')) return 'admin';
  if (path.includes('/product-detail')) return 'product-detail';
  
  return 'other';
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initServiceWorker();
  handlePWAInstall();
  
  // Delay animations for smoother page load
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 300);
});

// Navigation functions
function initNavigation() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      appState.isMenuOpen = !appState.isMenuOpen;
      navLinks.classList.toggle('active', appState.isMenuOpen);
      
      // Update ARIA attributes
      menuToggle.setAttribute('aria-expanded', appState.isMenuOpen);
      
      // Animate hamburger icon
      const hamburger = menuToggle.querySelector('.hamburger');
      hamburger.classList.toggle('active', appState.isMenuOpen);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (appState.isMenuOpen && !e.target.closest('.main-nav')) {
        appState.isMenuOpen = false;
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.querySelector('.hamburger').classList.remove('active');
      }
    });
    
    // Close menu when window is resized beyond mobile breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && appState.isMenuOpen) {
        appState.isMenuOpen = false;
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.querySelector('.hamburger').classList.remove('active');
      }
    });
  }
  
  // Add scroll event for header
  const header = document.getElementById('app-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

// Service Worker registration
async function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const wb = new Workbox('/sw.js');
      
      wb.addEventListener('installed', (event) => {
        if (event.isUpdate) {
          // Show update toast
          showToast('Application mise à jour. Veuillez rafraîchir la page pour les nouvelles fonctionnalités.', 'info', 10000);
        }
      });
      
      wb.addEventListener('waiting', () => {
        // Show update available message
        showUpdateAvailableMessage();
      });
      
      await wb.register();
      console.log('Service Worker registered successfully');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

// PWA Installation handler
function handlePWAInstall() {
  // Store the install prompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    appState.installPromptEvent = e;
    showInstallPrompt();
  });
  
  // Handle install button click
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.addEventListener('click', async () => {
      if (appState.installPromptEvent) {
        appState.installPromptEvent.prompt();
        const choiceResult = await appState.installPromptEvent.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          hideInstallPrompt();
        } else {
          console.log('User dismissed the install prompt');
        }
        
        appState.installPromptEvent = null;
      }
    });
  }
  
  // Handle dismiss button click
  const dismissButton = document.getElementById('dismiss-button');
  if (dismissButton) {
    dismissButton.addEventListener('click', () => {
      hideInstallPrompt();
      // Don't show prompt again for 7 days
      localStorage.setItem('installPromptDismissed', Date.now().toString());
    });
  }
}

function showInstallPrompt() {
  const lastDismissed = localStorage.getItem('installPromptDismissed');
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  
  // Only show if not dismissed in the last 7 days and not already installed
  if ((!lastDismissed || Date.now() - parseInt(lastDismissed) > sevenDaysInMs) && 
      !window.matchMedia('(display-mode: standalone)').matches) {
    const installPrompt = document.getElementById('install-prompt');
    if (installPrompt) {
      setTimeout(() => {
        installPrompt.classList.add('show');
      }, 3000);
    }
  }
}

function hideInstallPrompt() {
  const installPrompt = document.getElementById('install-prompt');
  if (installPrompt) {
    installPrompt.classList.remove('show');
  }
}

// Toast notifications
function showToast(message, type = 'info', duration = 5000) {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span>${message}</span>
    </div>
    <button class="toast-close" aria-label="Fermer">&times;</button>
  `;
  
  // Add to container
  toastContainer.appendChild(toast);
  
  // Show with animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Close button functionality
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  });
  
  // Auto remove after duration
  if (duration > 0) {
    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.remove('show');
        setTimeout(() => {
          toast.remove();
        }, 300);
      }
    }, duration);
  }
}

// Update available message
function showUpdateAvailableMessage() {
  const updateMessage = document.createElement('div');
  updateMessage.className = 'update-message';
  updateMessage.innerHTML = `
    <div class="update-message-content">
      <p>Une nouvelle version est disponible</p>
      <div class="update-buttons">
        <button id="update-button" class="btn btn-primary">Mettre à jour</button>
        <button id="update-later-button" class="btn btn-secondary">Plus tard</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(updateMessage);
  
  setTimeout(() => {
    updateMessage.classList.add('show');
  }, 10);
  
  document.getElementById('update-button').addEventListener('click', () => {
    window.location.reload();
  });
  
  document.getElementById('update-later-button').addEventListener('click', () => {
    updateMessage.classList.remove('show');
    setTimeout(() => {
      updateMessage.remove();
    }, 300);
  });
}

// Utility functions
function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

// Export utility functions
export { 
  appState, 
  showToast, 
  formatPrice 
};
