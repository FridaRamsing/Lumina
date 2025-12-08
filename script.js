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
    modalImage.src = product.image;
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
    modal.classList.remove("show");
  }

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });


  /* -------- Hent JSON -------- */
  fetch('app.json')
    .then(res => res.json())
    .then(data => {

      const productsRow = document.querySelector('.products-row');
      const featuredRow = document.querySelector('.featured-row');

      /* -------- Vores produkter (KUN Speakers) -------- */
      const speakers = data.filter(item => item.genre === "Speaker");

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


      /* -------- New Releases (KUN White Cover + Totebag) -------- */

      const newReleases = data.filter(item =>
        (item.genre === "Accessory" && item.title.includes("Totebag")) ||
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

    })
    .catch(err => console.error("JSON ERROR:", err));

});
