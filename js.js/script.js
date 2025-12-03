fetch('app.json')
  .then(response => response.json())
  .then(data => {
    const productsSection = document.querySelector('.products-row');
    const featuredSection = document.querySelector('.featured-row');

    // Generer produktkort
    data.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="product-image">
        <p>${product.title}</p>
      `;
      productsSection.appendChild(productCard);
    });

    // Generer featured kort (hvis du har en sektion for det)
    // Her antager vi, at featured produkter også er i JSON-filen
    data.forEach(product => {
      const featuredCard = document.createElement('div');
      featuredCard.classList.add('featured-card');
      featuredCard.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="featured-image">
        <p>${product.title} <br> ${product.price} kr</p>
      `;
      featuredSection.appendChild(featuredCard);
    });
  })
  .catch(error => console.error('Error fetching the JSON:', error));