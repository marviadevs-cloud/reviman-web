/* ==========================================================
   CONFIGURACIÓN DE LA WEB DE REVIMAN
   Este es el ÚNICO archivo que necesitas tocar cuando cambie algo.
   ========================================================== */
window.REVIMAN_CONFIG = {
  // "proximamente" → botones de tienda desactivados + aviso de lanzamiento
  // "disponible"   → botones enlazan a las tiendas y dicen "Disponible en"
  estado: "proximamente",

  // Enlaces a las tiendas (rellenar cuando la app esté publicada)
  googlePlay: "https://play.google.com/store/apps/details?id=com.reviman",
  appStore: "",   // p. ej. "https://apps.apple.com/es/app/reviman/id0000000000"

  // Correo de contacto (y para la lista de aviso del lanzamiento)
  // Correo de contacto definitivo
  correoContacto: "info@reviman.es",

  // Formularios de contacto y pre-reserva (servicio gratuito Web3Forms, 250 mensajes/mes)
  // Clave de acceso que Web3Forms envía a info@reviman.es (ver LEEME.md).
  // Mientras esté vacía, el formulario abre el programa de correo del visitante.
  web3formsKey: "3844272a-085a-424c-817d-9df847595e15",

  // Descuento de la lista de pre-reserva, p. ej. "50 %". Vacío → "un descuento exclusivo"
  descuentoPreReserva: ""
};
