import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Elements
const addCreationForm = document.getElementById('add-creation-form');
const creationMessage = document.getElementById('creation-message');
const ordersList = document.getElementById('orders-list');
const logoutBtn = document.getElementById('logout-btn');

const adminEmail = "baliou218@gmail.com";

// Check admin authentication and access control
onAuthStateChanged(auth, user => {
  if (user) {
    if (user.email !== adminEmail) {
      alert("Accès refusé : vous n'êtes pas administrateur.");
      window.location.href = "/login.html";
    } else {
      if (logoutBtn) {
        logoutBtn.style.display = 'inline-block';
        logoutBtn.addEventListener('click', async () => {
          await signOut(auth);
          window.location.href = "/login.html";
        });
      }
      loadOrders();
    }
  } else {
    window.location.href = "/login.html";
  }
});

// Add new creation to Firestore
async function addCreation(data) {
  try {
    const creationsCollection = collection(db, 'creations');
    const docRef = await addDoc(creationsCollection, data);
    return docRef.id;
  } catch (error) {
    throw new Error("Erreur lors de l'ajout de la création : " + error.message);
  }
}

// Load all orders for admin
async function loadOrders() {
  try {
    const ordersCollection = collection(db, 'orders');
    const querySnapshot = await getDocs(ordersCollection);
    ordersList.innerHTML = '';
    querySnapshot.forEach(doc => {
      const order = { id: doc.id, ...doc.data() };
      const orderDiv = document.createElement('div');
      orderDiv.className = 'order-item';
      orderDiv.innerHTML = `
        <p><strong>Commande ID:</strong> ${order.id}</p>
        <p><strong>Utilisateur:</strong> ${order.userId}</p>
        <p><strong>Statut:</strong> ${order.status}</p>
        <p><strong>Total:</strong> ${order.total} XOF</p>
        <button data-id="${order.id}" class="update-status-btn">Marquer comme expédiée</button>
        <hr/>
      `;
      ordersList.appendChild(orderDiv);
    });
    // Add event listeners for update buttons
    document.querySelectorAll('.update-status-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const orderId = e.target.getAttribute('data-id');
        await updateOrderStatus(orderId, 'shipped');
        loadOrders();
      });
    });
  } catch (error) {
    ordersList.innerHTML = `<p>Erreur lors du chargement des commandes : ${error.message}</p>`;
  }
}

// Update order status
async function updateOrderStatus(orderId, status) {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
  } catch (error) {
    alert("Erreur lors de la mise à jour du statut : " + error.message);
  }
}

// Handle form submission
if (addCreationForm) {
  addCreationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = addCreationForm['name'].value.trim();
    const description = addCreationForm['description'].value.trim();
    const price = parseFloat(addCreationForm['price'].value);
    const imageUrl = addCreationForm['imageUrl'].value.trim();

    if (!name || !description || isNaN(price) || !imageUrl) {
      creationMessage.textContent = "Veuillez remplir tous les champs correctement.";
      return;
    }

    try {
      await addCreation({ name, description, price, imageUrl, createdAt: new Date() });
      creationMessage.textContent = "Création ajoutée avec succès.";
      addCreationForm.reset();
    } catch (error) {
      creationMessage.textContent = error.message;
    }
  });
}
