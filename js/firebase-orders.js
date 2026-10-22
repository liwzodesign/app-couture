import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Save order to Firestore
export async function saveOrder(order) {
  if (!auth.currentUser) {
    throw new Error('Utilisateur non authentifié');
  }
  const ordersCollection = collection(db, 'orders');
  const orderData = {
    userId: auth.currentUser.uid,
    items: order.items,
    total: order.total,
    createdAt: new Date(),
    status: 'pending'
  };
  const docRef = await addDoc(ordersCollection, orderData);
  return docRef.id;
}

// Update stock quantity for a product
export async function updateStock(productId, quantityPurchased) {
  const productRef = doc(db, 'products', productId);
  // Get current stock
  const productSnap = await getDocs(query(collection(db, 'products'), where('id', '==', productId)));
  if (productSnap.empty) {
    throw new Error('Produit non trouvé');
  }
  const productDoc = productSnap.docs[0];
  const currentStock = productDoc.data().stock || 0;
  const newStock = currentStock - quantityPurchased;
  if (newStock < 0) {
    throw new Error('Stock insuffisant');
  }
  await updateDoc(productRef, { stock: newStock });
}

// Get orders for current user
export async function getUserOrders() {
  if (!auth.currentUser) {
    throw new Error('Utilisateur non authentifié');
  }
  const ordersCollection = collection(db, 'orders');
  const q = query(ordersCollection, where('userId', '==', auth.currentUser.uid));
  const querySnapshot = await getDocs(q);
  const orders = [];
  querySnapshot.forEach(doc => {
    orders.push({ id: doc.id, ...doc.data() });
  });
  return orders;
}
