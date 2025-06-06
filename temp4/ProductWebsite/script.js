// script.js
document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const brandFiltersContainer = document.getElementById('brand-filters');
    const searchBar = document.getElementById('search-bar');
    const sortBySelect = document.getElementById('sort-by');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    const themeToggle = document.getElementById('theme-toggle');

    // Modal elements
    const productModal = document.getElementById('product-modal');
    const modalCloseButton = document.querySelector('.modal .close-button');
    const modalImg = document.getElementById('modal-img');
    const modalName = document.getElementById('modal-name');
    const modalCategoryBrand = document.getElementById('modal-category-brand');
    const modalPrice = document.getElementById('modal-price');
    const modalRatingEl = document.getElementById('modal-rating');
    const modalDescription = document.getElementById('modal-description');
    const modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn');

    // Pagination elements
    const paginationControls = document.getElementById('pagination-controls');
    const ITEMS_PER_PAGE = 6; // Adjust as needed
    let currentPage = 1;

    let currentProducts = [...allProducts]; // Make a mutable copy
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];


    // --- THEME TOGGLE ---
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌓';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);


    // --- POPULATE FILTERS ---
    function populateFilters() {
        const categories = [...new Set(allProducts.map(p => p.category))];
        categoryFiltersContainer.innerHTML = categories.map(cat => `
            <div>
                <input type="checkbox" id="cat-${cat.toLowerCase().replace(/\s+/g, '-')}" name="category" value="${cat}">
                <label for="cat-${cat.toLowerCase().replace(/\s+/g, '-')}">${cat}</label>
            </div>
        `).join('');

        const brands = [...new Set(allProducts.map(p => p.brand))];
        brandFiltersContainer.innerHTML = brands.map(brand => `
            <div>
                <input type="checkbox" id="brand-${brand.toLowerCase().replace(/\s+/g, '-')}" name="brand" value="${brand}">
                <label for="brand-${brand.toLowerCase().replace(/\s+/g, '-')}">${brand}</label>
            </div>
        `).join('');
    }


    // --- RENDER PRODUCTS ---
    function renderProducts(productsToRender) {
        productGrid.innerHTML = ''; // Clear existing products
        
        if (productsToRender.length === 0) {
            productGrid.innerHTML = '<p>No products found matching your criteria.</p>';
            renderPagination(0); // No pages if no products
            return;
        }

        // Pagination logic
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const paginatedProducts = productsToRender.slice(startIndex, endIndex);

        paginatedProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.dataset.productId = product.id;

            const isInWishlist = wishlist.includes(product.id);

            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="product-category">${product.category} - ${product.brand}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <div class="product-rating">${renderRatingStars(product.rating)} (${product.rating.toFixed(1)})</div>
                <div class="product-tags">
                    ${product.tags.map(tag => `<span class="tag tag-${tag.toLowerCase().replace(/\s+/g, '-')}">${tag}</span>`).join('')}
                </div>
                <div class="product-card-buttons">
                    <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                    <button class="wishlist-btn ${isInWishlist ? 'active' : ''}" data-id="${product.id}">
                        ${isInWishlist ? '❤️ Wishlisted' : '🤍 Wishlist'}
                    </button>
                    <button class="details-btn" data-id="${product.id}">Details</button>
                </div>
            `;
            productGrid.appendChild(card);
        });
        renderPagination(productsToRender.length);
    }

    function renderRatingStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '★'; // Full star
            } else if (i - 0.5 <= rating) {
                stars += '⭐'; // Half star (using a different star for demo, or use SVG/font icon for better half stars)
            } else {
                stars += '☆'; // Empty star
            }
        }
        return stars;
    }
    
    // --- PAGINATION ---
    function renderPagination(totalItems) {
        paginationControls.innerHTML = '';
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

        if (totalPages <= 1) return; // No pagination if 1 page or less

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                filterAndSortProducts();
            }
        });
        paginationControls.appendChild(prevButton);

        // Page number buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('page-number');
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                currentPage = i;
                filterAndSortProducts();
            });
            paginationControls.appendChild(pageButton);
        }

        // Next button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                filterAndSortProducts();
            }
        });
        paginationControls.appendChild(nextButton);
    }


    // --- FILTERING AND SORTING LOGIC ---
    function filterAndSortProducts() {
        let filtered = [...allProducts];

        // Search
        const searchTerm = searchBar.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm) ||
                p.category.toLowerCase().includes(searchTerm) ||
                p.brand.toLowerCase().includes(searchTerm)
            );
        }

        // Category filter
        const selectedCategories = Array.from(document.querySelectorAll('#category-filters input:checked')).map(cb => cb.value);
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(p => selectedCategories.includes(p.category));
        }

        // Brand filter
        const selectedBrands = Array.from(document.querySelectorAll('#brand-filters input:checked')).map(cb => cb.value);
        if (selectedBrands.length > 0) {
            filtered = filtered.filter(p => selectedBrands.includes(p.brand));
        }

        // Price range filter
        const minPrice = parseFloat(minPriceInput.value);
        const maxPrice = parseFloat(maxPriceInput.value);
        if (!isNaN(minPrice)) {
            filtered = filtered.filter(p => p.price >= minPrice);
        }
        if (!isNaN(maxPrice)) {
            filtered = filtered.filter(p => p.price <= maxPrice);
        }

        // Sorting
        const sortBy = sortBySelect.value;
        switch (sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating-desc':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest-desc':
                filtered.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));
                break;
            // Default: no specific sort or retain previous if already sorted
        }
        
        currentProducts = filtered; // Update the global currentProducts list
        // Reset to page 1 only if filters change, not just sort.
        // The applyFiltersBtn click resets currentPage, so this is okay.
        // If sorting directly, we might not want to reset page.
        // For simplicity here, let's render based on current currentPage.
        renderProducts(currentProducts);
    }


    // --- EVENT LISTENERS ---
    searchBar.addEventListener('input', () => {
        currentPage = 1; // Reset to first page on new search
        filterAndSortProducts();
    });
    sortBySelect.addEventListener('change', () => {
        //currentPage = 1; // Optional: reset to first page on sort change
        filterAndSortProducts();
    });
    
    applyFiltersBtn.addEventListener('click', () => {
        currentPage = 1; // Reset to first page when applying new filters
        filterAndSortProducts();
    });

    resetFiltersBtn.addEventListener('click', () => {
        searchBar.value = '';
        minPriceInput.value = '';
        maxPriceInput.value = '';
        sortBySelect.value = 'default';
        document.querySelectorAll('#category-filters input:checked').forEach(cb => cb.checked = false);
        document.querySelectorAll('#brand-filters input:checked').forEach(cb => cb.checked = false);
        currentPage = 1;
        filterAndSortProducts();
    });


    // --- PRODUCT CARD ACTIONS (Event Delegation) ---
    productGrid.addEventListener('click', e => {
        const target = e.target;
        const productId = parseInt(target.dataset.id);

        if (target.classList.contains('add-to-cart-btn')) {
            addToCart(productId);
        } else if (target.classList.contains('wishlist-btn')) {
            toggleWishlist(productId, target);
        } else if (target.classList.contains('details-btn')) {
            openProductModal(productId);
        }
    });

    // --- CART FUNCTIONALITY ---
    function addToCart(productId) {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;

        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} added to cart! (Total items: ${getCartItemCount()})`);
        // You could update a cart icon count here
    }

    function getCartItemCount() {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    // --- WISHLIST FUNCTIONALITY ---
    function toggleWishlist(productId, button) {
        const productIndex = wishlist.indexOf(productId);
        if (productIndex > -1) {
            wishlist.splice(productIndex, 1); // Remove from wishlist
            button.classList.remove('active');
            button.innerHTML = '🤍 Wishlist';
        } else {
            wishlist.push(productId); // Add to wishlist
            button.classList.add('active');
            button.innerHTML = '❤️ Wishlisted';
        }
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    // --- MODAL FUNCTIONALITY ---
    function openProductModal(productId) {
        const product = allProducts.find(p => p.id === productId);
        if (!product) return;

        modalImg.src = product.image;
        modalImg.alt = product.name;
        modalName.textContent = product.name;
        modalCategoryBrand.textContent = `${product.category} | ${product.brand}`;
        modalPrice.textContent = `$${product.price.toFixed(2)}`;
        modalRatingEl.innerHTML = `${renderRatingStars(product.rating)} (${product.rating.toFixed(1)})`;
        modalDescription.textContent = product.description;
        
        modalAddToCartBtn.dataset.id = product.id; // Set product ID for modal's cart button

        productModal.style.display = 'block';
    }

    modalCloseButton.addEventListener('click', () => {
        productModal.style.display = 'none';
    });

    // Modal Add to Cart button
    modalAddToCartBtn.addEventListener('click', (e) => {
        const productId = parseInt(e.target.dataset.id);
        addToCart(productId);
        // Optionally close modal after adding to cart
        // productModal.style.display = 'none';
    });

    // Close modal if clicked outside content
    window.addEventListener('click', e => {
        if (e.target === productModal) {
            productModal.style.display = 'none';
        }
    });


    // --- INITIALIZATION ---
    populateFilters();
    filterAndSortProducts(); // Initial render
});