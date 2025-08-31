// Cart Management Utilities
import { CONSTANTS } from "./constants.js";

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

    // Keep backward compatibility
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
}
