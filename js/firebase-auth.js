import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const logoutBtn = document.getElementById('logout-btn');
const userDisplay = document.getElementById('user-display');

// Monitor auth state
onAuthStateChanged(auth, user => {
  if (user) {
    if (userDisplay) {
      userDisplay.textContent = `Connecté en tant que ${user.email}`;
    }
    if (logoutBtn) {
      logoutBtn.style.display = 'inline-block';
    }
    if (loginForm) {
      loginForm.style.display = 'none';
    }
    if (signupForm) {
      signupForm.style.display = 'none';
    }
    // Show admin link if user is admin
    const adminEmail = "baliou218@gmail.com";
    const adminLink = document.getElementById('admin-link');
    if (adminLink) {
      if (user.email === adminEmail) {
        adminLink.style.display = 'block';
      } else {
        adminLink.style.display = 'none';
      }
    }
  } else {
    if (userDisplay) {
      userDisplay.textContent = '';
    }
    if (logoutBtn) {
      logoutBtn.style.display = 'none';
    }
    if (loginForm) {
      loginForm.style.display = 'block';
    }
    if (signupForm) {
      signupForm.style.display = 'block';
    }
    // Hide admin link when logged out
    const adminLink = document.getElementById('admin-link');
    if (adminLink) {
      adminLink.style.display = 'none';
    }
  }
});

// Login
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm['email'].value;
    const password = loginForm['password'].value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Connexion réussie');
      loginForm.reset();
    } catch (error) {
      alert('Erreur de connexion : ' + error.message);
    }
  });
}

// Signup
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = signupForm['email'].value;
    const password = signupForm['password'].value;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Inscription réussie');
      signupForm.reset();
    } catch (error) {
      alert('Erreur d\'inscription : ' + error.message);
    }
  });
}

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      await signOut(auth);
      alert('Déconnexion réussie');
    } catch (error) {
      alert('Erreur lors de la déconnexion : ' + error.message);
    }
  });
}
