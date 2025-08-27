// Home Page JavaScript
import { Navbar } from '../components/navbar.js';
import { AuthManager } from '../utils/auth.js';
import { CartManager } from '../utils/cart.js';
import { Helpers } from '../utils/helpers.js';

class HomePage {
    constructor() {
        this.navbar = new Navbar();
        this.authManager = new AuthManager();
        this.cartManager = new CartManager();
        
        this.init();
    }

    init() {
        this.setupContactForm();
        Helpers.setupSmoothScrolling();
        Helpers.setupButtonLoading();
    }

    setupContactForm() {
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (Helpers.validateForm(contactForm)) {
                    // Simulate form submission
                    Helpers.showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    Helpers.showNotification('Please fill in all required fields correctly.', 'error');
                }
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HomePage();
});
