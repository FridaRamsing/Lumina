// Hent produkter fra app.json og indsæt dem i .products-row
document.addEventListener('DOMContentLoaded', () => {
  // --- Modal elementer ---
  const modal = document.getElementById('product-modal');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalPlaytime = document.getElementById('modal-playtime');
  const modalPrice = document.getElementById('modal-price');
  const modalWeight = document.getElementById('modal-weight');
  const modalVolume = document.getElementById('modal-volume');
  const modalAvailable = document.getElementById('modal-available');
  const closeBtn = document.querySelector('.modal-close');

  function openModal(product) {
    if (!modal) return;

    modalImage.src = product.image;
    modalImage.alt = product.title;
    modalTitle.textContent = product.title;
    modalDescription.textContent = product.description || '';

    modalPlaytime.textContent = product.playtime || '–';
    modalPrice.textContent = product.Price || '–';
    modalWeight.textContent = product.Weight || '–';
    modalVolume.textContent = product.Volume || '–';
    modalAvailable.textContent = product.available || '–';

    modal.classList.add('show');
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('show');
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Luk når man klikker udenfor boksen
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // --- Hent JSON og byg produktkort ---
  fetch('app.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Kunne ikke hente JSON: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      const productsSection = document.querySelector('.products-row');

      if (!productsSection) {
        console.error('Kunne ikke finde .products-row i DOM');
        return;
      }

      // Ryd eksisterende indhold
      productsSection.innerHTML = '';

      // Kun højtalerne til "Vores produkter"
      const speakers = data.filter(item => item.genre === 'Speaker');

      speakers.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        productCard.innerHTML = `
          <img src="${product.image}" alt="${product.title}" class="product-image">
          <p>${product.title}</p>
        `;

        // Når man klikker på kortet -> åbn modal med detaljer
        productCard.addEventListener('click', () => openModal(product));

        productsSection.appendChild(productCard);
      });
    })
    .catch(error => {
      console.error('Error fetching the JSON:', error);
    });
});
