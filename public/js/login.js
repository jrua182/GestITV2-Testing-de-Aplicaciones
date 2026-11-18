const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  loginError.classList.add("hidden");
  loginError.textContent = "";

  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ usuario, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo iniciar sesión.");
    }

    // HU-01 / HU-18: volver a la página pedida antes del login (solo rutas internas)
    const next = new URLSearchParams(window.location.search).get("next");
    const destinoValido = next && next.startsWith("/") && !next.startsWith("//");
    window.location.href = destinoValido ? next : "/dashboard";
  } catch (error) {
    loginError.textContent = error.message;
    loginError.classList.remove("hidden");
  }
});
