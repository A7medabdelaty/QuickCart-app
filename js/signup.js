document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  let valid = true;

  if (!name) {
    showError("nameError", "Name is required");
    valid = false;
  } else clearError("nameError");

  if (!email.includes("@") || email.endsWith("@gmail.com")) {
    showError("emailError", "Use a valid business email");
    valid = false;
  } else clearError("emailError");

  if (password.length < 8) {
    showError("passwordError", "Password must be at least 8 characters");
    valid = false;
  } else clearError("passwordError");

  if (password !== confirmPassword) {
    showError("confirmPasswordError", "Passwords do not match");
    valid = false;
  } else clearError("confirmPasswordError");

  if (!valid) return;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.some((u) => u.email === email)) {
    showError("emailError", "Email already registered");
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful! Redirecting to login...");
  window.location.href = "login.html";
});

function showError(id, msg) {
  document.getElementById(id).textContent = msg;
}
function clearError(id) {
  document.getElementById(id).textContent = "";
}
