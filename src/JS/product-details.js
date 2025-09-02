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

    if (this.productId == null) {
      this.showError("Product ID not found in URL");
      return;
    }
  }

  async loadProductDetails() {
    const loadingElement = document.getElementById("productLoading");
    const contentElement = document.getElementById("productDetailsContent");
    const errorElement = document.getElementById("productError");

    try {
      loadingElement.style.display = "block";
      contentElement.style.display = "none";
      errorElement.style.display = "none";

      this.product = await ApiService.getProduct(this.productId);

      loadingElement.style.display = "none";
      contentElement.style.display = "block";
      errorElement.style.display = "none";

      this.renderProductDetails();
    } catch (error) {
      console.error("Error loading product details:", error);
      loadingElement.style.display = "none";
      contentElement.style.display = "none";
      errorElement.style.display = "block";
      this.showError(errorElement, "Failed to load product details");
    }
  }

  renderProductDetails() {
    if (this.product == null) {
      return;
    }

    document.title = "QuickCart - " + this.product.title;

    const productImage = document.getElementById("productImage");
    productImage.src = this.product.image;
    productImage.alt = this.product.title;

    const productCategory = document.getElementById("productCategory");
    productCategory.textContent = this.product.category;

    const productTitle = document.getElementById("productTitle");
    productTitle.textContent = this.product.title;

    const productRating = document.getElementById("productRating");
    productRating.innerHTML = Helpers.renderStars(this.product.rating.rate);

    const ratingText = document.getElementById("ratingText");
    ratingText.textContent = this.product.rating.rate + "/5 (" + this.product.rating.count + " reviews)";

    const productPrice = document.getElementById("productPrice");
    productPrice.textContent = Helpers.formatCurrency(this.product.price);

    const productDescription = document.getElementById("productDescription");
    productDescription.textContent = this.product.description;
  }


  setupQuantityControls() {
    const quantityInput = document.getElementById("quantity");
    const decreaseBtn = document.getElementById("decreaseQty");
    const increaseBtn = document.getElementById("increaseQty");

    if (decreaseBtn != null) {
      decreaseBtn.addEventListener("click", () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > CONSTANTS.MIN_QUANTITY) {
          quantityInput.value = currentValue - 1;
          this.quantity = currentValue - 1;
        }
      });
    }

    if (increaseBtn != null) {
      increaseBtn.addEventListener("click", () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < CONSTANTS.MAX_QUANTITY) {
          quantityInput.value = currentValue + 1;
          this.quantity = currentValue + 1;
        }
      });
    }

    if (quantityInput != null) {
      quantityInput.addEventListener("change", (e) => {
        let value = parseInt(e.target.value);
        if (value < CONSTANTS.MIN_QUANTITY) {
          value = CONSTANTS.MIN_QUANTITY;
        }
        if (value > CONSTANTS.MAX_QUANTITY) {
          value = CONSTANTS.MAX_QUANTITY;
        }
        e.target.value = value;
        this.quantity = value;
      });
    }
  }

  setupAddToCartButton() {
    const addToCartBtn = document.getElementById("addToCartBtn");

    if (addToCartBtn != null) {
      addToCartBtn.addEventListener("click", () => {
        if (this.product != null) {
          this.addToCart(this.product, this.quantity, addToCartBtn);
        }
      });
    }
  }
}

let productDetailsPage;
document.addEventListener("DOMContentLoaded", () => {
  productDetailsPage = new ProductDetailsPage();
});
