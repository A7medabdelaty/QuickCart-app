import { BasePage } from "./base-page.js";
import { CONSTANTS } from "./constants.js";
import { Helpers } from "./helpers.js";

class CheckoutPage extends BasePage {
  constructor() {
    super();
    this.cartItems = JSON.parse(localStorage.getItem(CONSTANTS.CART_STORAGE_KEY) || "[]");
    this.init();
  }

  init() {
    this.checkCartEmpty();
    this.renderOrderSummary();
    this.setupCheckoutForm();
  }

  checkCartEmpty() {
    if (this.cartItems.length === 0) {
      Helpers.showNotification("Your cart is empty", "error");
      setTimeout(() => window.location.href = "cart.html", 1500);
      return;
    }
  }

  renderOrderSummary() {
    const orderSummary = document.getElementById("orderSummary");
    const subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    orderSummary.innerHTML = `
      <h3>Order Summary</h3>
      <div class="order-items">
        ${this.cartItems.map(item => `
          <div class="order-item">
            <img src="${item.image}" alt="${item.title}" class="order-item-image">
            <div class="order-item-details">
              <h4>${item.title}</h4>
              <p>Qty: ${item.quantity}</p>
              <p class="order-item-price">${Helpers.formatCurrency(item.price * item.quantity)}</p>
            </div>
          </div>
        `).join("")}
      </div>
      <div class="order-totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>${Helpers.formatCurrency(subtotal)}</span>
        </div>
        <div class="total-row">
          <span>Shipping:</span>
          <span>${shipping === 0 ? "FREE" : Helpers.formatCurrency(shipping)}</span>
        </div>
        <div class="total-row">
          <span>Tax:</span>
          <span>${Helpers.formatCurrency(tax)}</span>
        </div>
        <div class="total-row total-final">
          <span>Total:</span>
          <span>${Helpers.formatCurrency(total)}</span>
        </div>
      </div>
    `;
  }

  setupCheckoutForm() {
    const checkoutForm = document.getElementById("checkoutForm");
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.processOrder();
      });
    }

    const sameAsShipping = document.getElementById("sameAsShipping");
    const billingSection = document.getElementById("billingSection");
    
    if (sameAsShipping && billingSection) {
      sameAsShipping.addEventListener("change", (e) => {
        billingSection.style.display = e.target.checked ? "none" : "block";
      });
    }
  }

  processOrder() {
    const form = document.getElementById("checkoutForm");
    
    if (!Helpers.validateForm(form)) {
      Helpers.showNotification("Please fill in all required fields", "error");
      return;
    }

    const submitBtn = document.querySelector(".checkout-submit-btn");
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;

    setTimeout(() => {
      this.mockPaymentProcessing();
    }, 2000);
  }

  mockPaymentProcessing() {
    const paymentSuccess = Math.random() > 0.1;
    
    if (paymentSuccess) {
      const orderId = this.generateOrderId();
      localStorage.removeItem(CONSTANTS.CART_STORAGE_KEY);
      
      Helpers.showNotification("Order placed successfully!", "success");
      
      setTimeout(() => {
        this.showOrderConfirmation(orderId);
      }, 1500);
    } else {
      const submitBtn = document.querySelector(".checkout-submit-btn");
      submitBtn.innerHTML = 'Place Order';
      submitBtn.disabled = false;
      
      Helpers.showNotification("Payment failed. Please try again.", "error");
    }
  }

  generateOrderId() {
    return "QC" + Date.now().toString().slice(-8);
  }

  showOrderConfirmation(orderId) {
    const mainContent = document.querySelector(".main-content");
    mainContent.innerHTML = `
      <div class="container">
        <div class="order-confirmation">
          <div class="confirmation-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h1>Order Confirmed!</h1>
          <p class="order-id">Order ID: ${orderId}</p>
          <p class="confirmation-message">
            Thank you for your purchase! Your order has been successfully placed and you will receive a confirmation email shortly.
          </p>
          <div class="confirmation-actions">
            <a href="index.html" class="btn btn-primary">Continue Shopping</a>
            <button onclick="window.print()" class="btn btn-secondary">Print Receipt</button>
          </div>
        </div>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new CheckoutPage();
});
