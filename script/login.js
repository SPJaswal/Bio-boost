const emailField = document.getElementById("email");
const passwordSection = document.getElementById("password-section");
const passwordField = document.getElementById("password");
const errorMsg = document.getElementById("error-msg");

// Toon wachtwoordveld zodra e-mail is ingevuld
emailField.addEventListener("input", () => {
  const email = emailField.value.trim();
  const emailRegex = /.+@.+/;

  if (emailRegex.test(email)) {
    passwordSection.style.display = "block";
  } else {
    passwordSection.style.display = "none";
  }
});

// Login handler
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const password = passwordField.value.trim();

  if (password === "") {
    errorMsg.textContent = "Voer je wachtwoord in.";
    return;
  }

  if (password.length < 4) {
    errorMsg.textContent = "Wachtwoord moet minstens 4 tekens zijn.";
    return;
  }

  // ✅ Alles ok → redirect
  errorMsg.textContent = "";
  window.location.href = "../index.html";
});
