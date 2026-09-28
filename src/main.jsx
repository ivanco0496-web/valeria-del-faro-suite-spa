import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Pantalla de carga (index.html): se va con un fundido cuando el sitio ya
// arrancó y las tipografías están listas. Se muestra al menos 1,2 s para que
// se lea la bienvenida, y nunca más de 3 s.
// Conversión de Google Ads: contacto (WhatsApp o teléfono). No bloquea la
// navegación, solo avisa a Google Ads que hubo una consulta real.
document.addEventListener(
  "click",
  (event) => {
    const link = event.target.closest(
      'a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href^="tel:"]',
    );
    if (link && typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: "AW-16818265351/BDiMCOjg2YkdEIe6ydM-",
      });
    }
  },
  true,
);

const carga = document.getElementById("carga");

if (carga) {
  const MINIMO = 1200;
  const MAXIMO = 3000;
  const inicio = window.__cargaInicio ?? Date.now();
  let quitada = false;

  const quitar = () => {
    if (quitada) return;
    quitada = true;
    const espera = Math.max(0, MINIMO - (Date.now() - inicio));
    window.setTimeout(() => {
      carga.classList.add("is-done");
      window.setTimeout(() => carga.remove(), 700);
    }, espera);
  };

  const fuentes = document.fonts?.ready ?? Promise.resolve();
  fuentes.then(quitar, quitar);
  window.setTimeout(quitar, MAXIMO);
}
