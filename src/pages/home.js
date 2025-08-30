// Home Page JavaScript
import { Navbar } from "../components/navbar.js";
import { AuthManager } from "../utils/auth.js";
import { CartManager } from "../utils/cart.js";
import { Helpers } from "../utils/helpers.js";
import { ApiService } from "../utils/api.js";

class HomePage {
  constructor() {
    this.navbar = new Navbar();
    this.authManager = new AuthManager();
    this.cartManager = new CartManager();

    this.init();
  }

  init() {
    this.setupContactForm();
    this.loadProducts();
    Helpers.setupSmoothScrolling();
    Helpers.setupButtonLoading();
  }

  async loadProducts() {
    const loadingElement = document.getElementById("productsLoading");
    const gridElement = document.getElementById("productsGrid");
    const errorElement = document.getElementById("productsError");

    try {
      // Show loading state
      loadingElement.style.display = "block";
      gridElement.style.display = "none";
      errorElement.style.display = "none";

      // Fetch products from API and duplicate to show more
      const products = await ApiService.getProducts();
      const duplicatedProducts = [...products, ...products];
      const featuredProducts = duplicatedProducts;

      // Hide loading and show grid
      loadingElement.style.display = "none";
      gridElement.style.display = "grid";

      // Render products
      this.renderProducts(featuredProducts, gridElement);
    } catch (error) {
      console.error("Error loading products:", error);
      loadingElement.style.display = "none";
      errorElement.style.display = "block";
    }
  }

  renderProducts(products, container) {
    container.innerHTML = products
      .map(
        (product) => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${
          product.title
        }" loading="lazy">
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
                        ${this.renderStars(product.rating.rate)}
                        <span class="rating-count">(${
                          product.rating.count
                        })</span>
                    </div>
                    <div class="product-price">${Helpers.formatCurrency(
                      product.price
                    )}</div>
                </div>
            </div>
        `
      )
      .join("");

    // Add event listeners for add to cart buttons
    this.setupAddToCartButtons(container);
  }

  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return `
            ${'<i class="fas fa-star"></i>'.repeat(fullStars)}
            ${hasHalfStar ? '<i class="fas fa-star-half-alt"></i>' : ""}
            ${'<i class="far fa-star"></i>'.repeat(emptyStars)}
        `;
  }

  setupAddToCartButtons(container) {
    const addToCartButtons = container.querySelectorAll(".add-to-cart-btn");
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        const productId = parseInt(button.dataset.productId);

        try {
          // Get product details
          const product = await ApiService.getProduct(productId);

          // Add to cart
          this.cartManager.addItem(product);

          // Show success notification
          Helpers.showNotification(
            `${product.title} added to cart!`,
            "success"
          );

          // Update button state temporarily
          const originalText = button.innerHTML;
          button.innerHTML = '<i class="fas fa-check"></i> Added!';
          button.disabled = true;

          setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
          }, 2000);
        } catch (error) {
          console.error("Error adding to cart:", error);
          Helpers.showNotification("Failed to add item to cart", "error");
        }
      });
    });
  }

  setupContactForm() {
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (Helpers.validateForm(contactForm)) {
          // Simulate form submission
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

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new HomePage();
});
