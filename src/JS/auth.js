import { CONSTANTS } from "./constants.js";
import { Helpers } from "./helpers.js";

export class AuthManager {
    constructor() {
        this.currentUser = document.getElementById('currentUser');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.init();
    }

    init() {
        this.updateUserStatus();
        this.setupLogout();
        this.setupPageHandlers();
    }

    setupPageHandlers() {
        // Login page handler
        const loginForm = document.getElementById("loginForm");
        if (loginForm) {
            loginForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Signup page handler
        const signupForm = document.getElementById("signupForm");
        if (signupForm) {
            signupForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }
    }

    updateUserStatus() {
        const isLoggedIn = this.isLoggedIn();
        const username = this.getCurrentUser() || 'Guest';
        
        if (this.currentUser) {
            this.currentUser.textContent = isLoggedIn ? username : 'Guest';
        }
        
        if (this.logoutBtn) {
            this.logoutBtn.style.display = isLoggedIn ? 'flex' : 'none';
        }
    }

    setupLogout() {
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    login(username) {
        if (!username || username.trim() === '') {
            Helpers.showNotification('Invalid username', 'error');
            return false;
        }
        
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username.trim());
        this.updateUserStatus();
        return true;
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            // Clear cart on logout for security
            localStorage.removeItem(CONSTANTS.CART_STORAGE_KEY);
            this.updateUserStatus();
            Helpers.showNotification('Logged out successfully', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }
    }

    isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    getCurrentUser() {
        return localStorage.getItem('username') || null;
    }

    // Validate user session
    validateSession() {
        const isLoggedIn = this.isLoggedIn();
        const username = this.getCurrentUser();
        
        return isLoggedIn && username && username.trim() !== '';
    }

    // Require authentication for protected pages
    requireAuth() {
        if (!this.validateSession()) {
            Helpers.showNotification('Please login to continue', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return false;
        }
        return true;
    }

    // Form validation helpers
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearErrors() {
        const errorElements = document.querySelectorAll(".error");
        errorElements.forEach(element => {
            element.textContent = "";
        });
    }

    validatePassword(password) {
        return password.length >= 6;
    }

    redirectToHome() {
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    }

    // Login form handler
    handleLogin() {
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        
        this.clearErrors();
        
        let isValid = true;
        
        if (!Helpers.validateEmail(email)) {
            this.showError("loginEmailError", "Please enter a valid email");
            isValid = false;
        }
        
        if (!this.validatePassword(password)) {
            this.showError("loginPasswordError", "Password must be at least 6 characters");
            isValid = false;
        }
        
        if (isValid) {
            const username = email.split('@')[0];
            this.login(username);
            Helpers.showNotification("Login successful!", "success");
            this.redirectToHome();
        }
    }

    // Signup form handler
    handleSignup() {
        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        
        this.clearErrors();
        
        let isValid = true;
        
        if (!name) {
            this.showError("nameError", "Name is required");
            isValid = false;
        }
        
        if (!Helpers.validateEmail(email)) {
            this.showError("emailError", "Please enter a valid email");
            isValid = false;
        }
        
        if (!this.validatePassword(password)) {
            this.showError("passwordError", "Password must be at least 6 characters");
            isValid = false;
        }
        
        if (password !== confirmPassword) {
            this.showError("confirmPasswordError", "Passwords do not match");
            isValid = false;
        }
        
        if (isValid) {
            this.login(name);
            Helpers.showNotification("Account created successfully!", "success");
            this.redirectToHome();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new AuthManager();
});
