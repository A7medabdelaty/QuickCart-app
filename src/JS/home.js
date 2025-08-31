// Home Page JavaScript
import { BasePage } from "./base-page.js";
import { ApiService } from "./api.js";
import { Helpers } from "./helpers.js";

class HomePage extends BasePage {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.setupContactForm();
    this.loadProducts();
  }

  async loadProducts() {
    const loadingElement = document.getElementById("productsLoading");
    const gridElement = document.getElementById("productsGrid");
    const errorElement = document.getElementById("productsError");

    try {
      // Show loading state
      this.setLoadingState(loadingElement, gridElement, errorElement, true);

      // Fetch products from API
      const featuredProducts = await ApiService.getProducts();

      // Show grid
      this.setLoadingState(loadingElement, gridElement, errorElement, false);
      gridElement.style.display = "grid"; // Override to show as grid

      // Render products
      this.renderProducts(featuredProducts, gridElement);
    } catch (error) {
      console.error("Error loading products:", error);
      this.setLoadingState(loadingElement, gridElement, errorElement, false, true);
      this.showError(errorElement, "Failed to load products");
    }
  }

  renderProducts(products, container) {
    container.innerHTML = products
      .map(
        (product) => `
            <div class="product-card" data-product-id="${product.id}">
                <a href="product-details.html?id=${
                  product.id
                }" class="product-link">
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
                            ${Helpers.renderStars(product.rating.rate)}
                            <span class="rating-count">(${
                              product.rating.count
                            })</span>
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

    // Add event listeners for add to cart buttons and product links
    this.setupAddToCartButtons(container);
    this.setupProductLinks(container);
  }


  setupAddToCartButtons(container) {
    const addToCartButtons = container.querySelectorAll(".add-to-cart-btn");
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const productId = parseInt(button.dataset.productId);

        try {
          // Get product details
          const product = await ApiService.getProduct(productId);
          
          // Use consolidated add to cart functionality
          await this.addToCart(product, 1, button);
        } catch (error) {
          console.error("Error loading product for cart:", error);
          Helpers.showNotification("Failed to load product details", "error");
        }
      });
    });
  }

  setupProductLinks(container) {
    // Event prevention is now handled in setupAddToCartButtons
    // This method can be removed or used for other product link functionality
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
