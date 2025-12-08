document.addEventListener('DOMContentLoaded', () => {
  /* -------- Modal Setup -------- */
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
    modalDescription.textContent = product.description || "—";
    modalPlaytime.textContent = product.playtime || "—";
    modalPrice.textContent = product.Price || "—";
    modalWeight.textContent = product.Weight || "—";
    modalVolume.textContent = product.Volume || "—";
    modalAvailable.textContent = product.available || "—";

    modal.classList.add("show");
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("show");
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }
  if (modal) {
    modal.addEventListener("click", e => {
      if (e.target === modal) closeModal();
    });
  }

  /* -------- Hent JSON -------- */
  let allData = [];

  fetch('app.json')
    .then(res => res.json())
    .then(data => {
      allData = data;

      const productsRow      = document.querySelector('.products-row');
      const featuredRow      = document.querySelector('.featured-row');
      const allProductsGrid  = document.querySelector('.all-products-grid');
      const searchInput      = document.getElementById('search-input');
      const genreFilter      = document.getElementById('genre-filter');
      const availabilityFilter = document.getElementById('availability-filter');
      const resetBtn         = document.getElementById('reset-filters');

      /* -------- Forside: Vores produkter (kun Speakers) -------- */
      if (productsRow) {
        const speakers = allData.filter(item => item.genre === "Speaker");

        productsRow.innerHTML = "";

        speakers.forEach(product => {
          const card = document.createElement('div');
          card.classList.add('product-card');

          card.innerHTML = `
            <img src="${product.image}" class="product-image" alt="${product.title}">
            <p>${product.title}</p>
          `;

          card.addEventListener("click", () => openModal(product));
          productsRow.appendChild(card);
        });
      }

      /* -------- Forside: New Releases (Totebag + White Cover) -------- */
      if (featuredRow) {
        const newReleases = allData.filter(item =>
          (item.genre === "Accessory"     && item.title.includes("Totebag")) ||
          (item.genre === "Speaker Cover" && item.title.includes("Moonlight White"))
        );

        featuredRow.innerHTML = "";

        newReleases.forEach(product => {
          const card = document.createElement('div');
          card.classList.add('featured-card');

          card.innerHTML = `
            <img src="${product.image}" class="featured-image" alt="${product.title}">
            <p>${product.title}<br>${product.Price}</p>
          `;

          card.addEventListener("click", () => openModal(product));
          featuredRow.appendChild(card);
        });
      }

      /* -------- Products.html: Alle produkter + søgning/filtre -------- */
      if (allProductsGrid) {

        function renderAllProducts(list) {
          allProductsGrid.innerHTML = "";

          if (!list.length) {
            allProductsGrid.innerHTML = `
              <p class="no-results">Ingen produkter matcher din søgning.</p>
            `;
            return;
          }

          list.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card', 'all-products-card');

            card.innerHTML = `
              <img src="${product.image}" class="product-image" alt="${product.title}">
              <p>${product.title}</p>
            `;

            card.addEventListener("click", () => openModal(product));
            allProductsGrid.appendChild(card);
          });
        }

        function applyFilters() {
          const searchValue = (searchInput?.value || "").trim().toLowerCase();
          const genreValue  = genreFilter ? genreFilter.value : 'all';
          const availValue  = availabilityFilter ? availabilityFilter.value : 'all';

          const filtered = allData.filter(product => {
            // genre
            if (genreValue !== 'all' && product.genre !== genreValue) return false;

            // availability
            if (availValue === 'in'  && product.available !== 'In stock')     return false;
            if (availValue === 'out' && product.available !== 'Out of stock') return false;

            // tekstsøgning
            if (searchValue) {
              const text = (product.title + ' ' + (product.description || '')).toLowerCase();
              if (!text.includes(searchValue)) return false;
            }

            return true;
          });

          renderAllProducts(filtered);
        }

        // Første visning: alle produkter
        renderAllProducts(allData);

        // Event listeners til filtre
        if (searchInput) {
          searchInput.addEventListener('input', applyFilters);
        }
        if (genreFilter) {
          genreFilter.addEventListener('change', applyFilters);
        }
        if (availabilityFilter) {
          availabilityFilter.addEventListener('change', applyFilters);
        }

        // Reset-knap
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = "";
            if (genreFilter) genreFilter.value = "all";
            if (availabilityFilter) availabilityFilter.value = "all";
            renderAllProducts(allData);
          });
        }
      }
    })
    .catch(err => console.error("JSON ERROR:", err));
});
