// =====================================================
// GestIT V2 - ficha del equipo (HU-06, HU-18)
// =====================================================
const contenedor = document.getElementById("fichaContenido");
const codigoParam = new URLSearchParams(window.location.search).get("codigo") || "";

async function iniciarFicha() {
  const sesion = await requerirSesion();
  if (!sesion) return;

  renderHeader("equipos");
  inicializarAcciones(cargarFicha);
  await cargarFicha();
}

async function cargarFicha() {
  const { ok, data } = await api(`/api/equipos/${encodeURIComponent(codigoParam)}`);

  if (!ok) {
    contenedor.innerHTML = `
      <div class="card" data-testid="ficha-no-encontrada">
        <h3>${escapeHtml(data.error || `No se encontró ningún equipo con el código ${codigoParam}.`)}</h3>
        <a href="/dashboard" class="btn secondary">Volver al listado</a>
      </div>`;
    return;
  }

  const e = data;
  const personas = GestIT.modulos.personas;
  const identificacion = GestIT.modulos.identificacion;
  const enlaceActa = (n) => (n ? `<a href="/acta.html?numero=${n}" data-testid="link-acta-${n}">${n}</a>` : "—");

  const historial = e.historial.map((h) => `
    <tr>
      <td>${formatFecha(h.fecha)}</td>
      <td>${h.desde ? escapeHtml(h.desde) : "—"}</td>
      <td>${escapeHtml(h.hacia)}</td>
      <td>${escapeHtml(h.usuario)}</td>
      <td>${escapeHtml(h.motivo)}</td>
    </tr>`).join("");

  let responsableHtml = "";
  let tenenciasHtml = "";

  if (personas) {
    responsableHtml = `
      <section class="card" data-testid="panel-responsable">
        <h3>Responsable vigente</h3>
        ${e.responsable
          ? `<div class="dato"><span>Empleado</span><strong data-testid="responsable-nombre">${escapeHtml(e.responsable.nombre)}</strong></div>
             <div class="dato"><span>Documento</span><span>${escapeHtml(e.responsable.documento)}</span></div>
             <div class="dato"><span>Sector</span><span>${escapeHtml(e.responsable.sector)}</span></div>
             <div class="dato"><span>Entregado el</span><span>${formatFecha(e.responsable.fechaEntrega)}</span></div>
             <div class="dato"><span>Acta</span><span>${enlaceActa(e.responsable.actaEntrega)}</span></div>`
          : `<p class="muted" data-testid="sin-responsable">Sin responsable asignado.</p>`}
      </section>`;

    tenenciasHtml = `
      <section class="panel" style="margin-top:18px">
        <div class="panel-header"><h3>Historial de tenencias</h3></div>
        ${e.tenencias.length === 0
          ? `<p class="muted" style="padding:0 22px 18px" data-testid="sin-tenencias">Este equipo nunca fue entregado.</p>`
          : `<div class="table-wrapper"><table data-testid="tabla-tenencias">
              <thead><tr><th>Empleado</th><th>Entrega</th><th>Acta entrega</th><th>Devolución</th><th>Acta devolución</th><th>Condición</th></tr></thead>
              <tbody>${e.tenencias.map((t) => `
                <tr>
                  <td>${escapeHtml(t.empleado)}</td>
                  <td>${formatFecha(t.fechaEntrega)}</td>
                  <td>${enlaceActa(t.actaEntrega)}</td>
                  <td>${t.fechaDevolucion ? formatFecha(t.fechaDevolucion) : "—"}</td>
                  <td>${enlaceActa(t.actaDevolucion)}</td>
                  <td>${t.condicion ? escapeHtml(t.condicion) : "—"}</td>
                </tr>`).join("")}
              </tbody></table></div>`}
      </section>`;
  }

  const qrHtml = identificacion
    ? `<section class="card" style="margin-top:18px" data-testid="panel-qr">
        <h3>Código QR</h3>
        <div class="qr-box">
          <img src="/api/equipos/${e.codigo}/qr" alt="Código QR de ${e.codigo}" data-testid="img-qr">
          <p class="muted">Escaneá para abrir esta ficha.</p>
        </div>
      </section>`
    : "";

  contenedor.innerHTML = `
    <div class="ficha-header">
      <div>
        <span class="muted" data-testid="ficha-codigo">${e.codigo}</span>
        <h2>${escapeHtml(e.marca)} ${escapeHtml(e.modelo)}</h2>
        <span class="status-badge ${claseEstado(e.estado)}" data-testid="ficha-estado">${escapeHtml(e.estado)}</span>
        <span class="muted" style="margin-left:8px" data-testid="ficha-ultimo-cambio">Último cambio: ${formatFecha(e.ultimoCambio)}</span>
      </div>
    </div>

    <div class="ficha-grid">
      <section class="card" data-testid="panel-datos">
        <h3>Datos del equipo</h3>
        <div class="dato"><span>Marca</span><span>${escapeHtml(e.marca)}</span></div>
        <div class="dato"><span>Modelo</span><span>${escapeHtml(e.modelo)}</span></div>
        <div class="dato"><span>N.º de serie</span><code>${escapeHtml(e.numeroSerie)}</code></div>
        <div class="dato"><span>Categoría</span><span>${escapeHtml(e.categoria)}</span></div>
        <div class="dato"><span>Observaciones</span><span>${e.observaciones ? escapeHtml(e.observaciones) : "—"}</span></div>
      </section>
      <div>
        <section class="card ficha-acciones" data-testid="panel-acciones">
          <h3>Acciones</h3>
          ${renderAccionesEquipo(e)}
        </section>
        <div style="margin-top:18px">${responsableHtml}</div>
      </div>
    </div>

    <section class="panel">
      <div class="panel-header"><h3>Historial de estados</h3></div>
      <div class="table-wrapper">
        <table data-testid="tabla-historial-estados">
          <thead><tr><th>Fecha</th><th>De</th><th>A</th><th>Usuario</th><th>Motivo</th></tr></thead>
          <tbody>${historial}</tbody>
        </table>
      </div>
    </section>

    ${tenenciasHtml}
    ${qrHtml}
  `;
}

iniciarFicha();
