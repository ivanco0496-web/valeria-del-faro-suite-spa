import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { galleryMeta } from "./data/gallery.js";
import { galleryImage, photoSrc, videoSrc } from "./media.js";

// La foto o el video acompañan el movimiento del mouse, apenas, para que
// la sección se sienta viva sin marear.
export function useParallax(strength = 16) {
  const ref = useRef(null);

  const set = (x, y) => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--parallax-x", `${x}px`);
    node.style.setProperty("--parallax-y", `${y}px`);
  };

  return {
    ref,
    onMouseMove: (event) => {
      const node = ref.current;
      if (!node) return;
      const box = node.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      set((-x * strength).toFixed(1), (-y * strength).toFixed(1));
    },
    onMouseLeave: () => set(0, 0),
  };
}

// Abre cualquier foto o video en grande, con flechas y tecla Escape.
export function useGallery(items) {
  const [index, setIndex] = useState(null);

  return {
    index,
    open: (position) => setIndex(position),
    close: () => setIndex(null),
    select: (position) => setIndex(position),
    go: (step) =>
      setIndex((current) =>
        current === null ? current : (current + step + items.length) % items.length,
      ),
  };
}

const FOCUSABLE = 'button:not([disabled]), a[href], video[controls]';

function thumbOf(item) {
  return item.thumb ?? item.src ?? photoSrc(item.photo);
}

// Visor a pantalla completa: flechas, teclado, deslizar con el dedo, tira de
// miniaturas y foco atrapado adentro mientras está abierto.
export function Lightbox({ items, index, onClose, onGo, onSelect, returnFocusTo }) {
  const item = items[index];
  const dialogRef = useRef(null);
  const railRef = useRef(null);
  const swipe = useRef(null);
  const swiped = useRef(false);
  const live = useRef({ index, count: items.length });
  const actions = useRef({});
  const [direction, setDirection] = useState(0);
  const many = items.length > 1;

  live.current = { index, count: items.length };

  const go = (step) => {
    setDirection(step);
    onGo(step);
  };

  const jump = (position) => {
    const { index: current } = live.current;
    if (position === current) return;
    setDirection(position > current ? 1 : -1);
    onSelect?.(position);
  };

  actions.current = { go, jump, onClose };

  useEffect(() => {
    // Al cerrar, el foco vuelve a la foto que se abrió (Safari no enfoca los
    // botones al tocarlos, por eso quien abre puede indicar cuál fue).
    const opener = returnFocusTo?.current ?? document.activeElement;
    dialogRef.current?.focus({ preventScroll: true });
    document.body.classList.add("has-open-menu");

    const onKey = (event) => {
      const { go: next, jump: to, onClose: close } = actions.current;
      const onVideo = event.target instanceof HTMLVideoElement;

      if (event.key === "Escape") {
        close();
      } else if (event.key === "ArrowRight" && !onVideo) {
        next(1);
      } else if (event.key === "ArrowLeft" && !onVideo) {
        next(-1);
      } else if (event.key === "Home" && !onVideo) {
        to(0);
      } else if (event.key === "End" && !onVideo) {
        to(live.current.count - 1);
      } else if (event.key === "Tab" && dialogRef.current) {
        const nodes = [...dialogRef.current.querySelectorAll(FOCUSABLE)];
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && (active === first || active === dialogRef.current)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("has-open-menu");
      if (opener instanceof HTMLElement && document.contains(opener)) {
        opener.focus({ preventScroll: true });
      }
    };
  }, []);

  // La foto de al lado ya queda descargada, así que pasar de una a otra es instantáneo.
  useEffect(() => {
    [index - 1, index + 1].forEach((position) => {
      const neighbor = items[(position + items.length) % items.length];
      if (neighbor?.src && neighbor !== items[index]) {
        const preload = new Image();
        preload.src = neighbor.src;
      }
    });
  }, [index, items]);

  // La miniatura de la foto abierta queda siempre a la vista en la tira.
  useEffect(() => {
    railRef.current
      ?.querySelector(".is-active")
      ?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [index]);

  if (!item) return null;

  const videoUrl = item.videoUrl ?? videoSrc(item.video);
  const poster = item.poster ?? photoSrc(item.photo);

  const onPointerDown = (event) => {
    if (event.target.closest("video, button, a")) {
      swipe.current = null;
      return;
    }
    swipe.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const sideways = Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3;
    const down = dy > 110 && Math.abs(dy) > Math.abs(dx) * 1.3;

    if (sideways && many) go(dx < 0 ? 1 : -1);
    else if (down) onClose();

    if (sideways || down) {
      swiped.current = true;
      window.setTimeout(() => {
        swiped.current = false;
      }, 0);
    }
  };

  const onBackdropClick = (event) => {
    if (swiped.current) return;
    if (event.target.closest("button, video, img, figcaption, .lightbox__rail")) return;
    onClose();
  };

  const figureClass = [
    "lightbox__figure",
    direction > 0 ? "is-next" : "",
    direction < 0 ? "is-prev" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.caption ?? "Galería"}
      tabIndex={-1}
      ref={dialogRef}
      onClick={onBackdropClick}
    >
      <div className="lightbox__bar">
        <span className="lightbox__count" aria-live="polite">
          {many ? `${index + 1} / ${items.length}` : ""}
        </span>
        <button className="lightbox__close" type="button" onClick={onClose} aria-label="Cerrar">
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <div
        className="lightbox__stage"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          swipe.current = null;
        }}
      >
        {many && (
          <button
            className="lightbox__nav lightbox__nav--prev"
            type="button"
            aria-label="Anterior"
            onClick={() => go(-1)}
          >
            <span aria-hidden="true">‹</span>
          </button>
        )}
        <figure className={figureClass} key={index}>
          <div className="lightbox__media">
            {videoUrl ? (
              <video
                key={videoUrl}
                src={videoUrl}
                poster={poster}
                controls
                autoPlay
                muted={item.muted ?? false}
                loop={item.loop ?? true}
                playsInline
              />
            ) : (
              <img
                src={item.src}
                alt={item.alt ?? item.caption ?? ""}
                decoding="async"
                draggable={false}
              />
            )}
          </div>
          <figcaption>
            <strong>{item.caption}</strong>
            {item.text && <span>{item.text}</span>}
          </figcaption>
        </figure>
        {many && (
          <button
            className="lightbox__nav lightbox__nav--next"
            type="button"
            aria-label="Siguiente"
            onClick={() => go(1)}
          >
            <span aria-hidden="true">›</span>
          </button>
        )}
      </div>

      {many ? (
        <div className="lightbox__rail" ref={railRef} role="group" aria-label="Todas las fotos">
          {items.map((entry, position) => (
            <button
              key={entry.id ?? entry.src ?? position}
              type="button"
              className={position === index ? "is-active" : undefined}
              aria-label={`Ir a: ${entry.caption ?? `foto ${position + 1}`}`}
              aria-current={position === index ? "true" : undefined}
              onClick={() => jump(position)}
            >
              <img src={thumbOf(entry)} alt="" loading="lazy" decoding="async" />
              {(entry.videoUrl || entry.video) && (
                <span className="lightbox__rail-play" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5.5v13l11-6.5z" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="lightbox__rail-spacer" aria-hidden="true" />
      )}
    </div>
  );
}

// Tamaños aproximados de cada mosaico en pantalla, para que el navegador elija
// la miniatura o la foto grande según el ancho y la densidad de la pantalla.
const SIZES = {
  tall: "(min-width: 1220px) 290px, (min-width: 700px) 24vw, (min-width: 560px) 31vw, 47vw",
  big: "(min-width: 1220px) 590px, (min-width: 700px) 49vw, (min-width: 560px) 64vw, 96vw",
};

// Convierte cada renglón de room.gallery en lo que necesitan el mosaico y el
// visor. Las fotos nuevas viven en assets/gallery (con medidas en galleryMeta);
// las más viejas, en assets/photos.
function buildItems(room) {
  return (room.gallery ?? [])
    .map((entry) => {
      const meta = entry.id ? galleryMeta[entry.id] : undefined;
      const src = entry.id ? galleryImage(entry.id, "l") : photoSrc(entry.name);
      if (!src) return null;
      const thumb = entry.id ? (galleryImage(entry.id, "m") ?? src) : src;
      const isVideo = Boolean(entry.video);

      return {
        ...entry,
        src,
        thumb,
        srcSet: meta ? `${thumb} ${meta.mw}w, ${src} ${meta.lw}w` : undefined,
        lq: meta?.lq,
        alt: `${room.name}: ${entry.caption}`,
        videoUrl: isVideo ? videoSrc(entry.video) : undefined,
        poster: isVideo ? src : undefined,
        // Los recorridos no tienen audio: arrancan solos y no se repiten.
        muted: isVideo ? true : undefined,
        loop: isVideo ? false : undefined,
      };
    })
    .filter(Boolean);
}

function GalleryTile({ entry, position, onOpen }) {
  const parallax = useParallax(10);
  const imageRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const isVideo = Boolean(entry.videoUrl);
  const size = entry.size ?? "tall";

  // Si la foto ya estaba en caché, el evento de carga pasó antes de engancharlo.
  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth) setLoaded(true);
  }, []);

  return (
    <li
      className={`rg-item is-${size}`}
      data-reveal
      style={{ "--i": position }}
    >
      <button
        className={loaded ? "rg-tile is-loaded" : "rg-tile"}
        type="button"
        onClick={(event) => onOpen(event.currentTarget)}
        aria-label={
          isVideo
            ? `Ver ${entry.caption.toLowerCase()}: ${entry.text}`
            : `Ver en grande: ${entry.caption}`
        }
        style={{
          "--focus": `${entry.focus ?? 55}%`,
          backgroundImage: entry.lq ? `url("${entry.lq}")` : undefined,
        }}
        ref={parallax.ref}
        onMouseMove={parallax.onMouseMove}
        onMouseLeave={parallax.onMouseLeave}
      >
        <img
          ref={imageRef}
          src={entry.thumb}
          srcSet={entry.srcSet}
          sizes={size === "tall" ? SIZES.tall : SIZES.big}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        />
        {isVideo && (
          <span className="rg-tile__play" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </span>
        )}
        {isVideo ? (
          <span className="rg-tile__tag">
            {entry.caption}
            {entry.duration && <b> · {entry.duration}</b>}
          </span>
        ) : (
          <span className="rg-tile__caption">{entry.caption}</span>
        )}
        <span className="rg-tile__zoom" aria-hidden="true">
          ⤢
        </span>
      </button>
    </li>
  );
}

// Galería de una habitación: mosaico de fotos (y recorridos en video) que se
// abre en un visor a pantalla completa.
export function RoomGallery({ room }) {
  const headingId = useId();
  const openerRef = useRef(null);
  const items = buildItems(room);
  const gallery = useGallery(items);

  if (!items.length) return null;

  const videos = items.filter((item) => item.videoUrl).length;
  const photos = items.length - videos;
  const counts = [`${photos} ${photos === 1 ? "foto" : "fotos"}`];
  if (videos) counts.push(`${videos} ${videos === 1 ? "recorrido en video" : "recorridos en video"}`);

  return (
    <section className="section room-gallery" aria-labelledby={headingId}>
      <div className="section-heading" data-reveal>
        <div>
          <p className="overline">Galería de fotos</p>
          <h2 id={headingId}>
            {room.slug === "presidencial" ? "Mirá la suite por dentro." : "Mirá la habitación por dentro."}
          </h2>
          <p>{counts.join(" y ")}. Tocá una para verla en grande y deslizá para ver las demás.</p>
        </div>
      </div>
      <ul className="rg-grid">
        {items.map((entry, position) => (
          <GalleryTile
            key={entry.id ?? entry.name}
            entry={entry}
            position={position}
            onOpen={(element) => {
              openerRef.current = element;
              gallery.open(position);
            }}
          />
        ))}
      </ul>
      {gallery.index !== null &&
        createPortal(
          <Lightbox
            items={items}
            index={gallery.index}
            onClose={gallery.close}
            onGo={gallery.go}
            onSelect={gallery.select}
            returnFocusTo={openerRef}
          />,
          document.body,
        )}
    </section>
  );
}
