const products = [
  {
    id: 1,
    name: "Costume trois pièces en laine",
    category: "Costume",
    price: 150000,
    discount: 0,
    image: "/assets/images/Costume trois pièces en laine.jpg",
    images: [
      "/assets/images/Costume trois pièces en laine.jpg"
    ],
    description: "Costume trois pièces élégant taillé dans une laine de qualité supérieure. Parfait pour les occasions formelles.",
    colors: ["Noir", "Bleu marine", "Gris"],
    sizes: ["48", "50", "52", "54"],
    fabric: "Laine 100%",
    featured: true,
    isNew: true,
    gender: "homme",
    type: "costume"
  },
  {
    id: 2,
    name: "Chemise en lin blanc",
    category: "Chemise",
    price: 45000,
    discount: 10,
    image: "/assets/images/Chemise en lin blanc.jpg",
    images: [
      "/assets/images/Chemise en lin blanc.jpg"
    ],
    description: "Chemise en lin de qualité supérieure, idéale pour les journées chaudes. Coupe ajustée et confortable.",
    colors: ["Blanc", "Beige", "Bleu clair"],
    sizes: ["S", "M", "L", "XL"],
    fabric: "Lin 100%",
    featured: true,
    isNew: false,
    gender: "homme",
    type: "chemise"
  },
  {
    id: 3,
    name: "Pantalon slim en coton",
    category: "Pantalon",
    price: 35000,
    discount: 0,
    image: "/assets/images/Pantalon slim en coton.jpg",
    images: [
      "/assets/images/Pantalon slim en coton.jpg"
    ],
    description: "Pantalon slim en coton stretch pour un confort optimal. Parfait pour un style décontracté chic.",
    colors: ["Noir", "Beige", "Bleu foncé"],
    sizes: ["40", "42", "44", "46"],
    fabric: "Coton 98%, Élasthanne 2%",
    featured: false,
    isNew: false,
    gender: "homme",
    type: "pantalon"
  },
  {
    id: 4,
    name: "Veste en tweed",
    category: "Veste",
    price: 85000,
    discount: 0,
    image: "/assets/images/Veste en tweed.jpg",
    images: [
      "/assets/images/Veste en tweed.jpg"
    ],
    description: "Veste en tweed élégante, parfaite pour un style distingué et intemporel.",
    colors: ["Gris", "Marron"],
    sizes: ["48", "50", "52", "54"],
    fabric: "Tweed de laine",
    featured: true,
    isNew: false,
    gender: "homme",
    type: "veste"
  },
  {
    id: 5,
    name: "Robe de soirée en soie",
    category: "Robe",
    price: 120000,
    discount: 0,
    image: "/assets/images/Robe de soirée en soie.jpg",
    images: [
      "/assets/images/Robe de soirée en soie.jpg"
    ],
    description: "Élégante robe de soirée en soie, idéale pour les occasions spéciales. Coupe ajustée et fluide.",
    colors: ["Noir", "Rouge", "Bleu nuit"],
    sizes: ["36", "38", "40", "42"],
    fabric: "Soie 100%",
    featured: true,
    isNew: true,
    gender: "femme",
    type: "robe"
  },
  {
    id: 6,
    name: "Ensemble tailleur femme",
    category: "Tailleur",
    price: 95000,
    discount: 15,
    image: "/assets/images/Ensemble tailleur femme.jpg",
    images: [
      "/assets/images/Ensemble tailleur femme.jpg"
    ],
    description: "Ensemble tailleur moderne et élégant, parfait pour le bureau ou les occasions formelles.",
    colors: ["Noir", "Blanc", "Gris"],
    sizes: ["36", "38", "40", "42", "44"],
    fabric: "Polyester 65%, Viscose 30%, Élasthanne 5%",
    featured: false,
    isNew: false,
    gender: "femme",
    type: "tailleur"
  },
  {
    id: 7,
    name: "Blouse en mousseline",
    category: "Blouse",
    price: 28000,
    discount: 0,
    image: "/assets/images/Blouse en mousseline.jpg",
    images: [
      "/assets/images/Blouse en mousseline.jpg"
    ],
    description: "Blouse légère en mousseline, parfaite pour un look élégant au quotidien.",
    colors: ["Blanc", "Rose pâle", "Bleu ciel"],
    sizes: ["XS", "S", "M", "L", "XL"],
    fabric: "Mousseline de soie",
    featured: true,
    isNew: false,
    gender: "femme",
    type: "blouse"
  },
  {
    id: 8,
    name: "Jupe crayon en laine",
    category: "Jupe",
    price: 42000,
    discount: 0,
    image: "/assets/images/Jupe crayon en laine.jpg",
    images: [
      "/assets/images/Jupe crayon en laine.jpg"
    ],
    description: "Jupe crayon élégante en laine, confortable et stylée pour un look professionnel.",
    colors: ["Noir", "Gris", "Bleu marine"],
    sizes: ["36", "38", "40", "42", "44"],
    fabric: "Laine 95%, Élasthanne 5%",
    featured: false,
    isNew: true,
    gender: "femme",
    type: "jupe"
  }
];

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "Amadou Diop",
    role: "Client satisfait",
    image: "https://images.pexels.com/photos/837358/pexels-photo-837358.jpeg?auto=compress&cs=tinysrgb&w=100",
    content: "Le costume sur mesure que j'ai commandé est parfait. La qualité du tissu et la précision de la coupe sont remarquables. Je recommande vivement."
  },
  {
    id: 2,
    name: "Fatou Ndiaye",
    role: "Cliente fidèle",
    image: "https://images.pexels.com/photos/1820919/pexels-photo-1820919.jpeg?auto=compress&cs=tinysrgb&w=100",
    content: "Ma robe de soirée a fait sensation lors de l'événement. Le service client est impeccable et les délais ont été respectés. Je reviendrai sans hésiter."
  },
  {
    id: 3,
    name: "Omar Sall",
    role: "Entrepreneur",
    image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100",
    content: "Je commande régulièrement mes chemises professionnelles ici. La qualité est constante et le rapport qualité-prix est excellent."
  }
];

// Function to load products with delay to simulate API request
export function loadProducts() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products);
    }, 300);
  });
}

// Function to get product by ID
export function getProductById(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = products.find(p => p.id === parseInt(id));
      if (product) {
        resolve(product);
      } else {
        reject(new Error('Product not found'));
      }
    }, 300);
  });
}

// Function to get products by gender
export function getProductsByGender(gender) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredProducts = products.filter(p => p.gender === gender);
      resolve(filteredProducts);
    }, 300);
  });
}

// Function to load testimonials with delay to simulate API request
export function loadTestimonials() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(testimonials);
    }, 300);
  });
}

// Search products function
export function searchProducts(query, filters = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredProducts = [...products];
      
      // Apply text search
      if (query) {
        const searchQuery = query.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchQuery) || 
          p.description.toLowerCase().includes(searchQuery) ||
          p.category.toLowerCase().includes(searchQuery)
        );
      }
      
      // Apply gender filter
      if (filters.gender) {
        filteredProducts = filteredProducts.filter(p => p.gender === filters.gender);
      }
      
      // Apply type filter
      if (filters.type) {
        filteredProducts = filteredProducts.filter(p => p.type === filters.type);
      }
      
      // Apply price filter
      if (filters.price) {
        const [min, max] = filters.price.split('-').map(p => parseInt(p));
        
        if (max) {
          filteredProducts = filteredProducts.filter(p => p.price >= min && p.price <= max);
        } else {
          // Handle "100000+" case
          filteredProducts = filteredProducts.filter(p => p.price >= min);
        }
      }
      
      // Apply color filter
      if (filters.color) {
        const colorFilter = filters.color.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.colors.some(c => c.toLowerCase().includes(colorFilter))
        );
      }
      
      // Apply sorting
      if (filters.sort) {
        switch (filters.sort) {
          case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'newest':
            filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
            break;
          default:
            // Default sorting
            break;
        }
      }
      
      resolve(filteredProducts);
    }, 300);
  });
}
export function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}
