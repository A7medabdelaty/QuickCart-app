import { BasePage } from "./base-page.js";
import { ApiService } from "./api.js";
import { Helpers } from "./helpers.js";

class HomePage extends BasePage {
  constructor() {
    super();
    this.allProducts = [];
    this.filteredProducts = [];
    this.setupContactForm();
    this.loadProducts();
    this.setupFilterAndSort();
  }

  async loadProducts() {
    const loadingElement = document.getElementById("productsLoading");
    const gridElement = document.getElementById("productsGrid");
    const errorElement = document.getElementById("productsError");

    try {
      loadingElement.style.display = "block";
      gridElement.style.display = "none";
      errorElement.style.display = "none";

      const featuredProducts = await ApiService.getProducts();
      this.allProducts = featuredProducts;
      this.filteredProducts = [...featuredProducts];

      loadingElement.style.display = "none";
      gridElement.style.display = "grid";
      errorElement.style.display = "none";

      this.renderProducts(this.filteredProducts, gridElement);
    } catch (error) {
      console.error("Error loading products:", error);
      loadingElement.style.display = "none";
      gridElement.style.display = "none";
      errorElement.style.display = "block";
      this.showError(errorElement, "Failed to load products");
    }
  }

  renderProducts(products, container) {
    container.innerHTML = products
      .map(
        (product) => `
        <div class="product-card" data-product-id="${product.id}">
          <a href="product-details.html?id=${product.id}" class="product-link">
            <div class="product-image">
              <img src="${product.image}" alt="${product.title}" loading="lazy">
              <div class="product-overlay">
                <button class="btn btn-primary add-to-cart-btn" data-product-id="${
                  product.id
                }">
                  <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
              </div>
            </div>
            <div class="product-info">
              <div class="product-category">${product.category}</div>
              <h3 class="product-title">${product.title}</h3>
              <div class="product-rating">
                ${Helpers.renderStars(product.rating.rate)}
                <span class="rating-count">(${product.rating.count})</span>
              </div>
              <div class="product-price">${Helpers.formatCurrency(
                product.price
              )}</div>
            </div>
          </a>
        </div>
      `
      )
      .join("");

    this.setupAddToCartButtons(container);
  }

  setupAddToCartButtons(container) {
    container.querySelectorAll(".add-to-cart-btn").forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const productId = parseInt(button.dataset.productId);

        try {
          const product = await ApiService.getProduct(productId);
          await this.addToCart(product, 1, button);
        } catch (error) {
          console.error("Error loading product for cart:", error);
          Helpers.showNotification("Failed to load product details", "error");
        }
      });
    });
  }

  setupFilterAndSort() {
    const categoryFilter = document.getElementById("categoryFilter");
    const priceRange = document.getElementById("priceRange");
    const sortBy = document.getElementById("sortBy");
    const clearFilters = document.getElementById("clearFilters");

    if (categoryFilter) {
      categoryFilter.addEventListener("change", () => this.applyFiltersAndSort());
    }
    
    if (priceRange) {
      priceRange.addEventListener("change", () => this.applyFiltersAndSort());
    }
    
    if (sortBy) {
      sortBy.addEventListener("change", () => this.applyFiltersAndSort());
    }
    
    if (clearFilters) {
      clearFilters.addEventListener("click", () => this.clearAllFilters());
    }
  }

  applyFiltersAndSort() {
    let filtered = [...this.allProducts];

    const categoryFilter = document.getElementById("categoryFilter");
    if (categoryFilter && categoryFilter.value) {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === categoryFilter.value.toLowerCase()
      );
    }

    const priceRange = document.getElementById("priceRange");
    if (priceRange && priceRange.value) {
      const range = priceRange.value;
      if (range.includes('+')) {
        const min = parseFloat(range.replace('+', ''));
        filtered = filtered.filter(product => product.price >= min);
      } else {
        const [min, max] = range.split('-');
        filtered = filtered.filter(product => 
          product.price >= parseFloat(min) && product.price <= parseFloat(max)
        );
      }
    }

    const sortBy = document.getElementById("sortBy");
    if (sortBy && sortBy.value) {
      const [sortField, sortOrder] = sortBy.value.split('-');
      
      filtered.sort((a, b) => {
        let aValue, bValue;
        
        switch (sortField) {
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'rating':
            aValue = a.rating.rate;
            bValue = b.rating.rate;
            break;
          case 'name':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          default:
            return 0;
        }
        
        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });
    }

    this.filteredProducts = filtered;
    const gridElement = document.getElementById("productsGrid");
    this.renderProducts(this.filteredProducts, gridElement);
  }

  clearAllFilters() {
    const categoryFilter = document.getElementById("categoryFilter");
    const priceRange = document.getElementById("priceRange");
    const sortBy = document.getElementById("sortBy");

    if (categoryFilter) categoryFilter.value = "";
    if (priceRange) priceRange.value = "";
    if (sortBy) sortBy.value = "";

    this.filteredProducts = [...this.allProducts];
    const gridElement = document.getElementById("productsGrid");
    this.renderProducts(this.filteredProducts, gridElement);
  }

  setupContactForm() {
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (Helpers.validateForm(contactForm)) {
          Helpers.showNotification(
            "Thank you for your message! We'll get back to you soon.",
            "success"
          );
          contactForm.reset();
        } else {
          Helpers.showNotification(
            "Please fill in all required fields correctly.",
            "error"
          );
        }
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new HomePage();
});
