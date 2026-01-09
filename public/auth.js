const API = "/api/auth";

// =====================
// LOGIN
// =====================
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const msg = document.getElementById("loginMsg");

  msg.innerText = "";
  msg.className = "msg";

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    msg.innerText = data.message;
    msg.classList.add("error");
    return;
  }

  msg.innerText = "Login successful!";
  msg.classList.add("success");

  localStorage.setItem("token", data.token);

  setTimeout(() => {
    window.location.href = "/dashboard.html";
  }, 800);
}

// =====================
// REGISTER
// =====================
async function register() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const msg = document.getElementById("registerMsg");

  msg.innerText = "";
  msg.className = "msg";

  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    msg.innerText = data.message;
    msg.classList.add("error");
    return;
  }

  msg.innerText = data.message;
  msg.classList.add("success");

  // auto slide to login
  setTimeout(() => {
    document.getElementById("signIn").click();
  }, 1000);
}
