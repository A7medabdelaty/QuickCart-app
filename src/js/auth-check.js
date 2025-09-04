const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

if (window.location.pathname.includes("login.html") || window.location.pathname.includes("signup.html")) {
  if (isLoggedIn) {
    window.location.href = "index.html";
  }
} else {
  if (!isLoggedIn) {
    window.location.href = "login.html";
  }
}
