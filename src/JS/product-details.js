// Product Details Page JavaScript
import { BasePage } from "./base-page.js";
import { ApiService } from "./api.js";
import { Helpers } from "./helpers.js";
import { CONSTANTS } from "./constants.js";

class ProductDetailsPage extends BasePage {
  constructor() {
    super();
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
      this.setLoadingState(loadingElement, contentElement, errorElement, true);

      // Fetch product details from API
      this.product = await ApiService.getProduct(this.productId);

      // Show content
      this.setLoadingState(loadingElement, contentElement, errorElement, false);

      // Render product details
      this.renderProductDetails();
    } catch (error) {
      console.error("Error loading product details:", error);
      this.setLoadingState(loadingElement, contentElement, errorElement, false, true);
      this.showError(errorElement, "Failed to load product details");
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
    productRating.innerHTML = Helpers.renderStars(this.product.rating.rate);

    const ratingText = document.getElementById("ratingText");
    ratingText.textContent = `${this.product.rating.rate}/5 (${this.product.rating.count} reviews)`;

    // Product price
    const productPrice = document.getElementById("productPrice");
    productPrice.textContent = Helpers.formatCurrency(this.product.price);

    // Product description
    const productDescription = document.getElementById("productDescription");
    productDescription.textContent = this.product.description;
  }


  setupQuantityControls() {
    const quantityInput = document.getElementById("quantity");
    const decreaseBtn = document.getElementById("decreaseQty");
    const increaseBtn = document.getElementById("increaseQty");

    // Decrease quantity
    decreaseBtn.addEventListener("click", () => {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue > CONSTANTS.MIN_QUANTITY) {
        quantityInput.value = currentValue - 1;
        this.quantity = currentValue - 1;
      }
    });

    // Increase quantity
    increaseBtn.addEventListener("click", () => {
      const currentValue = parseInt(quantityInput.value);
      if (currentValue < CONSTANTS.MAX_QUANTITY) {
        quantityInput.value = currentValue + 1;
        this.quantity = currentValue + 1;
      }
    });

    // Handle direct input
    quantityInput.addEventListener("change", (e) => {
      let value = parseInt(e.target.value);
      if (value < CONSTANTS.MIN_QUANTITY) value = CONSTANTS.MIN_QUANTITY;
      if (value > CONSTANTS.MAX_QUANTITY) value = CONSTANTS.MAX_QUANTITY;
      e.target.value = value;
      this.quantity = value;
    });
  }

  setupAddToCartButton() {
    const addToCartBtn = document.getElementById("addToCartBtn");

    addToCartBtn.addEventListener("click", async () => {
      if (!this.product) return;
      await this.addToCart(this.product, this.quantity, addToCartBtn);
    });
  }

}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ProductDetailsPage();
});
