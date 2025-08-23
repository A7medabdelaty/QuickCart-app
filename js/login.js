document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  let valid = true;

  if (!email) {
    showError("loginEmailError", "Email is required");
    valid = false;
  } else clearError("loginEmailError");

  if (!password) {
    showError("loginPasswordError", "Password is required");
    valid = false;
  } else clearError("loginPasswordError");

  if (!valid) return;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    alert(`Welcome back, ${user.name}!`);
    window.location.href = "index.html"; // redirect to homepage
  } else {
    showError("loginPasswordError", "Invalid credentials");
  }
});

function showError(id, msg) {
  document.getElementById(id).textContent = msg;
}
function clearError(id) {
  document.getElementById(id).textContent = "";
}
