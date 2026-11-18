/* Reviman – web promocional. Sin dependencias, sin cookies. */
(function () {
  "use strict";
  var C = window.REVIMAN_CONFIG || { estado: "proximamente", correoContacto: "" };
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  /* ---------- Año del pie ---------- */
  var anio = $("#anio"); if (anio) anio.textContent = new Date().getFullYear();

  /* ---------- Estado de lanzamiento y enlaces ---------- */
  var disponible = C.estado === "disponible";
  function prepararTienda(id, url) {
    var a = document.getElementById(id); if (!a) return;
    if (disponible && url) {
      a.href = url; a.target = "_blank"; a.rel = "noopener";
    } else {
      a.setAttribute("aria-disabled", "true");
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var av = $("#avisoLanzamiento");
        if (av) { av.style.transition = "transform .2s"; av.style.transform = "scale(1.04)"; setTimeout(function () { av.style.transform = ""; }, 250); }
      });
    }
  }
  prepararTienda("enlaceGooglePlay", C.googlePlay);
  prepararTienda("enlaceAppStore", C.appStore);
  if (disponible) {
    $$("[data-tienda-sub]").forEach(function (el) { el.textContent = "Disponible en"; });
    $$("[data-estado-texto]").forEach(function (el) { el.textContent = "Ya disponible en Android e iPhone"; });
    $$("[data-estado-faq]").forEach(function (el) { el.textContent = "¡Ya! Reviman está disponible gratis en Google Play y App Store. Tienes los botones de descarga al final de esta página."; });
    var av2 = $("#avisoLanzamiento"); if (av2) av2.remove();
  }

  /* ---------- Menú móvil ---------- */
  var boton = $("#botonMenu"), menu = $("#menu");
  if (boton && menu) {
    boton.addEventListener("click", function () {
      var abierto = menu.classList.toggle("abierto");
      boton.setAttribute("aria-expanded", abierto);
      boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });
    $$("#menu a").forEach(function (a) { a.addEventListener("click", function () { menu.classList.remove("abierto"); boton.setAttribute("aria-expanded", "false"); }); });
  }

  /* ---------- Sombra de cabecera ---------- */
  var cab = $("#cabecera");
  window.addEventListener("scroll", function () { cab.classList.toggle("con-sombra", window.scrollY > 10); }, { passive: true });

  /* ---------- Animaciones al hacer scroll ---------- */
  var reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reducir) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".aparecer").forEach(function (el, i) { el.style.transitionDelay = (i % 3) * 80 + "ms"; io.observe(el); });
  } else {
    $$(".aparecer").forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- Barras del plan de mantenimiento ---------- */
  var plan = $("#plan");
  function llenarBarras() { $$("#plan .barra i").forEach(function (b) { b.style.width = b.getAttribute("data-ancho") + "%"; }); }
  if (plan && "IntersectionObserver" in window) {
    var io2 = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { llenarBarras(); io2.disconnect(); } }, { threshold: 0.3 });
    io2.observe(plan);
  } else { llenarBarras(); }

  /* ---------- Demo de escaneo ---------- */
  var DATOS = {
    ticket: {
      boton: "Escanear ticket",
      campos: [["Fecha", "12/11/2026"], ["Importe", "52,30 €"], ["Litros", "34,12 L"], ["Precio", "1,533 €/L"], ["Gasolinera", "E.S. Los Olivos"]]
    },
    km: {
      boton: "Leer cuentakilómetros",
      campos: [["Kilómetros totales", "84.230 km"], ["Descartado: parcial", "312,4"], ["Descartado: hora y temperatura", "14:32 · 12 °C"], ["Coherente con la última lectura", "+412 km en 6 días"]]
    }
  };
  var modo = "ticket", ocupado = false;
  var visor = $("#visor"), campos = $("#campos"), bEsc = $("#botonEscanear");
  var tabT = $("#tabTicket"), tabK = $("#tabKm"), ticket = $("#ticket"), cuadro = $("#cuadro");

  function pintarCampos() {
    campos.innerHTML = "";
    DATOS[modo].campos.forEach(function (c) {
      var d = document.createElement("div");
      d.className = "campo";
      d.innerHTML = "<span></span><b></b>";
      d.firstChild.textContent = c[0];
      d.lastChild.textContent = c[1];
      campos.appendChild(d);
    });
    bEsc.querySelector("span").textContent = DATOS[modo].boton;
  }
  function cambiar(m) {
    if (ocupado || m === modo) return;
    modo = m;
    tabT.setAttribute("aria-selected", m === "ticket");
    tabK.setAttribute("aria-selected", m === "km");
    ticket.classList.toggle("oculto", m !== "ticket");
    cuadro.classList.toggle("oculto", m !== "km");
    visor.classList.remove("leido", "escaneando");
    pintarCampos();
  }
  function escanear() {
    if (ocupado) return;
    ocupado = true; bEsc.disabled = true;
    visor.classList.remove("leido");
    $$("#campos .campo").forEach(function (c) { c.classList.remove("visto"); });
    void visor.offsetWidth; // reinicia la animación
    visor.classList.add("escaneando");
    var espera = reducir ? 0 : 1500;
    setTimeout(function () {
      visor.classList.remove("escaneando");
      visor.classList.add("leido");
      $$("#campos .campo").forEach(function (c, i) {
        setTimeout(function () { c.classList.add("visto"); }, reducir ? 0 : i * 220);
      });
      setTimeout(function () {
        ocupado = false; bEsc.disabled = false;
        bEsc.querySelector("span").textContent = "Repetir";
      }, reducir ? 0 : DATOS[modo].campos.length * 220 + 200);
    }, espera);
  }
  if (visor) {
    tabT.addEventListener("click", function () { cambiar("ticket"); });
    tabK.addEventListener("click", function () { cambiar("km"); });
    bEsc.addEventListener("click", escanear);
    pintarCampos();
  }

  /* ---------- Calculadora de coste ---------- */
  var fmt0 = { format: function (n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); } };
  var fmt2 = new Intl.NumberFormat("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function num(id) { var v = parseFloat(document.getElementById(id).value.replace(",", ".")); return isFinite(v) && v > 0 ? v : 0; }
  function calcular() {
    var anual = num("cCombustible") * 12 + num("cSeguro") + num("cImpuesto") + num("cMant") + num("cOtros");
    var km = num("cKm");
    $("#rAnual").innerHTML = fmt0.format(anual) + " <small>€</small>";
    $("#rMes").textContent = fmt0.format(anual / 12) + " €";
    $("#rKm").textContent = km ? fmt2.format(anual / km) + " €" : "—";
  }
  var calc = $("#calc");
  if (calc) { calc.addEventListener("input", calcular); calcular(); }

  /* ---------- Formularios (contacto y pre-reserva) ---------- */
  var clave = (C.web3formsKey || "").trim();
  var correo = C.correoContacto || "info@reviman.es";
  var ENDPOINT = "https://api.web3forms.com/submit";
  var correoVisible = $("#correoVisible");
  if (correoVisible) { correoVisible.href = "mailto:" + correo; correoVisible.textContent = correo; }

  // Mientras la app no esté publicada, los botones principales llevan a la pre-reserva
  if (!disponible) {
    $$("[data-cta]").forEach(function (a) { a.href = "#prereserva"; });
    $$("[data-cta-texto]").forEach(function (t) { t.textContent = "Reserva tu descuento"; });
  }
  if (C.descuentoPreReserva) { var td = $("#textoDescuento"); if (td) td.textContent = "un " + C.descuentoPreReserva + " de descuento"; }

  function limpiar(t) { return String(t).replace(/[<>&"]/g, ""); }
  function emailValido(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
  function marcar(campo, texto) {
    var err = campo.parentNode.querySelector(".error");
    campo.setAttribute("aria-invalid", texto ? "true" : "false");
    if (err) err.textContent = texto || "";
  }
  function mostrar(caja, tipo, html) { caja.className = "resultado " + tipo; caja.innerHTML = html; }

  /* Envía a Web3Forms. Si no hay clave configurada, abre el correo del visitante. */
  function enviar(o) {
    o.resultado.textContent = "";
    if (o.form.botcheck && o.form.botcheck.checked) return; // robot
    if (!clave) {
      window.location.href = "mailto:" + correo + "?subject=" + encodeURIComponent(o.asunto) + "&body=" + encodeURIComponent(o.textoCorreo);
      mostrar(o.resultado, "ok", "Se ha abierto tu programa de correo con el mensaje preparado. Solo tienes que pulsar Enviar.");
      return;
    }
    var fd = new FormData();
    fd.append("access_key", clave);
    fd.append("subject", o.asunto);
    fd.append("from_name", "Web de Reviman");
    fd.append("replyto", o.datos.email);
    Object.keys(o.datos).forEach(function (k) { fd.append(k, o.datos[k]); });
    var txt = o.boton.querySelector("span"), original = txt.textContent;
    o.boton.disabled = true; txt.textContent = "Enviando…";
    fetch(ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: fd })
      .then(function (r) { return r.json().catch(function () { return { success: false }; }); })
      .then(function (r) {
        if (!r || !r.success) throw new Error((r && r.message) || "Error");
        o.form.reset();
        mostrar(o.resultado, "ok", o.mensajeOk);
      })
      .catch(function () {
        mostrar(o.resultado, "mal", "No se ha podido enviar. Inténtalo de nuevo o escríbenos a <a href=\"mailto:" + correo + "\">" + correo + "</a>.");
      })
      .then(function () { o.boton.disabled = false; txt.textContent = original; });
  }

  /* Contacto */
  var form = $("#formContacto");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var n = $("#fNombre"), e = $("#fEmail"), m = $("#fMensaje"), p = $("#fPrivacidad"), primero = null;
      if (!n.value.trim()) { marcar(n, "Escribe tu nombre."); primero = primero || n; } else marcar(n);
      if (!emailValido(e.value.trim())) { marcar(e, "Revisa el correo electrónico."); primero = primero || e; } else marcar(e);
      if (m.value.trim().length < 5) { marcar(m, "Escribe tu mensaje."); primero = primero || m; } else marcar(m);
      $("#errorPrivacidad").textContent = p.checked ? "" : "Necesitamos que aceptes la política de privacidad.";
      if (!p.checked) primero = primero || p;
      if (primero) { primero.focus(); return; }
      var d = { tipo: "Contacto", nombre: n.value.trim(), email: e.value.trim(), motivo: $("#fMotivo").value, mensaje: m.value.trim() };
      enviar({
        form: form, boton: $("#botonEnviar"), resultado: $("#resultadoFormulario"), datos: d,
        asunto: "[Web Reviman] " + d.motivo + " – " + d.nombre,
        textoCorreo: d.mensaje + "\n\n—\n" + d.nombre + " <" + d.email + ">",
        mensajeOk: "¡Gracias, " + limpiar(d.nombre) + "! Hemos recibido tu mensaje y te responderemos pronto."
      });
    });
  }

  /* Pre-reserva */
  var pre = $("#formPreReserva");
  if (pre) {
    pre.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var e = $("#pEmail"), c = $("#pConsentimiento"), primero = null;
      if (!emailValido(e.value.trim())) { marcar(e, "Escribe un correo electrónico válido."); primero = e; } else marcar(e);
      $("#errorConsentimiento").textContent = c.checked ? "" : "Marca la casilla para poder apuntarte.";
      if (!c.checked) primero = primero || c;
      if (primero) { primero.focus(); return; }
      var plat = pre.querySelector("input[name=plataforma]:checked");
      var d = {
        tipo: "Pre-reserva",
        email: e.value.trim(),
        nombre: $("#pNombre").value.trim() || "(sin nombre)",
        plataforma: plat ? plat.value : "",
        consentimiento: "Sí – aviso de lanzamiento y oferta de pre-reserva",
        fecha: new Date().toISOString()
      };
      enviar({
        form: pre, boton: $("#botonPreReserva"), resultado: $("#resultadoPreReserva"), datos: d,
        asunto: "[Pre-reserva] " + d.email + " · " + d.plataforma,
        textoCorreo: "Quiero apuntarme a la lista de pre-reserva de Reviman.\n\nCorreo: " + d.email + "\nNombre: " + d.nombre + "\nMóvil: " + d.plataforma + "\nAcepto recibir el aviso del lanzamiento y la oferta.",
        mensajeOk: "🎉 ¡Estás dentro! Te escribiremos el día del lanzamiento con tu precio especial."
      });
    });
    ["#pEmail", "#fNombre", "#fEmail", "#fMensaje"].forEach(function (sel) {
      var el = $(sel); if (el) el.addEventListener("input", function () { if (this.getAttribute("aria-invalid") === "true") marcar(this); });
    });
  }
})();
