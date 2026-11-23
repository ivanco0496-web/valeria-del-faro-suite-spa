// Videos y fotos propios del hotel, servidos desde la misma web.
// Cada video tiene además una versión "-movil" vertical para celulares.
const videoUrls = import.meta.glob("./assets/video/*.mp4", { eager: true, query: "?url", import: "default" });
const photoUrls = import.meta.glob("./assets/photos/*.webp", { eager: true, query: "?url", import: "default" });
// Galerías de las habitaciones: "<id>.avif" es el visor a pantalla completa y
// "<id>-m.avif" la miniatura de la grilla.
const galleryUrls = import.meta.glob("./assets/gallery/*.avif", { eager: true, query: "?url", import: "default" });

export function videoSrc(name) {
  return name ? videoUrls[`./assets/video/${name}.mp4`] : undefined;
}

export function photoSrc(name) {
  return name ? photoUrls[`./assets/photos/${name}.webp`] : undefined;
}

export function galleryImage(id, variant = "l") {
  return id ? galleryUrls[`./assets/gallery/${id}${variant === "m" ? "-m" : ""}.avif`] : undefined;
}
