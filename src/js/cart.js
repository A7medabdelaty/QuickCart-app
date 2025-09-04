// Cart Management Utilities
import { CONSTANTS } from "./constants.js";
import { Helpers } from "./helpers.js";

export class CartManager {
    constructor() {
        this.cartCount = document.querySelector('.cart-count');
        this.init();
    }

    init() {
        this.updateCartCount();
    }

    updateCartCount() {
        if (this.cartCount) {
            const count = this.getCartItemCount();
            this.cartCount.textContent = count;
        }
    }

    getCartItemCount() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    getCart() {
        const cart = localStorage.getItem(CONSTANTS.CART_STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    }

    addItem(product, quantity = 1) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }

        localStorage.setItem(CONSTANTS.CART_STORAGE_KEY, JSON.stringify(cart));
        this.updateCartCount();
    }

    addToCart(product) {
        this.addItem(product, 1);
    }

    removeFromCart(productId) {
        const cart = this.getCart();
        const updatedCart = cart.filter(item => item.id !== productId);
        localStorage.setItem(CONSTANTS.CART_STORAGE_KEY, JSON.stringify(updatedCart));
        this.updateCartCount();
    }

    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);
        
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                localStorage.setItem(CONSTANTS.CART_STORAGE_KEY, JSON.stringify(cart));
                this.updateCartCount();
            }
        }
    }

    clearCart() {
        localStorage.removeItem(CONSTANTS.CART_STORAGE_KEY);
        this.updateCartCount();
    }

    getCartTotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Cart Page specific functionality
    renderCartPage() {
        if (window.location.pathname.includes('cart.html')) {
            this.initCartPage();
        }
    }

    initCartPage() {
        this.cartItems = this.getCart();
        this.renderCart();
        this.setupCartPageEventListeners();
    }

    setupCartPageEventListeners() {
        // Continue shopping button
        const continueShoppingBtn = document.getElementById("continueShoppingBtn");
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener("click", () => {
                window.location.href = "index.html";
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById("checkoutBtn");
        if (checkoutBtn) {
            checkoutBtn.addEventListener("click", () => {
                this.handleCheckout();
            });
        }

        // Clear cart button
        const clearCartBtn = document.getElementById("clearCartBtn");
        if (clearCartBtn) {
            clearCartBtn.addEventListener("click", () => {
                this.handleClearCart();
            });
        }
    }

    renderCart() {
        const cartContainer = document.getElementById("cartItems");
        const emptyCartSection = document.getElementById("emptyCart");
        const cartContentSection = document.getElementById("cartContent");

        if (!cartContainer) return; // Not on cart page

        if (this.cartItems.length === 0) {
            this.showEmptyCart(emptyCartSection, cartContentSection);
            return;
        }

        this.showCartContent(emptyCartSection, cartContentSection);
        this.renderCartItems(cartContainer);
        this.updateCartSummary();
    }

    showEmptyCart(emptyCartSection, cartContentSection) {
        if (emptyCartSection) emptyCartSection.style.display = "block";
        if (cartContentSection) cartContentSection.style.display = "none";
    }

    showCartContent(emptyCartSection, cartContentSection) {
        if (emptyCartSection) emptyCartSection.style.display = "none";
        if (cartContentSection) cartContentSection.style.display = "block";
    }

    renderCartItems(container) {
        container.innerHTML = this.cartItems
            .map((item) => this.createCartItemHTML(item))
            .join("");

        this.setupCartItemEventListeners();
    }

    createCartItemHTML(item) {
        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.title}</h3>
                    <p class="cart-item-category">${item.category}</p>
                    <div class="cart-item-rating">
                        ${Helpers.renderStars(item.rating.rate)}
                        <span class="rating-text">${item.rating.rate}/5</span>
                    </div>
                </div>
                <div class="cart-item-price">
                    <span class="item-price">${Helpers.formatCurrency(item.price)}</span>
                </div>
                <div class="cart-item-quantity">
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease-btn" data-product-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" 
                               min="${CONSTANTS.MIN_QUANTITY}" max="${CONSTANTS.MAX_QUANTITY}" 
                               data-product-id="${item.id}">
                        <button class="quantity-btn increase-btn" data-product-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="cart-item-total">
                    <span class="item-total">${Helpers.formatCurrency(item.price * item.quantity)}</span>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-item-btn" data-product-id="${item.id}" title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    setupCartItemEventListeners() {
        // Quantity decrease buttons
        document.querySelectorAll(".decrease-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const productId = parseInt(e.currentTarget.dataset.productId);
                this.updateCartQuantity(productId, -1);
            });
        });

        // Quantity increase buttons
        document.querySelectorAll(".increase-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const productId = parseInt(e.currentTarget.dataset.productId);
                this.updateCartQuantity(productId, 1);
            });
        });

        // Quantity input direct change
        document.querySelectorAll(".quantity-input").forEach((input) => {
            input.addEventListener("change", (e) => {
                const productId = parseInt(e.target.dataset.productId);
                const newQuantity = parseInt(e.target.value);
                this.setCartQuantity(productId, newQuantity);
            });
        });

        // Remove item buttons
        document.querySelectorAll(".remove-item-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const productId = parseInt(e.currentTarget.dataset.productId);
                this.removeCartItem(productId);
            });
        });
    }

    updateCartQuantity(productId, change) {
        const item = this.cartItems.find((item) => item.id === productId);
        if (!item) return;

        const newQuantity = item.quantity + change;
        if (newQuantity < CONSTANTS.MIN_QUANTITY) {
            this.removeCartItem(productId);
            return;
        }

        if (newQuantity > CONSTANTS.MAX_QUANTITY) {
            Helpers.showNotification(
                `Maximum quantity is ${CONSTANTS.MAX_QUANTITY}`,
                "error"
            );
            return;
        }

        this.updateQuantity(productId, newQuantity);
        this.refreshCartPage();
    }

    setCartQuantity(productId, quantity) {
        if (quantity < CONSTANTS.MIN_QUANTITY) {
            this.removeCartItem(productId);
            return;
        }

        if (quantity > CONSTANTS.MAX_QUANTITY) {
            quantity = CONSTANTS.MAX_QUANTITY;
        }

        this.updateQuantity(productId, quantity);
        this.refreshCartPage();
    }

    async removeCartItem(productId) {
        const item = this.cartItems.find((item) => item.id === productId);
        if (!item) return;

        const result = await Swal.fire({
            title: 'Remove Item?',
            html: `Are you sure you want to remove <strong>"${item.title}"</strong> from your cart?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="fas fa-trash"></i> Yes, remove it',
            cancelButtonText: '<i class="fas fa-times"></i> Cancel',
            reverseButtons: true,
            focusCancel: true,
            customClass: {
                popup: 'swal-modern-popup',
                title: 'swal-modern-title',
                htmlContainer: 'swal-modern-content',
                confirmButton: 'swal-modern-confirm',
                cancelButton: 'swal-modern-cancel'
            },
            backdrop: `
                rgba(0,0,0,0.4)
                url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.1'%3e%3ccircle cx='30' cy='30' r='4'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")
                left top
                repeat
            `
        });

        if (result.isConfirmed) {
            this.removeFromCart(productId);
            this.refreshCartPage();
            
            Swal.fire({
                title: 'Removed!',
                text: `${item.title} has been removed from your cart.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
                customClass: {
                    popup: 'swal-toast-popup'
                }
            });
        }
    }

    refreshCartPage() {
        this.cartItems = this.getCart();
        this.renderCart();
    }

    updateCartSummary() {
        const subtotal = this.getCartTotal();
        const itemCount = this.getCartItemCount();
        const shipping = subtotal > 50 ? 0 : 9.99;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;

        this.updateSummaryElement("cartItemCount", `${itemCount} item${itemCount !== 1 ? 's' : ''}`);
        this.updateSummaryElement("cartSubtotal", Helpers.formatCurrency(subtotal));
        this.updateSummaryElement("cartShipping", shipping === 0 ? "FREE" : Helpers.formatCurrency(shipping));
        this.updateSummaryElement("cartTax", Helpers.formatCurrency(tax));
        this.updateSummaryElement("cartTotal", Helpers.formatCurrency(total));

        const shippingMessage = document.getElementById("shippingMessage");
        if (shippingMessage) {
            if (subtotal > 50) {
                shippingMessage.innerHTML = '<i class="fas fa-check text-success"></i> You qualify for free shipping!';
                shippingMessage.className = "shipping-message success";
            } else {
                const remaining = 50 - subtotal;
                shippingMessage.innerHTML = `<i class="fas fa-truck"></i> Add ${Helpers.formatCurrency(remaining)} more for free shipping`;
                shippingMessage.className = "shipping-message";
            }
        }

        const checkoutBtn = document.getElementById("checkoutBtn");
        if (checkoutBtn) {
            checkoutBtn.disabled = itemCount === 0;
        }
    }

    updateSummaryElement(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    async handleClearCart() {
        if (this.cartItems.length === 0) return;

        const result = await Swal.fire({
            title: 'Clear Entire Cart?',
            html: `This will remove <strong>all ${this.cartItems.length} item${this.cartItems.length !== 1 ? 's' : ''}</strong> from your cart.<br><br>This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="fas fa-trash-alt"></i> Yes, clear cart',
            cancelButtonText: '<i class="fas fa-times"></i> Cancel',
            reverseButtons: true,
            focusCancel: true,
            customClass: {
                popup: 'swal-modern-popup',
                title: 'swal-modern-title',
                htmlContainer: 'swal-modern-content',
                confirmButton: 'swal-modern-confirm',
                cancelButton: 'swal-modern-cancel'
            },
            backdrop: `
                rgba(0,0,0,0.4)
                url("data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.1'%3e%3ccircle cx='30' cy='30' r='4'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")
                left top
                repeat
            `
        });

        if (result.isConfirmed) {
            this.clearCart();
            this.refreshCartPage();
            
            Swal.fire({
                title: 'Cart Cleared!',
                text: 'Your cart has been successfully cleared.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
                customClass: {
                    popup: 'swal-toast-popup'
                }
            });
        }
    }

    handleCheckout() {
        if (this.cartItems.length === 0) {
            Helpers.showNotification("Your cart is empty", "error");
            return;
        }
        window.location.href = "check-out.html";
    }
}

// Auto-initialize cart functionality when DOM loads
document.addEventListener("DOMContentLoaded", () => {
    const cartManager = new CartManager();
    
    // If on cart page, render cart content
    if (window.location.pathname.includes('cart.html')) {
        cartManager.renderCartPage();
    }
});
