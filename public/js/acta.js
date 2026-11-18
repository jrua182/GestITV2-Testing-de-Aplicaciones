// =====================================================
// GestIT V2 - acta de entrega / devolución (HU-17)
// =====================================================
const numeroParam = new URLSearchParams(window.location.search).get("numero") || "";
const actaContenido = document.getElementById("actaContenido");

async function iniciarActa() {
  const sesion = await requerirSesion();
  if (!sesion) return;

  renderHeader("equipos");
  document.getElementById("imprimirBtn").addEventListener("click", () => window.print());

  const { ok, data } = await api(`/api/actas/${encodeURIComponent(numeroParam)}`);

  if (!ok) {
    document.getElementById("imprimirBtn").classList.add("hidden");
    actaContenido.innerHTML = `<div class="acta" data-testid="acta-no-encontrada"><h3>${escapeHtml(data.error || `No se encontró el acta ${numeroParam}.`)}</h3></div>`;
    return;
  }

  const a = data;
  const esEntrega = a.tipo === "Entrega";
  document.getElementById("volverFicha").href = `/equipo.html?codigo=${a.equipo.codigo}`;

  actaContenido.innerHTML = `
    <article class="acta" data-testid="acta">
      <h2 data-testid="acta-titulo">${esEntrega ? "Acta de entrega de equipo" : "Acta de devolución de equipo"}</h2>
      <p class="muted">GestIT · Área de Sistemas</p>
      <div class="dato"><span>N.º de acta</span><strong data-testid="acta-numero">${escapeHtml(a.numero)}</strong></div>
      <div class="dato"><span>Fecha y hora</span><span>${formatFecha(a.fecha)}</span></div>

      <div class="acta-seccion">
        <h3>Datos del equipo</h3>
        <div class="dato"><span>Código</span><span data-testid="acta-equipo-codigo">${escapeHtml(a.equipo.codigo)}</span></div>
        <div class="dato"><span>Marca y modelo</span><span>${escapeHtml(a.equipo.marca)} ${escapeHtml(a.equipo.modelo)}</span></div>
        <div class="dato"><span>N.º de serie</span><span>${escapeHtml(a.equipo.numeroSerie)}</span></div>
        <div class="dato"><span>Categoría</span><span>${escapeHtml(a.equipo.categoria)}</span></div>
      </div>

      <div class="acta-seccion">
        <h3>Datos del empleado</h3>
        <div class="dato"><span>Apellido y nombre</span><span data-testid="acta-empleado">${escapeHtml(a.empleado ? a.empleado.nombre : "—")}</span></div>
        <div class="dato"><span>Documento</span><span>${escapeHtml(a.empleado ? a.empleado.documento : "—")}</span></div>
        <div class="dato"><span>Sector</span><span>${escapeHtml(a.empleado ? a.empleado.sector : "—")}</span></div>
      </div>

      <div class="acta-seccion">
        <h3>${esEntrega ? "Observaciones" : "Condición de la devolución"}</h3>
        ${esEntrega
          ? `<p>${a.observaciones ? escapeHtml(a.observaciones) : "Sin observaciones."}</p>`
          : `<div class="dato"><span>Condición</span><strong data-testid="acta-condicion">${escapeHtml(a.condicion)}</strong></div>
             ${a.falla ? `<div class="dato"><span>Descripción de la falla</span><span data-testid="acta-falla">${escapeHtml(a.falla)}</span></div>` : ""}`}
      </div>

      <p class="muted" style="margin-top:18px">Registrada por: ${escapeHtml(a.usuario)}</p>

      <div class="firmas">
        <div class="firma">Firma del empleado<br><br>Aclaración: ____________________</div>
        <div class="firma">Firma del responsable de Sistemas<br><br>Aclaración: ____________________</div>
      </div>
    </article>`;
}

iniciarActa();
