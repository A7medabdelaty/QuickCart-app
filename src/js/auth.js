import { CONSTANTS } from "./constants.js";
import { Helpers } from "./helpers.js";

export class AuthManager {
  constructor() {
    this.currentUser = document.getElementById("currentUser");
    this.logoutBtn = document.getElementById("logoutBtn");
    this.updateUserStatus();
    this.setupEvents();
  }

  setupEvents() {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    if (signupForm) {
      signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSignup();
      });
    }

    if (this.logoutBtn) {
      this.logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  }

  updateUserStatus() {
    const username = this.getCurrentUser() || "Guest";
    const isLoggedIn = this.isLoggedIn();

    if (this.currentUser) {
      this.currentUser.textContent = username;
    }
    if (this.logoutBtn) {
      this.logoutBtn.style.display = isLoggedIn ? "flex" : "none";
    }
  }

  login(username) {
    if (!username?.trim()) {
      Helpers.showNotification("Invalid username", "error");
      return false;
    }

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", username.trim());
    this.updateUserStatus();
    return true;
  }

  hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  validateCredentials(email, password) {
    try {
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const hashedPassword = this.hashPassword(password);
      return users.find(
        (user) => user.email === email && user.password === hashedPassword
      );
    } catch (error) {
      console.error("Error validating credentials:", error);
      return null;
    }
  }

  registerUser(name, email, password) {
    try {
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");

      if (users.find((user) => user.email === email)) {
        return { success: false, message: "Email already registered" };
      }

      const hashedPassword = this.hashPassword(password);

      users.push({ name: name, email, password: hashedPassword });
      localStorage.setItem("registeredUsers", JSON.stringify(users));
      return { success: true };
    } catch (error) {
      console.error("Error registering user:", error);
      return { success: false, message: "Registration failed" };
    }
  }

  logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem(CONSTANTS.CART_STORAGE_KEY);
    this.updateUserStatus();
    Helpers.showNotification("Logged out successfully", "success");
    setTimeout(() => (window.location.href = "login.html"), 1000);
  }

  isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
  }

  getCurrentUser() {
    return localStorage.getItem("username");
  }

  showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  clearErrors() {
    document.querySelectorAll(".error").forEach((element) => {
      element.textContent = "";
    });
  }

  handleLogin() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    this.clearErrors();

    if (!Helpers.validateEmail(email)) {
      this.showError("loginEmailError", "Please enter a valid email");
      return;
    }

    if (password.length < 6) {
      this.showError(
        "loginPasswordError",
        "Password must be at least 6 characters"
      );
      return;
    }

    const user = this.validateCredentials(email, password);
    if (!user) {
      this.showError("loginEmailError", "Invalid email or password");
      return;
    }

    if (this.login(user.name)) {
      Helpers.showNotification("Login successful!", "success");
      setTimeout(() => (window.location.href = "index.html"), 1500);
    }
  }

  handleSignup() {
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    this.clearErrors();

    if (!name) {
      this.showError("nameError", "Name is required");
      return;
    }

    if (!Helpers.validateEmail(email)) {
      this.showError("emailError", "Please enter a valid email");
      return;
    }

    if (password.length < 6) {
      this.showError("passwordError", "Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      this.showError("confirmPasswordError", "Passwords do not match");
      return;
    }

    const result = this.registerUser(name, email, password);
    if (!result.success) {
      this.showError("emailError", result.message);
      return;
    }

    if (this.login(name)) {
      Helpers.showNotification("Account created successfully!", "success");
      setTimeout(() => (window.location.href = "index.html"), 1500);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new AuthManager();
});
