/* 
==========================================================
  LUMINA — SCRIPT.JS
  This file is responsible for:

  1. Setting up the product detail modal (open/close logic)
  2. Fetching product data from app.json using fetch()
  3. Dynamically rendering:
     - Speakers and "New Releases" on index.html
     - All products on products.html
  4. Implementing search and filter logic on products.html
  5. Connecting product cards to the modal on both pages

  The same script is used by both index.html and products.html.
  The script “detects” which page it’s on by checking whether
  certain elements (like .products-row or .all-products-grid) exist.
==========================================================
*/

/* 
  We wait for the DOM to be fully loaded before running our code.
  This guarantees that all HTML elements are available in the document
  when we try to select them with querySelector / getElementById.
*/
document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     MODAL SETUP (shared between index.html and products.html)
     ------------------------------------------------------------
     The modal is the pop-up window that shows more information
     about a product when the user clicks a product card.
     We grab references to all the relevant DOM elements once here.
  ============================================================ */

  // Main modal overlay (dark background + content box)
  const modal = document.getElementById('product-modal');

  // Elements inside the modal that display product data
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalPlaytime = document.getElementById('modal-playtime');
  const modalPrice = document.getElementById('modal-price');
  const modalWeight = document.getElementById('modal-weight');
  const modalVolume = document.getElementById('modal-volume');
  const modalAvailable = document.getElementById('modal-available');

  // The “X” close button in the top-right corner of the modal
  const closeBtn = document.querySelector('.modal-close');

  /* 
    openModal(product)
    -------------------
    This function receives a product object (from JSON) and:
    - fills the modal with that product’s data
    - shows the modal by adding the CSS class "show"
  */
  function openModal(product) {
    // Safety check: if somehow there is no modal, just do nothing.
    if (!modal) return;

    // Fill in the modal image and alt text
    modalImage.src = product.image;
    modalImage.alt = product.title;

    // Fill in all texts. Fallback to "—" if a field is missing.
    modalTitle.textContent = product.title;
    modalDescription.textContent = product.description || "—";
    modalPlaytime.textContent = product.playtime || "—";
    modalPrice.textContent = product.Price || "—";
    modalWeight.textContent = product.Weight || "—";
    modalVolume.textContent = product.Volume || "—";
    modalAvailable.textContent = product.available || "—";

    // Add CSS class that makes the modal visible
    modal.classList.add("show");
  }

  /*
    closeModal()
    ------------
    Hides the modal again by removing the CSS class "show".
  */
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("show");
  }

  /*
    Close modal when clicking the "X" button.
  */
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  /*
    Close modal when clicking the dark background (overlay) outside the box.
    We check if the click target is exactly the modal overlay (not the content).
  */
  if (modal) {
    modal.addEventListener("click", e => {
      if (e.target === modal) closeModal();
    });
  }

  /* ============================================================
     FETCHING JSON DATA
     ------------------------------------------------------------
     We load all product data from app.json (in the project root).
     The data is stored in the allData array for later use.
  ============================================================ */

  // This will hold the entire list of products from app.json
  let allData = [];

  // Start fetching the JSON file
  fetch('app.json')
    .then(res => res.json()) // parse the response as JSON
    .then(data => {
      // Store all products in allData so other functions can use them
      allData = data;

      /* ---------------------------------------------------------
         DOM ELEMENTS USED FOR RENDERING / FILTERING
         ---------------------------------------------------------
         We now select DOM nodes that may or may not exist
         depending on which page we are currently on.

         - On index.html we have:
           .products-row  (main products section)
           .featured-row  (New Releases section)

         - On products.html we have:
           .all-products-grid
           #search-input
           #genre-filter
           #availability-filter
           #reset-filters
      --------------------------------------------------------- */
      const productsRow       = document.querySelector('.products-row');
      const featuredRow       = document.querySelector('.featured-row');
      const allProductsGrid   = document.querySelector('.all-products-grid');
      const searchInput       = document.getElementById('search-input');
      const genreFilter       = document.getElementById('genre-filter');
      const availabilityFilter = document.getElementById('availability-filter');
      const resetBtn          = document.getElementById('reset-filters');

      /* ============================================================
         INDEX.HTML — MAIN PRODUCTS SECTION ("Vores produkter")
         ------------------------------------------------------------
         We only render this block if .products-row exists, which
         tells us we are on the front page (index.html).

         Logic:
         - Filter allData to only include items where genre === "Speaker"
         - Create a product card for each speaker
         - Attach a click event to open the modal with that product's data
      ============================================================ */
      if (productsRow) {
        // Filter: keep only products where genre is exactly "Speaker"
        const speakers = allData.filter(item => item.genre === "Speaker");

        // Clear any existing content (just in case)
        productsRow.innerHTML = "";

        // Create and append a card for each speaker
        speakers.forEach(product => {
          const card = document.createElement('div');
          card.classList.add('product-card');

          // Basic card layout using template literals
          card.innerHTML = `
            <img src="${product.image}" class="product-image" alt="${product.title}">
            <p>${product.title}</p>
          `;

          // Clicking a card opens the modal
          card.addEventListener("click", () => openModal(product));
          productsRow.appendChild(card);
        });
      }

      /* ============================================================
         INDEX.HTML — "New Releases" SECTION
         ------------------------------------------------------------
         Again, we only run this part if .featured-row exists.
         
         Logic:
         - From allData, pick:
           • The totebag: genre "Accessory" and title contains "Totebag"
           • The white cover: genre "Speaker Cover" and title contains "Moonlight White"
         - Render only those selected products into the featured row.
      ============================================================ */
      if (featuredRow) {
        const newReleases = allData.filter(item =>
          (item.genre === "Accessory"     && item.title.includes("Totebag")) ||
          (item.genre === "Speaker Cover" && item.title.includes("Moonlight White"))
        );

        // Clear previous content
        featuredRow.innerHTML = "";

        newReleases.forEach(product => {
          const card = document.createElement('div');
          card.classList.add('featured-card');

          card.innerHTML = `
            <img src="${product.image}" class="featured-image" alt="${product.title}">
            <p>${product.title}<br>${product.Price}</p>
          `;

          // Same modal behavior: click → details
          card.addEventListener("click", () => openModal(product));
          featuredRow.appendChild(card);
        });
      }

      /* ============================================================
         PRODUCTS.HTML — FULL PRODUCT LIST + FILTERS
         ------------------------------------------------------------
         This block only runs if .all-products-grid exists,
         which tells us we are on products.html.

         Features:
         - Render all products in a grid
         - Live-text search (by title + description)
         - Category filter (genre)
         - Availability filter ("In stock" / "Out of stock")
         - Reset button to clear all filters and show everything again
         - Clicking any card opens the modal with details
      ============================================================ */
      if (allProductsGrid) {

        /*
          renderAllProducts(list)
          -----------------------
          Takes an array of product objects (list) and:
          - clears the current grid
          - creates a card for each product
          - attaches modal opening behavior on click
          
          This function is reused for:
          - initial render of allData
          - filtered results after search/filter changes
        */
        function renderAllProducts(list) {
          // Clear the grid
          allProductsGrid.innerHTML = "";

          // If no products match the filters → show a "no results" message
          if (!list.length) {
            allProductsGrid.innerHTML = `
              <p class="no-results">Ingen produkter matcher din søgning.</p>
            `;
            return;
          }

          // For each product, create a card and append to the grid
          list.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card', 'all-products-card');

            card.innerHTML = `
              <img src="${product.image}" class="product-image" alt="${product.title}">
              <p>${product.title}</p>
            `;

            // Clicking opens the modal with that product’s details
            card.addEventListener("click", () => openModal(product));
            allProductsGrid.appendChild(card);
          });
        }

        /*
          applyFilters()
          --------------
          This function:
          - reads the current values from:
            • searchInput (text)
            • genreFilter (dropdown)
            • availabilityFilter (dropdown)
          - filters the full allData array
          - passes the filtered result to renderAllProducts()
          
          It is called:
          - every time search text changes (input event)
          - every time a dropdown value changes (change event)
        */
        function applyFilters() {
          // Read current search text (safe optional chaining in case element doesn't exist)
          const searchValue = (searchInput?.value || "").trim().toLowerCase();

          // Read current selected genre (or fallback to 'all')
          const genreValue  = genreFilter ? genreFilter.value : 'all';

          // Read current selected availability option (or fallback to 'all')
          const availValue  = availabilityFilter ? availabilityFilter.value : 'all';

          // Filter the full dataset based on the controls
          const filtered = allData.filter(product => {

            // 1) Genre filter (unless "all" is selected)
            if (genreValue !== 'all' && product.genre !== genreValue) return false;

            // 2) Availability filter
            //    We check the 'available' field in JSON for "In stock" or "Out of stock".
            if (availValue === 'in'  && product.available !== 'In stock')     return false;
            if (availValue === 'out' && product.available !== 'Out of stock') return false;

            // 3) Text search in title + description (case-insensitive)
            if (searchValue) {
              const text = (product.title + ' ' + (product.description || '')).toLowerCase();
              if (!text.includes(searchValue)) return false;
            }

            // If the product passes all checks, keep it
            return true;
          });

          // Display the filtered products
          renderAllProducts(filtered);
        }

        // Initial render: show all products before any filters are applied
        renderAllProducts(allData);

        // Connect search input: update results as the user types
        if (searchInput) {
          searchInput.addEventListener('input', applyFilters);
        }

        // Connect genre dropdown: update results when selection changes
        if (genreFilter) {
          genreFilter.addEventListener('change', applyFilters);
        }

        // Connect availability dropdown: update results when selection changes
        if (availabilityFilter) {
          availabilityFilter.addEventListener('change', applyFilters);
        }

        /*
          Reset button logic:
          -------------------
          When clicked, it:
          - clears the search text
          - sets genre filter back to "all"
          - sets availability filter back to "all"
          - re-renders all products (unfiltered allData)
        */
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = "";
            if (genreFilter) genreFilter.value = "all";
            if (availabilityFilter) availabilityFilter.value = "all";

            // Show the full product list again
            renderAllProducts(allData);
          });
        }
      }

    })
    // If something goes wrong when fetching or parsing the JSON,
    // we log the error in the console for debugging.
    .catch(err => console.error("JSON ERROR:", err));
});
