// Product Details Page JavaScript
import { Navbar } from "./navbar.js";
import { AuthManager } from "./auth.js";
import { CartManager } from "./cart.js";
import { Helpers } from "./helpers.js";
import { ApiService } from "./api.js";

class ProductDetailsPage {
  constructor() {
    this.navbar = new Navbar();
    this.authManager = new AuthManager();
    this.cartManager = new CartManager();
    this.productId = null;
    this.product = null;
    this.quantity = 1;

    this.init();
  }

  init() {
    this.getProductIdFromUrl();
    this.setupQuantityControls();
    this.setupAddToCartButton();
    this.loadProductDetails();
    Helpers.setupSmoothScrolling();
    Helpers.setupButtonLoading();
  }

  getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    this.productId = urlParams.get("id");

    if (!this.productId) {
      this.showError("Product ID not found in URL");
      return;
    }
  }

  async loadProductDetails() {
    const loadingElement = document.getElementById("productLoading");
    const contentElement = document.getElementById("productDetailsContent");
    const errorElement = document.getElementById("productError");

    try {
      // Show loading state
      loadingElement.style.display = "block";
      contentElement.style.display = "none";
      errorElement.style.display = "none";

      // Fetch product details from API
      this.product = await ApiService.getProduct(this.productId);

      // Hide loading and show content
      loadingElement.style.display = "none";
      contentElement.style.display = "block";

      // Render product details
      this.renderProductDetails();
    } catch (error) {
      console.error("Error loading product details:", error);
      this.showError("Failed to load product details");
    }
  }

  renderProductDetails() {
    if (!this.product) return;

    // Update page title
    document.title = `QuickCart - ${this.product.title}`;

    // Product image
    const productImage = document.getElementById("productImage");
    productImage.src = this.product.image;
    productImage.alt = this.product.title;

    // Product category (breadcrumb)
    const productCategory = document.getElementById("productCategory");
    productCategory.textContent = this.product.category;

    // Product title
    const productTitle = document.getElementById("productTitle");
    productTitle.textContent = this.product.title;

    // Product rating
    const productRating = document.getElementById("productRating");
    productRating.innerHTML = this.renderStars(this.product.rating.rate);

    const ratingText = document.getElementById("ratingText");
    ratingText.textContent = `${this.product.rating.rate}/5 (${this.product.rating.count} reviews)`;

    // Product price
    const productPrice = document.getElementById("productPrice");
    productPrice.textContent = Helpers.formatCurrency(this.product.price);

    // Product description
    const productDescription = document.getElementById("productDescription");
    productDescription.textContent = this.product.description;
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

  setupQuantityControls() {
    const quantityInput = document.getElementById("quantity");
    const decreaseBtn = document.getElementById("decreaseQty");
    const increaseBtn = document.getElementById("increaseQty");

    // Decrease quantity
    decreaseBtn.addEventListener("click", () => {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
        this.quantity = currentValue - 1;
      }
    });

    // Increase quantity
    increaseBtn.addEventListener("click", () => {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue < 10) {
        quantityInput.value = currentValue + 1;
        this.quantity = currentValue + 1;
      }
    });

    // Handle direct input
    quantityInput.addEventListener("change", (e) => {
      let value = parseInt(e.target.value);
      if (value < 1) value = 1;
      if (value > 10) value = 10;
      e.target.value = value;
      this.quantity = value;
    });
  }

  setupAddToCartButton() {
    const addToCartBtn = document.getElementById("addToCartBtn");

    addToCartBtn.addEventListener("click", async () => {
      if (!this.product) return;

      try {
        // Add to cart with specified quantity
        for (let i = 0; i < this.quantity; i++) {
          this.cartManager.addItem(this.product);
        }

        // Show success notification
        const quantityText =
          this.quantity > 1 ? ` (${this.quantity} items)` : "";
        Helpers.showNotification(
          `${this.product.title}${quantityText} added to cart!`,
          "success"
        );

        // Update button state temporarily
        const originalText = addToCartBtn.innerHTML;
        addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
        addToCartBtn.disabled = true;

        setTimeout(() => {
          addToCartBtn.innerHTML = originalText;
          addToCartBtn.disabled = false;
        }, 2000);
      } catch (error) {
        console.error("Error adding to cart:", error);
        Helpers.showNotification("Failed to add item to cart", "error");
      }
    });
  }

  showError(message) {
    const loadingElement = document.getElementById("productLoading");
    const contentElement = document.getElementById("productDetailsContent");
    const errorElement = document.getElementById("productError");

    loadingElement.style.display = "none";
    contentElement.style.display = "none";
    errorElement.style.display = "block";

    const errorText = errorElement.querySelector("p");
    if (errorText) {
      errorText.textContent = message;
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ProductDetailsPage();
});
