const reviewsList = document.getElementById('reviews-list');
const reviewForm = document.getElementById('review-form');

let reviews = [
  {
    name: 'Marie Dupont',
    rating: 5,
    comment: 'Très satisfaite de ma robe sur mesure, qualité et service excellents !',
  },
  {
    name: 'Jean Martin',
    rating: 4,
    comment: 'Costume bien taillé, délai respecté. Je recommande.',
  },
];

// Function to display reviews
function displayReviews() {
  if (!reviewsList) return;
  reviewsList.innerHTML = '';

  if (reviews.length === 0) {
    reviewsList.innerHTML = '<p>Aucun avis pour le moment.</p>';
    return;
  }

  reviews.forEach((review) => {
    const reviewItem = document.createElement('div');
    reviewItem.className = 'review-item';

    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
      starsHTML += i <= review.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }

    reviewItem.innerHTML = `
      <div class="review-header">
        <h3>${review.name}</h3>
        <div class="review-rating" aria-label="Note : ${review.rating} sur 5 étoiles">${starsHTML}</div>
      </div>
      <p class="review-comment">${review.comment}</p>
    `;

    reviewsList.appendChild(reviewItem);
  });
}

// Handle form submission
function handleFormSubmit(event) {
  event.preventDefault();

  const name = reviewForm['name'].value.trim();
  const rating = parseInt(reviewForm['rating'].value);
  const comment = reviewForm['comment'].value.trim();

  if (!name || !rating || !comment) {
    alert('Veuillez remplir tous les champs du formulaire.');
    return;
  }

  const newReview = { name, rating, comment };
  reviews.unshift(newReview);

  displayReviews();
  reviewForm.reset();
  reviewForm.querySelector('button[type="submit"]').focus();
}

document.addEventListener('DOMContentLoaded', () => {
  displayReviews();

  if (reviewForm) {
    reviewForm.addEventListener('submit', handleFormSubmit);
  }
});
