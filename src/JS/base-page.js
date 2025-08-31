// Base Page Class - Common functionality for all pages
import { Navbar } from "./navbar.js";
import { AuthManager } from "./auth.js";
import { CartManager } from "./cart.js";
import { Helpers } from "./helpers.js";
import { CONSTANTS } from "./constants.js";

export class BasePage {
  constructor() {
    this.navbar = new Navbar();
    this.authManager = new AuthManager();
    this.cartManager = new CartManager();
    this.initializeCommon();
  }

  initializeCommon() {
    Helpers.setupSmoothScrolling();
  }

  /**
   * Manages loading state for UI elements
   * @param {HTMLElement} loadingElement - Loading indicator element
   * @param {HTMLElement} contentElement - Main content element
   * @param {HTMLElement} errorElement - Error message element
   * @param {boolean} isLoading - Whether to show loading state
   * @param {boolean} hasError - Whether to show error state
   */
  setLoadingState(loadingElement, contentElement, errorElement, isLoading = false, hasError = false) {
    if (!loadingElement || !contentElement || !errorElement) {
      console.warn('Missing required elements for loading state management');
      return;
    }

    if (hasError) {
      loadingElement.style.display = "none";
      contentElement.style.display = "none";
      errorElement.style.display = "block";
    } else if (isLoading) {
      loadingElement.style.display = "block";
      contentElement.style.display = "none";
      errorElement.style.display = "none";
    } else {
      loadingElement.style.display = "none";
      contentElement.style.display = "block";
      errorElement.style.display = "none";
    }
  }

  /**
   * Shows error message in error element
   * @param {HTMLElement} errorElement - Error container element
   * @param {string} message - Error message to display
   */
  showError(errorElement, message) {
    if (!errorElement) {
      console.error('Error element not found');
      return;
    }

    const errorText = errorElement.querySelector("p");
    if (errorText) {
      errorText.textContent = message;
    } else {
      errorElement.textContent = message;
    }
  }

  /**
   * Unified add to cart functionality
   * @param {Object} product - Product object
   * @param {number} quantity - Quantity to add
   * @param {HTMLElement} button - Button element to update
   * @returns {Promise<boolean>} - Success status
   */
  async addToCart(product, quantity = 1, button = null) {
    try {
      this.cartManager.addItem(product, quantity);

      const quantityText = quantity > 1 ? ` (${quantity} items)` : "";
      Helpers.showNotification(
        `${product.title}${quantityText} added to cart!`,
        "success"
      );

      if (button) {
        Helpers.updateButtonState(
          button, 
          '<i class="fas fa-check"></i> Added to Cart!',
          CONSTANTS.BUTTON_STATE_DURATION
        );
      }

      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      Helpers.showNotification("Failed to add item to cart", "error");
      return false;
    }
  }
}
