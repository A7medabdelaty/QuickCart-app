import { Navbar } from "./navbar.js";
import { CartManager } from "./cart.js";
import { Helpers } from "./helpers.js";

export class BasePage {
  constructor() {
    this.navbar = new Navbar();
    this.cartManager = new CartManager();
    Helpers.setupSmoothScrolling();
  }


  showError(errorElement, message) {
    if (errorElement != null) {
      errorElement.textContent = message;
    }
  }

  addToCart(product, quantity, button) {
    if (quantity == null) {
      quantity = 1;
    }

    this.cartManager.addItem(product, quantity);
    Helpers.showNotification(product.title + " added to cart!", "success");

    if (button != null) {
      button.textContent = "Added!";
    }
  }
}
