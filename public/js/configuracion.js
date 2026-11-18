// =====================================================
// GestIT V2 - configuración de módulos (HU-20)
// =====================================================
const NOMBRES = {
  personas: "Personas y entregas",
  identificacion: "Identificación física"
};

async function iniciarConfiguracion() {
  const sesion = await requerirSesion();
  if (!sesion) return;

  // Solo el Administrador accede a la configuración
  if (!esAdmin()) {
    window.location.href = "/dashboard";
    return;
  }

  renderHeader("configuracion");
  pintarToggles();

  ["personas", "identificacion"].forEach((clave) => {
    document.getElementById(`toggle-${clave}`).addEventListener("change", (event) =>
      cambiarModulo(clave, event.target)
    );
  });
}

function pintarToggles() {
  document.getElementById("toggle-personas").checked = GestIT.modulos.personas;
  document.getElementById("toggle-identificacion").checked = GestIT.modulos.identificacion;
}

async function cambiarModulo(clave, input) {
  const activo = input.checked;
  const accion = activo ? "activar" : "desactivar";
  const confirmar = confirm(`¿Seguro que querés ${accion} el módulo ${NOMBRES[clave]}?`);

  if (!confirmar) {
    input.checked = !activo;
    return;
  }

  const { ok, data } = await api(`/api/modulos/${clave}`, { method: "PUT", body: { activo } });

  if (!ok) {
    input.checked = !activo;
    mostrarAlerta(data.error || "No se pudo actualizar el módulo.", "error");
    return;
  }

  GestIT.modulos = data.modulos;
  renderHeader("configuracion");
  mostrarAlerta(data.mensaje, "success");
}

iniciarConfiguracion();
