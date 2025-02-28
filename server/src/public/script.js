function getById(id) {
  return document.getElementById(id);
}

const error = getById("error");
const success = getById("success");

const password = getById("password");
const confirmPassword = getById("confirm");
const form = getById("form");
const submit = getById("submit");
const container = getById("container");
const loader = getById("loader");

error.style.display = "none";
success.style.display = "none";

let token, userId;

let passRegex =
  /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

window.addEventListener("DOMContentLoaded", async () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => {
      return searchParams.get(prop);
    },
  });
  token = params.token;
  userId = params.userId;

  const res = await fetch("/verify-pass-reset-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ token, userId }),
  });

  if (!res.ok) {
    const { message } = await res.json();
    error.innerText = message;
    error.style.display = "block";
    return;
  }

  loader.style.display = "none";
  container.style.display = "block";
});

function displayError(errorMessage) {
  success.style.display = "none";
  error.innerText = errorMessage;
  error.style.display = "block";
}

function displaySuccess(successMessage) {
  error.style.display = "none";
  success.innerText = successMessage;
  success.style.display = "block";
}

// function to update password
async function handleSubmit(e) {
  e.preventDefault();

  if (!password.value.trim()) {
    // render error message
    displayError("Password is required");
    return;
  }

  if (!passRegex.test(password.value)) {
    return displayError("password is too weak!");
  }

  if (password.value != confirmPassword.value) {
    return displayError("password mismatch!");
  }

  submit.disabled = true;
  submit.innerText = "Updating password...";

  //   handle update password
  const res = await fetch("/auth/update-password", {
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    method: "POST",
    body: JSON.stringify({ password: password.value, token, userId }),
  });
  submit.disabled = false;
  submit.innerText = "Reset Password";
  if (!res.ok) {
    const { message } = await res.json();
    displayError(message);
    return;
  }

  displaySuccess("Password updated successfully");

  password.value = "";
  confirmPassword.value = "";
}

form.addEventListener("submit", handleSubmit);
