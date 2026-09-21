import { useEffect, useRef, useState } from "react";
import { hotel } from "./data/hotel.js";
import { ContactCards, ReservationForm, ReservationSteps } from "./ContactForm.jsx";
import logo from "./assets/hotel/valeria-del-faro-logo-transparent.webp";
import heroPoolGlass from "./assets/hotel/hero-pool-glass.avif";
import oceanView from "./assets/hotel/ocean-view.avif";
import roomMatrimonial from "./assets/hotel/room-matrimonial.avif";
import roomDoble from "./assets/hotel/room-doble.avif";
import suitePresidencial from "./assets/hotel/suite-presidencial.avif";
import suiteDetail from "./assets/hotel/suite-detail.avif";
import spaHydromassage from "./assets/hotel/spa-hydromassage.avif";
import spaSauna from "./assets/hotel/spa-sauna.avif";
import poolExterior from "./assets/hotel/spa-detail.avif";
import breakfast from "./assets/hotel/breakfast.avif";
import breakfastDetail from "./assets/hotel/breakfast-detail.avif";
import activitiesBeach from "./assets/hotel/activities-beach.avif";
import poolHydromassage from "./assets/hotel/pool-hydromassage.avif";
import poolCold from "./assets/hotel/pool-cold.avif";
import hotelEntryWide from "./assets/hotel/hotel-entry-wide.avif";
import activityCabalgatas from "./assets/activities/cabalgatas.webp";
import activityFaroQuerandi from "./assets/activities/faro-querandi.webp";
import activityCuatriciclos from "./assets/activities/cuatriciclos.webp";
import activityBicicletas from "./assets/activities/bicicletas.webp";
import activityTirolesa from "./assets/activities/tirolesa.webp";
import activityCineTeatro from "./assets/activities/cine-teatro.webp";

// Videos y fotos propios del hotel, cortados de las filmaciones originales.
// Cada video tiene además una versión "-movil" vertical para celulares.
const videoUrls = import.meta.glob("./assets/video/*.mp4", { eager: true, query: "?url", import: "default" });
const photoUrls = import.meta.glob("./assets/photos/*.webp", { eager: true, query: "?url", import: "default" });

function videoSrc(name) {
  return name ? videoUrls[`./assets/video/${name}.mp4`] : undefined;
}

function photoSrc(name) {
  return name ? photoUrls[`./assets/photos/${name}.webp`] : undefined;
}

// Illustrative photos for the generic-area activities listed by the hotel
// (not hotel-owned experiences), sourced from Wikimedia Commons (Faro
// Querandí, CC BY-SA 4.0) and Pexels (free license), matched 1:1 to
// hotel.activities by index.
const activityImages = [
  activityCabalgatas,
  activityFaroQuerandi,
  activityCuatriciclos,
  activityBicicletas,
  activityTirolesa,
  activityCineTeatro,
];

// Real Valeria del Mar walking-tour footage (geotagged, verified on-location)
// for the one activity where authentic local video was findable; the rest
// stay as photos since no genuine local footage of them was available.
const activityVideoIds = {
  3: "evIjHbiFzbo", // Bicicletas y caminatas — real Valeria del Mar 4K walking tour
};

// Note: room-matrimonial-wide.avif, hotel-exterior-wide.avif, contact-wide.avif
// and activities-coast.avif are real Valeria del Faro photos (verified against
// the site backup by hash) but are lifestyle/stock-style shots used elsewhere
// on the live site, not photos of this property, so they're kept but unused here.

const images = {
  hero: poolExterior,
  // Reemplazos con fotos propias sacadas de las filmaciones del hotel.
  get fachada() { return photoSrc("hotel-fachada") ?? poolExterior; },
  get lobby() { return photoSrc("hotel-lobby") ?? hotelEntryWide; },
  get desayunoReal() { return photoSrc("hotel-desayuno") ?? breakfast; },
  // Pileta exterior con agua: la toma filmada de la cubierta está vacía.
  get piscinaReal() { return poolExterior; },
  get habitacion() { return photoSrc("matrimonial-ambiente") ?? roomMatrimonial; },
  heroPoolGlass,
  coast: oceanView,
  strip: activitiesBeach,
  spa: spaHydromassage,
  spaSauna,
  suite: suitePresidencial,
  suiteDetail,
  roomMatrimonial,
  roomDoble,
  breakfast,
  breakfastDetail,
  activitiesBeach,
  pool: poolHydromassage,
  poolExterior,
  poolHydromassage,
  poolCold,
  contact: hotelEntryWide,
  hotelEntry: hotelEntryWide,
  hotelExterior: poolExterior,
};

// Matched 1:1 to hotel.pools by index.
const poolImages = [poolHydromassage, poolCold, poolExterior];


// Piletas con agua y saunas, tomadas del sitio del hotel
// (valeriadelfarosuiteyspa.com), donde las publica la dueña. Las filmamos en
// mayo con la pileta cubierta vacía, por eso no usamos esas tomas.
function spaPhotos() {
  return [
    { name: "spa-galeria-vidrio", caption: "Piscina climatizada y jacuzzi, bajo la galería de vidrio" },
    { name: "spa-piscina-exterior", caption: "La piscina exterior templada, abierta en temporada alta" },
    { name: "spa-saunas", caption: "Sauna seco y sauna húmedo" },
  ]
    .map((photo) => ({
      src: photoSrc(photo.name),
      alt: `Spa de Valeria del Faro: ${photo.caption}`,
      caption: photo.caption,
    }))
    .filter((photo) => photo.src);
}

// Recorrido del hotel filmado en el lugar, para la página del hotel.
const hotelClips = [
  { label: "La fachada", text: "El edificio sobre la calle Corbeta Cefiro.", video: "hotel-fachada", photo: "hotel-cartel" },
  { label: "Lobby", text: "Recepción atendida por los dueños.", video: "hotel-lobby", photo: "hotel-lobby" },
  { label: "Salón del desayuno", text: "Planta Baja, de 08:30 a 10:30 hs.", video: "hotel-desayuno", photo: "hotel-desayuno" },
];

const navItems = [
  { label: "Hotel", to: "/hotel" },
  { label: "Habitaciones", to: "/servicios/habitaciones" },
  { label: "Spa", to: "/servicios/spa" },
  { label: "Servicios", to: "/servicios" },
  { label: "Actividades", to: "/actividades" },
  { label: "Ubicación", to: "/ubicacion" },
  { label: "Contacto", to: "/contacto" },
];

const serviceRoutes = [
  {
    title: "Habitaciones",
    meta: "17 habitaciones, suite incluida",
    to: "/servicios/habitaciones",
    image: images.habitacion,
    description:
      "Matrimoniales, dobles y Suite Presidencial con equipamiento pensado para descansar.",
  },
  {
    title: "Spa",
    meta: "Hidromasaje · saunas · masajes",
    to: "/servicios/spa",
    image: images.spa,
    description:
      "Circuito de bienestar con piscinas, saunas, vestuarios y masajes con reserva previa.",
  },
  {
    title: "Desayuno",
    meta: "08:30 a 10:30 hs",
    to: "/servicios/desayuno",
    image: images.desayunoReal,
    description:
      "Desayuno servido en Planta Baja con productos clásicos para empezar el día sin apuro.",
  },
  {
    title: "Piscina",
    meta: "Hidromasaje · agua fría · temporada",
    to: "/servicios/piscina",
    image: images.piscinaReal,
    description:
      "Una sola piscina exterior templada, abierta en temporada alta. Todo el año: hidromasaje y agua fría cubiertas.",
  },
];

const routeTitles = {
  "/": hotel.fullName,
  "/hotel": "Hotel",
  "/servicios": "Servicios",
  "/servicios/habitaciones": "Habitaciones",
  "/servicios/spa": "Spa",
  "/servicios/desayuno": "Desayuno",
  "/servicios/piscina": "Piscina",
  "/ubicacion": "Ubicación",
  "/actividades": "Actividades",
  "/contacto": "Contacto",
  ...Object.fromEntries(hotel.rooms.map((room) => [room.path, room.name])),
};

const roomByPath = Object.fromEntries(
  hotel.rooms.map((room) => [room.path, room]),
);

function normalizePath(pathname) {
  const cleanPath = pathname.replace(/\/+$/, "");
  return cleanPath || "/";
}

function isExternalPath(to) {
  return /^(https?:|mailto:|tel:)/.test(to);
}

function roomImage(room) {
  const own = photoSrc(room.photos?.[0]?.name);
  if (own) return own;
  if (room.slug === "presidencial") return images.suite;
  if (room.slug === "doble") return images.roomDoble;
  return images.roomMatrimonial;
}

// Fotos sacadas de las mismas filmaciones del hotel, una por ambiente.
function roomPhotos(room) {
  const own = (room.photos ?? [])
    .map((photo) => ({
      src: photoSrc(photo.name),
      alt: `${room.name}: ${photo.caption}`,
      caption: photo.caption,
    }))
    .filter((photo) => photo.src);

  if (own.length) return own;

  if (room.slug === "presidencial") {
    return [
      { src: images.suite, alt: "Suite Presidencial", caption: "Suite Presidencial" },
      { src: images.suiteDetail, alt: "Detalle de la Suite Presidencial", caption: "Detalle" },
    ];
  }
  if (room.slug === "doble") {
    return [{ src: images.roomDoble, alt: "Habitación doble", caption: "Habitación doble" }];
  }
  return [
    { src: images.roomMatrimonial, alt: "Habitación matrimonial", caption: "Habitación matrimonial" },
  ];
}

function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setPath(normalizePath(window.location.pathname));
      setMenuOpen(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const pageName = routeTitles[path];
    document.title =
      !pageName || pageName === hotel.fullName
        ? hotel.fullName
        : `${pageName} | ${hotel.fullName}`;
  }, [path]);

  useEffect(() => {
    document.body.classList.toggle("has-open-menu", menuOpen);
    return () => document.body.classList.remove("has-open-menu");
  }, [menuOpen]);

  useEffect(() => {
    const revealElements = document.querySelectorAll("[data-reveal]");

    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -10px 0px" },
    );

    revealElements.forEach((element) => observer.observe(element));

    const revealAll = () => {
      revealElements.forEach((element) => element.classList.add("is-visible"));
      observer.disconnect();
    };
    const safetyTimer = window.setTimeout(revealAll, 2500);

    return () => {
      window.clearTimeout(safetyTimer);
      observer.disconnect();
    };
  }, [path]);

  const navigate = (event, to) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      isExternalPath(to)
    ) {
      return;
    }

    event.preventDefault();

    if (to !== path) {
      window.history.pushState({}, "", to);
      setPath(to);
    }

    setMenuOpen(false);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  function SiteLink({ to, onClick, children, ...props }) {
    const handleClick = (event) => {
      onClick?.(event);

      if (!event.defaultPrevented) {
        navigate(event, to);
      }
    };

    return (
      <a href={to} onClick={handleClick} {...props}>
        {children}
      </a>
    );
  }

  return (
    <div className={menuOpen ? "site-shell nav-open" : "site-shell"}>
      <Header
        Link={SiteLink}
        activePath={path}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <main className="site-main" key={path}>
        {renderPage(path, SiteLink)}
      </main>
      <Footer Link={SiteLink} />
      <WhatsAppButton />
      <MobileBookingBar Link={SiteLink} />
    </div>
  );
}

// Fixed bottom bar on phones only (hidden by CSS on wider screens); it
// replaces the floating WhatsApp button on mobile.
function MobileBookingBar({ Link }) {
  return (
    <div className="mobile-booking-bar">
      <a href={hotel.whatsappHref} target="_blank" rel="noreferrer">
        WhatsApp
      </a>
      <Link to="/contacto">Reservar</Link>
    </div>
  );
}

function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href={hotel.whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Escribir por WhatsApp"
    >
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16.01 3C9.38 3 4 8.38 4 15.01c0 2.35.65 4.55 1.78 6.44L4 29l7.73-1.75a11.94 11.94 0 0 0 4.28.79h.01c6.63 0 12-5.38 12-12.01C28.02 8.38 22.64 3 16.01 3Zm0 21.85h-.01a9.86 9.86 0 0 1-5.02-1.37l-.36-.21-4.58 1.04 1.06-4.47-.24-.37a9.84 9.84 0 0 1-1.51-5.26c0-5.44 4.44-9.87 9.87-9.87 2.64 0 5.11 1.03 6.98 2.9a9.8 9.8 0 0 1 2.89 6.98c0 5.44-4.43 9.63-9.08 9.63Zm5.41-7.39c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.91-2.19-.24-.58-.48-.5-.66-.5h-.56c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.87 1.21 3.07c.15.2 2.09 3.2 5.07 4.48.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.12-.27-.2-.57-.35Z"
        />
      </svg>
    </a>
  );
}

function renderPage(path, Link) {
  if (path === "/") return <HomePage Link={Link} />;
  if (path === "/hotel") return <HotelPage Link={Link} />;
  if (path === "/servicios") return <ServicesPage Link={Link} />;
  if (path === "/servicios/habitaciones") return <RoomsPage Link={Link} />;
  if (roomByPath[path]) return <RoomPage Link={Link} room={roomByPath[path]} />;
  if (path === "/servicios/spa") return <SpaPage Link={Link} />;
  if (path === "/servicios/desayuno") return <BreakfastPage Link={Link} />;
  if (path === "/servicios/piscina") return <PoolPage Link={Link} />;
  if (path === "/ubicacion") return <LocationPage Link={Link} />;
  if (path === "/actividades") return <ActivitiesPage Link={Link} />;
  if (path === "/contacto") return <ContactPage Link={Link} />;

  return <NotFoundPage Link={Link} />;
}

function Header({ Link, activePath, menuOpen, setMenuOpen }) {
  const isActive = (to) =>
    to === "/" ? activePath === "/" : activePath === to || activePath.startsWith(`${to}/`);

  return (
    <header className="site-header" aria-label="Navegación principal">
      <Link className="brand-mark" to="/" onClick={() => setMenuOpen(false)}>
        <img className="brand-logo" src={logo} alt={hotel.fullName} />
      </Link>

      <nav
        id="primary-navigation"
        className={menuOpen ? "site-nav is-open" : "site-nav"}
      >
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={isActive(item.to) ? "is-active" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="header-actions">
        <a className="header-phone" href={hotel.phoneHref}>
          Llamar
        </a>
        <Link className="header-cta" to="/contacto">
          Reservar
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Cerrar navegación" : "Abrir navegación"}
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

// Los celulares reciben la versión vertical del video, filmada o recortada
// en 9:16, para que no se vea un recorte del centro de una toma horizontal.
function useIsPhone() {
  const query = "(max-width: 719px)";
  const [isPhone, setIsPhone] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = (event) => setIsPhone(event.matches);
    media.addEventListener("change", update);
    setIsPhone(media.matches);
    return () => media.removeEventListener("change", update);
  }, []);

  return isPhone;
}

// Video propio del hotel, servido desde la misma web: sin YouTube, sin
// logos encima y sin pedirle nada a otro sitio.
function LocalVideo({ name, poster, fit = "cover", onStart }) {
  const isPhone = useIsPhone();
  const [isPlaying, setIsPlaying] = useState(false);
  const mobile = videoSrc(`${name}-movil`);
  const src = isPhone && mobile ? mobile : videoSrc(name);

  if (!src) return null;

  return (
    <video
      key={src}
      className={isPlaying ? "local-video is-visible" : "local-video"}
      style={{ objectFit: fit }}
      src={src}
      poster={photoSrc(poster)}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      tabIndex={-1}
      aria-hidden="true"
      onPlaying={() => {
        setIsPlaying(true);
        onStart?.();
      }}
    />
  );
}

// Muted looping YouTube background. With `segments` ([[start, end], ...] in
// seconds) it plays only those fragments in order, fading out briefly on
// each cut, instead of the whole video.
const CUT_FADE_MS = 350;
const SEEK_TOLERANCE = 2;

function HeroVideoBackground({ videoId, variant = "hero", segments, portrait = false, onStart }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCutting, setIsCutting] = useState(false);
  const frameRef = useRef(null);
  const segmentsRef = useRef(segments);
  const onStartRef = useRef(onStart);
  onStartRef.current = onStart;
  const segmentIndexRef = useRef(0);
  const seekingRef = useRef(false);
  const baseClass =
    variant === "card"
      ? "card-video-frame"
      : variant === "fill"
        ? portrait
          ? "fill-video-frame fill-video-frame--portrait"
          : "fill-video-frame"
        : "hero-video-frame";

  useEffect(() => {
    let cutTimer;
    let safetyTimer;

    const send = (func, args = []) => {
      frameRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "https://www.youtube-nocookie.com",
      );
    };

    const cutTo = (index) => {
      seekingRef.current = true;
      segmentIndexRef.current = index;
      setIsCutting(true);
      window.clearTimeout(cutTimer);
      window.clearTimeout(safetyTimer);
      cutTimer = window.setTimeout(() => {
        send("seekTo", [segmentsRef.current[index][0], true]);
        send("playVideo");
      }, CUT_FADE_MS);
      // Never leave the video hidden if the player doesn't report back.
      safetyTimer = window.setTimeout(() => {
        seekingRef.current = false;
        setIsCutting(false);
      }, 3000);
    };

    const handleMessage = (event) => {
      // Several players can share a page: only listen to this one.
      if (event.source !== frameRef.current?.contentWindow) return;
      let data;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }
      if (data.event !== "infoDelivery" || !data.info) return;
      if (data.info.playerState === 1) {
        setIsPlaying(true);
        onStartRef.current?.();
      }

      const clips = segmentsRef.current;
      if (!clips?.length) return;

      if (data.info.playerState === 0 && !seekingRef.current) {
        cutTo(0);
        return;
      }

      const time = data.info.currentTime;
      if (typeof time !== "number") return;
      const [start, end] = clips[segmentIndexRef.current];

      // YouTube seeks to the nearest keyframe, which can land a little
      // before the requested second, hence the tolerance.
      if (seekingRef.current) {
        if (time >= start - SEEK_TOLERANCE && time < end) {
          seekingRef.current = false;
          setIsCutting(false);
        }
        return;
      }

      if (time < start - SEEK_TOLERANCE) {
        cutTo(segmentIndexRef.current);
      } else if (time >= end - CUT_FADE_MS / 1000) {
        cutTo((segmentIndexRef.current + 1) % clips.length);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.clearTimeout(cutTimer);
      window.clearTimeout(safetyTimer);
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleLoad = () => {
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "listening", id: videoId, channel: "widget" }),
      "https://www.youtube-nocookie.com",
    );
  };

  const playback = segments?.length
    ? `start=${segments[0][0]}`
    : `loop=1&playlist=${videoId}`;
  const className = [baseClass, isPlaying && !isCutting ? "is-visible" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <iframe
      ref={frameRef}
      className={className}
      src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&${playback}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&enablejsapi=1`}
      title=""
      tabIndex={-1}
      allow="autoplay; encrypted-media"
      onLoad={handleLoad}
    />
  );
}

// Placa con el logo del hotel que tapa la tarjeta hasta que el video
// arranca: evita el botón de pausa de YouTube y las miniaturas repetidas.
function BrandPoster({ hidden = false }) {
  return (
    <div className={hidden ? "brand-poster is-hidden" : "brand-poster"} aria-hidden="true">
      <img src={logo} alt="" loading="lazy" decoding="async" />
    </div>
  );
}

// A short looping video fragment with a caption. The player is only
// created once the card nears the viewport, so pages with many fragments
// don't load every video up front.
// Abre cualquier foto o video en grande, con flechas y tecla Escape.
function useGallery(items) {
  const [index, setIndex] = useState(null);

  return {
    index,
    open: (position) => setIndex(position),
    close: () => setIndex(null),
    go: (step) =>
      setIndex((current) =>
        current === null ? current : (current + step + items.length) % items.length,
      ),
  };
}

function Lightbox({ items, index, onClose, onGo }) {
  const item = items[index];

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onGo(1);
      if (event.key === "ArrowLeft") onGo(-1);
    };

    document.addEventListener("keydown", onKey);
    document.body.classList.add("has-open-menu");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("has-open-menu");
    };
  }, [onClose, onGo]);

  if (!item) return null;

  const many = items.length > 1;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.caption ?? "Galería"}
      onClick={onClose}
    >
      <button className="lightbox__close" type="button" onClick={onClose} aria-label="Cerrar">
        <span aria-hidden="true">×</span>
      </button>
      {many && (
        <button
          className="lightbox__nav lightbox__nav--prev"
          type="button"
          aria-label="Anterior"
          onClick={(event) => {
            event.stopPropagation();
            onGo(-1);
          }}
        >
          <span aria-hidden="true">‹</span>
        </button>
      )}
      <figure className="lightbox__figure" onClick={(event) => event.stopPropagation()}>
        {item.video ? (
          <video
            key={item.video}
            src={videoSrc(item.video)}
            poster={photoSrc(item.photo)}
            controls
            autoPlay
            loop
            playsInline
          />
        ) : (
          <img src={item.src} alt={item.alt ?? item.caption ?? ""} />
        )}
        <figcaption>
          <strong>{item.caption}</strong>
          {item.text && <span>{item.text}</span>}
          {many && (
            <small>
              {index + 1} de {items.length}
            </small>
          )}
        </figcaption>
      </figure>
      {many && (
        <button
          className="lightbox__nav lightbox__nav--next"
          type="button"
          aria-label="Siguiente"
          onClick={(event) => {
            event.stopPropagation();
            onGo(1);
          }}
        >
          <span aria-hidden="true">›</span>
        </button>
      )}
    </div>
  );
}

function VideoMoment({ videoId, moment, portrait = false, compact = false, onOpen }) {
  const isLocal = Boolean(moment.video);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const [started, setStarted] = useState(false);
  const markStarted = () => setStarted(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px" },
    );
    observer.observe(element);

    // En una pestaña en segundo plano el navegador no informa visibilidad,
    // así que a los 2,5 s se carga igual lo que ya esté cerca de pantalla.
    const safety = window.setTimeout(() => {
      const box = element.getBoundingClientRect();
      if (box.top < window.innerHeight + 600 && box.bottom > -600) {
        setInView(true);
        observer.disconnect();
      }
    }, 2500);

    return () => {
      window.clearTimeout(safety);
      observer.disconnect();
    };
  }, []);

  const className = [
    "video-moment",
    portrait || moment.portrait ? "video-moment--portrait" : "",
    compact ? "video-moment--compact" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={className} ref={ref}>
      {onOpen && (
        <button
          className="video-moment__open"
          type="button"
          onClick={onOpen}
          aria-label={`Ver ${moment.label} en grande`}
        >
          <span aria-hidden="true">⤢</span>
        </button>
      )}
      <div className="video-moment__media hero-media--video" aria-hidden="true">
        <BrandPoster hidden={started} />
        {isLocal
          ? inView && <LocalVideo name={moment.video} onStart={markStarted} />
          : inView && (
              <HeroVideoBackground
                videoId={videoId}
                variant="fill"
                portrait={portrait}
                segments={[[moment.start, moment.end]]}
                onStart={markStarted}
              />
            )}
      </div>
      <div className="video-moment__caption">
        <h3>{moment.label}</h3>
        {!compact && moment.text && <p>{moment.text}</p>}
      </div>
    </article>
  );
}

function VideoMomentGrid({ videoId, moments, portrait = false }) {
  const gallery = useGallery(moments);
  const openable = moments.every((moment) => moment.video);
  const items = moments.map((moment) => ({
    video: moment.video,
    photo: moment.photo,
    caption: moment.label,
    text: moment.text,
  }));

  return (
    <>
      <div className={portrait ? "video-moment-grid video-moment-grid--portrait" : "video-moment-grid"}>
        {moments.map((moment, position) => (
          <VideoMoment
            key={moment.label}
            videoId={videoId}
            moment={moment}
            portrait={portrait}
            onOpen={openable ? () => gallery.open(position) : undefined}
          />
        ))}
      </div>
      {gallery.index !== null && (
        <Lightbox items={items} index={gallery.index} onClose={gallery.close} onGo={gallery.go} />
      )}
    </>
  );
}

function HomePage({ Link }) {
  useEffect(() => {
    document.body.classList.add("is-home");
    return () => document.body.classList.remove("is-home");
  }, []);

  return (
    <>
      <section className="home-hero">
        <div className="hero-media hero-media--video" aria-hidden="true">
          <img src={images.fachada} alt="" fetchPriority="high" decoding="async" />
          <LocalVideo name="hotel-hero" />
        </div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="home-hero__inner">
          <p className="eyebrow">Valeria del Mar · Provincia de Buenos Aires</p>
          <h1>
            {hotel.name}
            <span>{hotel.descriptor}</span>
          </h1>
          <p className="hero-promise">{hotel.promise}.</p>
          <p className="hero-copy">
            Hotel familiar para descansar, relajarte y vivir la costa con una
            experiencia de spa.
          </p>
          <div className="action-row">
            <a className="button button-primary" href={hotel.whatsappHref} target="_blank" rel="noreferrer">
              Consultar disponibilidad
            </a>
            <Link className="button button-ghost" to="/servicios/habitaciones">
              Ver habitaciones
            </Link>
          </div>
        </div>
        <div className="hero-reserve-panel" data-reveal>
          <article>
            <span>Playa</span>
            <strong>30 pasos</strong>
          </article>
          <article>
            <span>Estadía</span>
            <strong>17 habitaciones</strong>
          </article>
          <article>
            <span>Bienestar</span>
            <strong>Spa & piscina</strong>
          </article>
          <article>
            <span>Conexión</span>
            <strong>Wi‑Fi en cada habitación</strong>
          </article>
        </div>
      </section>

      <section className="section intro-section" id="experiencia">
        <SectionHeading
          index="01"
          eyebrow="Experiencia"
          title="Un lugar para bajar el ritmo."
          copy={hotel.concept}
        />
        <div className="split-layout split-layout--center">
          <div className="editorial-copy" data-reveal>
            <p>{hotel.history}</p>
            <DetailList items={hotel.valuePoints} />
          </div>
          <FactGrid />
        </div>
      </section>

      <ImageFeature
        image={photoSrc("hotel-entrada") ?? images.coast}
        video="hotel-entrada"
        index="02"
        eyebrow="La propuesta central"
        title="Del hotel al mar. Solo 30 pasos."
        copy="El hotel destaca su cercanía con la playa y el acceso por rampa."
        Link={Link}
        cta={{ label: "Descubrir ubicación", to: "/ubicacion" }}
      >
        <DetailList items={hotel.valuePoints.slice(1)} />
      </ImageFeature>

      <section className="section rooms-section">
        <SectionHeading
          index="03"
          eyebrow="Habitaciones"
          title="Descanso amplio, silencioso y pensado para volver."
          copy="Tres propuestas con 36 m² en habitaciones matrimoniales y dobles, más una Suite Presidencial con vista directa al mar."
          Link={Link}
          cta={{ label: "Ver todas", to: "/servicios/habitaciones" }}
        />
        <RoomTally Link={Link} />
        <RoomGrid Link={Link} />
      </section>

      <SuiteFeature Link={Link} />

      <SpaFeature Link={Link} />

      <BreakfastFeature Link={Link} />

      <section className="section service-preview">
        <SectionHeading
          index="06"
          eyebrow="Servicios"
          title="Lo práctico, resuelto."
          copy="Algunas comodidades de todos los días. El detalle completo está en Servicios."
          Link={Link}
          cta={{ label: "Ver todos los servicios", to: "/servicios" }}
        />
        <ComfortGrid Link={Link} only={["wifi", "parking", "safe", "tv"]} />
      </section>

      <section className="section location-ribbon" data-reveal>
        <div>
          <p className="overline">
            <span aria-hidden="true">07</span>
            Explorá la costa
          </p>
          <h2>Valeria del Mar, cerca de Cariló y Pinamar.</h2>
        </div>
        <DistanceGrid />
      </section>

      <TestimonialsSection />

      <PromotionBand />
      <BookingInfo Link={Link} />
      <FinalCta Link={Link} />
    </>
  );
}

function HotelPage({ Link }) {
  return (
    <>
      <PageHero
        Link={Link}
        image={images.fachada}
        video="hotel-hero"
        eyebrow="Hotel"
        title="Hospitalidad familiar con espíritu costero."
        copy={hotel.concept}
        crumbs={[{ label: "Inicio", to: "/" }, { label: "Hotel" }]}
      />
      <section className="section split-layout">
        <div data-reveal>
          <p className="overline">Historia</p>
          <h2>Un proyecto familiar iniciado en 2013 y completado en 2024.</h2>
        </div>
        <div className="flow-copy" data-reveal>
          <p>{hotel.history}</p>
          <DetailList items={hotel.valuePoints} />
        </div>
      </section>
      <section className="section video-moments-section">
        <SectionHeading
          eyebrow="El hotel en video"
          title="Un paseo por la casa."
          copy="Tomas propias del edificio, el lobby, el salón del desayuno y la piscina."
        />
        <VideoMomentGrid moments={hotelClips} />
      </section>
      <section className="section policy-section">
        <SectionHeading
          eyebrow="Información importante"
          title="Condiciones de hospedaje."
          copy="Información real informada por el hotel para evitar consultas innecesarias."
        />
        <PolicyGrid />
      </section>
      <section className="section split-layout">
        <div data-reveal>
          <p className="overline">Accesibilidad</p>
          <h2>Pensado para que todos los huéspedes se muevan con comodidad.</h2>
        </div>
        <div className="flow-copy" data-reveal>
          <p>
            El hotel cuenta con instalaciones pensadas para huéspedes con
            movilidad o accesibilidad reducida.
          </p>
          <DetailList items={hotel.accessibility} />
        </div>
      </section>
      <FinalCta Link={Link} compact />
    </>
  );
}

function ServicesPage({ Link }) {
  return (
    <>
      <PageHero
        Link={Link}
        image={images.lobby}
        eyebrow="Servicios"
        title="Todo lo que incluye tu estadía."
        copy="Ordenado por categorías, para encontrar rápido lo que buscás."
        crumbs={[{ label: "Inicio", to: "/" }, { label: "Servicios" }]}
      />
      <section className="section service-highlights-section">
        <SectionHeading eyebrow="Lo más valorado" title="Cuatro cosas que marcan la diferencia." />
        <div className="service-highlights">
          {serviceHighlights.map((item) => (
            <article key={item.title} data-reveal>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {comfortIcons[item.icon]}
              </svg>
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </article>
          ))}
        </div>
      </section>
      <section className="section service-guide-section">
        <SectionHeading eyebrow="Guía de servicios" title="Qué vas a encontrar en el hotel." />
        <div className="service-guide">
          {serviceGuide.map((group) => (
            <article key={group.title} className="service-guide__group" data-reveal>
              <header>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  {comfortIcons[group.icon]}
                </svg>
                <h3>{group.title}</h3>
              </header>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {group.to && (
                <Link className="text-link" to={group.to}>
                  {group.cta}
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>
      <section className="section service-preview">
        <SectionHeading eyebrow="En fotos" title="Conocé cada espacio." />
        <ServiceRouteGrid Link={Link} />
      </section>
    </>
  );
}

function RoomsPage({ Link }) {
  return (
    <>
      <PageHero
        Link={Link}
        image={images.roomMatrimonial}
        eyebrow="Habitaciones"
        title="16 habitaciones y la Suite Presidencial: 17 en total."
        copy="Matrimoniales, dobles y Suite Presidencial, con superficies amplias y equipamiento real informado por el hotel."
        crumbs={[
          { label: "Inicio", to: "/" },
          { label: "Servicios", to: "/servicios" },
          { label: "Habitaciones" },
        ]}
      />
      <section className="section rooms-section">
        <RoomTally Link={Link} />
        <RoomGrid Link={Link} />
      </section>
      <HouseRules />
      <ImageFeature
        image={images.suiteDetail}
        eyebrow="Suite Presidencial"
        title="Vista directa al mar desde el 4.º piso."
        copy="Acceso privado mediante ascensor, cama sommier King, sofá cama con carrito, área de estar con dos sillones, vestidor y ducha escocesa."
        Link={Link}
        cta={{ label: "Ver Suite Presidencial", to: "/servicios/habitaciones/presidencial" }}
      />
    </>
  );
}

function RoomPage({ Link, room }) {
  return (
    <>
      <PageHero
        Link={Link}
        image={roomImage(room)}
        video={room.heroVideo}
        eyebrow={room.count}
        title={room.name}
        copy={room.meta}
        crumbs={[
          { label: "Inicio", to: "/" },
          { label: "Habitaciones", to: "/servicios/habitaciones" },
          { label: room.name },
        ]}
      />
      <section className="section detail-layout">
        <div className="detail-copy" data-reveal>
          <p className="overline">Detalle</p>
          <h2>{room.description}</h2>
          {room.note && (
            <p>
              {room.note}
              {room.slug === "doble" && hotel.accessibleRoomYoutubeId && (
                <>
                  {" "}
                  <a
                    className="text-link"
                    href={`https://www.youtube.com/watch?v=${hotel.accessibleRoomYoutubeId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver video
                  </a>
                </>
              )}
            </p>
          )}
          <div className="action-row">
            <a className="button button-primary" href={hotel.whatsappHref} target="_blank" rel="noreferrer">
              Consultar disponibilidad
            </a>
            <Link className="button button-outline" to="/servicios/habitaciones">
              Ver habitaciones
            </Link>
          </div>
        </div>
        <aside className="detail-panel" data-reveal>
          <h3>Características</h3>
          <p className="detail-panel__capacity">
            <span>Capacidad máxima</span>
            <strong>{room.capacity}</strong>
          </p>
          <p className="detail-panel__wifi">
            <strong>{hotel.wifi.title}</strong>
            <span>{hotel.wifi.text}</span>
          </p>
          <SeaViewBadge note={room.seaView} />
          <DetailList items={room.details} />
        </aside>
      </section>
      {room.clips && (
        <section className="section video-moments-section">
          <SectionHeading
            eyebrow="Recorrido en video"
            title={`Cada rincón de la ${room.slug === "presidencial" ? "suite" : "habitación"}.`}
            copy="Fragmentos filmados en el hotel, sin cortes ni música."
          />
          <VideoMomentGrid moments={room.clips} />
        </section>
      )}
      <PhotoGallery title="Fotos" photos={roomPhotos(room)} />
      <HouseRules room={room} />
      <OtherRooms Link={Link} current={room} />
    </>
  );
}

// Las tres condiciones firmes del hotel, repetidas donde se decide la
// reserva: inicio, habitaciones y contacto.
function HouseRules({ room }) {
  const firm = hotel.policies.filter((policy) => policy.firm);

  return (
    <section className="section house-rules" data-reveal>
      <div className="house-rules__intro">
        <p className="overline">Reglas de la casa</p>
        <h2>Tres condiciones que no se negocian.</h2>
        {room && (
          <p className="house-rules__capacity">
            <span>Capacidad de esta habitación</span>
            <strong>{room.capacity}</strong>
          </p>
        )}
      </div>
      <ul className="house-rules__list">
        {firm.map((policy) => (
          <li key={policy.title}>
            <strong>{policy.title}</strong>
            <span>{policy.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PhotoGalleryItem({ photo, onOpen }) {
  const parallax = useParallax(12);

  return (
    <button
      className="photo-gallery__item is-parallax"
      type="button"
      onClick={onOpen}
      aria-label={`Ver ${photo.caption ?? "la foto"} en grande`}
      data-reveal
      ref={parallax.ref}
      onMouseMove={parallax.onMouseMove}
      onMouseLeave={parallax.onMouseLeave}
    >
      <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
      {photo.caption && <span>{photo.caption}</span>}
    </button>
  );
}

function PhotoGallery({ title, photos }) {
  const gallery = useGallery(photos);

  if (!photos.length) return null;

  return (
    <section className="section photo-gallery-section">
      <p className="overline">{title}</p>
      <div className={`photo-gallery photo-gallery--${Math.min(photos.length, 4)}`}>
        {photos.map((photo, position) => (
          <PhotoGalleryItem
            key={photo.src}
            photo={photo}
            onOpen={() => gallery.open(position)}
          />
        ))}
      </div>
      {gallery.index !== null && (
        <Lightbox items={photos} index={gallery.index} onClose={gallery.close} onGo={gallery.go} />
      )}
    </section>
  );
}

// Tabs to jump between the three room types without going back.
function OtherRooms({ Link, current }) {
  return (
    <nav className="section room-tabs" aria-label="Otras habitaciones">
      {hotel.rooms.map((room) => (
        <Link
          key={room.slug}
          to={room.path}
          className={room.slug === current.slug ? "is-active" : undefined}
          aria-current={room.slug === current.slug ? "page" : undefined}
        >
          <span>{room.count}</span>
          <strong>{room.name}</strong>
        </Link>
      ))}
    </nav>
  );
}

function SpaPage({ Link }) {
  return (
    <>
      <PageHero
        Link={Link}
        image={images.poolExterior}
        videoId={hotel.spaYoutubeId}
        videoSegments={hotel.spaVideoReel}
        eyebrow="Spa & bienestar"
        title="Tu momento de desconexión."
        copy="Hidromasaje, piscinas, saunas y masajes con reserva previa en una sección pensada para relajarse."
        crumbs={[
          { label: "Inicio", to: "/" },
          { label: "Servicios", to: "/servicios" },
          { label: "Spa" },
        ]}
      />
      <section className="section split-layout">
        <div data-reveal>
          <p className="overline">Circuito de spa</p>
          <h2>El arte de descansar.</h2>
        </div>
        <div className="flow-copy" data-reveal>
          <p>
            El circuito de spa incluye hidromasaje, piscina de agua fría,
            saunas, vestuarios y masajes con reserva previa.
          </p>
          <PillList items={hotel.spa} />
          <div className="action-row">
            <Link className="text-link" to="/servicios/piscina">
              Ver las piscinas en detalle
            </Link>
          </div>
        </div>
      </section>
      <section className="section video-moments-section">
        <SectionHeading
          eyebrow="El circuito en movimiento"
          title="Recorré el spa antes de llegar."
          copy="Fragmentos filmados en el circuito del hotel."
        />
        <VideoMomentGrid
          videoId={hotel.spaCircuitYoutubeId}
          moments={hotel.spaMoments}
          portrait
        />
      </section>
      <PhotoGallery title="Las piletas y el spa" photos={spaPhotos()} />
      <section className="section amenity-section">
        <SectionHeading
          eyebrow="Ritual guiado"
          title={`Un recorrido de ${hotel.spaRitual.duration} para desconectar.`}
          copy="Circuito revitalizante pensado en rondas, para aprovechar cada instalación en el orden correcto."
        />
        <div className="ritual-grid">
          {hotel.spaRitual.rounds.map((round) => (
            <article className="ritual-round" key={round.title} data-reveal>
              <h3>{round.title}</h3>
              <DetailList items={round.steps} />
            </article>
          ))}
        </div>
        <p className="ritual-note" data-reveal>
          {hotel.spaRitual.healthNote}
        </p>
      </section>
      <FinalCta Link={Link} compact />
    </>
  );
}

function BreakfastPage({ Link }) {
  return (
    <>
      <PageHero
        Link={Link}
        image={images.desayunoReal}
        video="hotel-desayuno"
        eyebrow="Desayuno"
        title="Empezá el día sin apuro."
        copy={`Se sirve en ${hotel.breakfast.place} de ${hotel.breakfast.time}.`}
        crumbs={[
          { label: "Inicio", to: "/" },
          { label: "Servicios", to: "/servicios" },
          { label: "Desayuno" },
        ]}
      />
      <section className="section detail-layout">
        <div className="detail-copy" data-reveal>
          <p className="overline">Horario</p>
          <h2>{hotel.breakfast.time}</h2>
          <p>El desayuno se sirve en {hotel.breakfast.place}.</p>
        </div>
        <aside className="detail-panel" data-reveal>
          <h3>Incluye</h3>
          <PillList items={hotel.breakfast.items} />
        </aside>
      </section>
      <FinalCta Link={Link} compact />
    </>
  );
}

function PoolPage({ Link }) {
  return (
    <>
      <PageHero
        Link={Link}
        image={images.heroPoolGlass}
        eyebrow="Piscina"
        title="Tres piletas, tres momentos distintos."
        copy="Hidromasaje climatizado y agua fría, cubiertas y todo el año. Y una sola piscina exterior templada, que abre en temporada alta."
        crumbs={[
          { label: "Inicio", to: "/" },
          { label: "Servicios", to: "/servicios" },
          { label: "Piscina" },
        ]}
      />
      <section className="section rooms-section">
        <SectionHeading
          eyebrow="Piscinas"
          title="Cada pileta, con su propio lugar en el circuito."
        />
        <p className="pool-notice" data-reveal>
          <strong>Piscina exterior: hay una sola.</strong> Es de agua templada y
          abre únicamente en temporada alta de verano. El resto del año podés
          disfrutar del hidromasaje climatizado y la piscina de agua fría,
          ambas cubiertas.
        </p>
        <div className="room-grid">
          {hotel.pools.map((pool, index) => (
            <article className="room-card" key={pool.name} data-reveal>
              <div className="room-card__media">
                <img src={poolImages[index]} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="room-card__body">
                <span>{pool.meta}</span>
                <h3>{pool.name}</h3>
                <p>{pool.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <FinalCta Link={Link} compact />
    </>
  );
}

function LocationPage({ Link }) {
  return (
    <>
      <PageHero
        Link={Link}
        image={images.coast}
        eyebrow="Ubicación"
        title="Valeria del Mar, a pasos de la playa."
        copy={`${hotel.address}. Cerca de Cariló y Pinamar.`}
        crumbs={[{ label: "Inicio", to: "/" }, { label: "Ubicación" }]}
      />
      <section className="section location-page">
        <div className="location-card" data-reveal>
          <p className="overline">Dirección</p>
          <h2>{hotel.address}</h2>
          <p>{hotel.location}</p>
          <div className="action-row">
            <a className="button button-primary" href={hotel.mapsHref} target="_blank" rel="noreferrer">
              Abrir ubicación
            </a>
            <Link className="button button-outline" to="/contacto">
              Consultar
            </Link>
          </div>
        </div>
        <DistanceGrid />
      </section>
      <section className="section split-layout">
        <div data-reveal>
          <p className="overline">Alrededores</p>
          <h2>Para comer y para ir a la playa, todo cerca.</h2>
        </div>
        <div className="nearby-columns" data-reveal>
          <div>
            <h3>Restaurantes</h3>
            <ul className="detail-list">
              {hotel.nearby.restaurants.map((place) => (
                <li key={place.name}>
                  {place.name} <span className="nearby-distance">· {place.distance}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Playas</h3>
            <ul className="detail-list">
              {hotel.nearby.beaches.map((place) => (
                <li key={place.name}>
                  {place.name} <span className="nearby-distance">· {place.distance}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="section map-section">
        <MapEmbed />
      </section>
    </>
  );
}

function MapEmbed() {
  return (
    <div className="map-embed" data-reveal>
      <iframe
        title={`Mapa de ${hotel.fullName}`}
        src={hotel.mapsEmbedSrc}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}

function ActivitiesPage({ Link }) {
  return (
    <>
      <PageHero
        Link={Link}
        image={images.activitiesBeach}
        eyebrow="Actividades"
        title="Explorá la costa."
        copy="Los huéspedes pueden consultar por actividades de playa, naturaleza, aventura y cultura en la zona."
        crumbs={[{ label: "Inicio", to: "/" }, { label: "Actividades" }]}
      />
      <section className="section amenity-section">
        <SectionHeading
          eyebrow="Zona"
          title="Actividades informadas por el hotel."
          copy="La disponibilidad puede consultarse directamente con el establecimiento."
        />
        <div className="activity-grid">
          {hotel.activities.map((activity, index) => (
            <article className="activity-card" key={activity} data-reveal>
              <div className="activity-card__media">
                <img
                  src={activityImages[index]}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                {activityVideoIds[index] && (
                  <HeroVideoBackground videoId={activityVideoIds[index]} variant="card" />
                )}
              </div>
              <p className="activity-card__body">{activity}</p>
            </article>
          ))}
        </div>
      </section>
      <FinalCta Link={Link} compact />
    </>
  );
}

function ContactPage({ Link }) {
  return (
    <>
      <PageHero
        Link={Link}
        image={photoSrc("hotel-cartel") ?? images.contact}
        eyebrow="Reserva y contacto"
        title="¿Nos vemos en la costa?"
        copy="Consultá disponibilidad directamente con Valeria del Faro Suite & Spa."
        crumbs={[{ label: "Inicio", to: "/" }, { label: "Contacto" }]}
      />
      <section className="section contact-layout">
        <div className="contact-layout__form" data-reveal>
          <p className="overline">Consulta de disponibilidad</p>
          <h2>Contanos tu estadía y te respondemos.</h2>
          <ReservationForm />
        </div>
        <aside className="contact-layout__aside" data-reveal>
          <ReservationSteps />
          <ContactCards />
        </aside>
      </section>
      <section className="section contact-rules">
        <p className="overline">Información importante</p>
        <PolicyGrid />
      </section>
    </>
  );
}

function NotFoundPage({ Link }) {
  return (
    <section className="not-found">
      <p className="overline">Página no encontrada</p>
      <h1>No encontramos esa ruta.</h1>
      <Link className="button button-primary" to="/">
        Volver al inicio
      </Link>
    </section>
  );
}

function PageHero({ Link, image, video, videoId, videoSegments, eyebrow, title, copy, crumbs }) {
  return (
    <section className="page-hero">
      <div
        className={video || videoId ? "page-hero__media hero-media--video" : "page-hero__media"}
        aria-hidden="true"
      >
        <img src={image} alt="" fetchPriority="high" decoding="async" />
        {video ? (
          <LocalVideo name={video} />
        ) : (
          videoId && <HeroVideoBackground videoId={videoId} segments={videoSegments} />
        )}
      </div>
      <div className="page-hero__shade" aria-hidden="true" />
      <div className="page-hero__inner">
        {crumbs && (
          <nav className="breadcrumbs" aria-label="Migas de pan">
            {crumbs.map((crumb) =>
              crumb.to ? (
                <Link key={crumb.label} to={crumb.to}>
                  {crumb.label}
                </Link>
              ) : (
                <span key={crumb.label}>{crumb.label}</span>
              ),
            )}
          </nav>
        )}
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{copy}</p>
        <div className="action-row">
          <a className="button button-primary" href={hotel.whatsappHref} target="_blank" rel="noreferrer">
            Consultar disponibilidad
          </a>
          <a className="button button-ghost" href={hotel.whatsappHref} target="_blank" rel="noreferrer">
            Llamar
          </a>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ index, eyebrow, title, copy, Link, cta }) {
  return (
    <div className="section-heading" data-reveal>
      <div>
        <p className="overline">
          {index && <span aria-hidden="true">{index}</span>}
          {eyebrow}
        </p>
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
      {Link && cta && (
        <Link className="text-link" to={cta.to}>
          {cta.label}
        </Link>
      )}
    </div>
  );
}

// La foto o el video acompañan el movimiento del mouse, apenas, para que
// la sección se sienta viva sin marear.
function useParallax(strength = 16) {
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

function ImageFeature({
  image,
  video,
  index,
  eyebrow,
  title,
  copy,
  children,
  reverse = false,
  dark = false,
  Link,
  cta,
}) {
  const className = [
    "image-feature",
    reverse ? "image-feature--reverse" : "",
    dark ? "image-feature--dark" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const parallax = useParallax();

  return (
    <section className={className}>
      <div
        className="image-feature__media is-parallax hero-media--video"
        data-reveal
        ref={parallax.ref}
        onMouseMove={parallax.onMouseMove}
        onMouseLeave={parallax.onMouseLeave}
      >
        <img src={image} alt="" loading="lazy" decoding="async" />
        {video && <LocalVideo name={video} poster={video} />}
      </div>
      <div className="image-feature__content" data-reveal>
        <p className="overline">
          {index && <span aria-hidden="true">{index}</span>}
          {eyebrow}
        </p>
        <h2>{title}</h2>
        <p>{copy}</p>
        {children}
        {Link && cta && (
          <div className="action-row">
            <Link className="button button-primary" to={cta.to}>
              {cta.label}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function SuiteFeature({ Link }) {
  const suite = hotel.rooms.find((room) => room.slug === "presidencial");

  return (
    <section className="suite-feature">
      <div className="suite-feature__media hero-media--video" data-reveal>
        <img src={images.suite} alt="" loading="lazy" decoding="async" />
        <LocalVideo name={suite.heroVideo} poster="suite-panoramica" />
      </div>
      <div className="suite-feature__content" data-reveal>
        <p className="overline">La pieza estrella</p>
        <h2>
          Suite Presidencial
          <span>Vista directa al mar.</span>
        </h2>
        <p className="suite-feature__meta">{suite.meta}</p>
        <p>{suite.description}</p>
        <PillList items={[suite.count, "Vestidor", "Ducha escocesa"]} />
        <div className="action-row">
          <Link className="button button-primary" to={suite.path}>
            Ver la suite
          </Link>
        </div>
      </div>
    </section>
  );
}

// Home spa block: three looping fragments of the real spa circuit next to
// the list of spa options.
function SpaFeature({ Link }) {
  const featured = ["Piscina de hidromasaje", "Sauna seco", "Cascada"];
  const moments = featured
    .map((label) => hotel.spaMoments.find((moment) => moment.label === label))
    .filter(Boolean);

  return (
    <section className="spa-feature">
      <div className="spa-feature__content" data-reveal>
        <p className="overline">
          <span aria-hidden="true">04</span>
          Spa & bienestar
        </p>
        <h2>
          El arte de descansar.
          <span>Hidromasaje · Saunas · Piscina · Masajes</span>
        </h2>
        <p>
          Un espacio para desconectar con hidromasaje, piscinas, saunas,
          vestuarios y servicio de masajes con reserva previa.
        </p>
        <PillList items={hotel.spa.slice(0, 5)} />
        <div className="action-row">
          <Link className="button button-primary" to="/servicios/spa">
            Ver spa
          </Link>
          <Link className="button button-ghost" to="/servicios/piscina">
            Ver piscinas
          </Link>
        </div>
      </div>
      <div className="spa-feature__reel">
        {moments.map((moment) => (
          <VideoMoment
            key={moment.label}
            videoId={hotel.spaCircuitYoutubeId}
            moment={moment}
            portrait
            compact
          />
        ))}
      </div>
    </section>
  );
}

function BreakfastFeature({ Link }) {
  return (
    <section className="section breakfast-section">
      <div className="breakfast-panel" data-reveal>
        <div className="breakfast-panel__media" aria-hidden="true">
          <img src={images.desayunoReal} alt="" loading="lazy" decoding="async" />
        </div>
        <div className="breakfast-panel__content">
          <p className="overline">
            <span aria-hidden="true">05</span>
            Desayuno
          </p>
          <h2>Empezá el día sin apuro.</h2>
          <p>
            Se sirve en {hotel.breakfast.place} de {hotel.breakfast.time}, con
            clásicos de desayuno informados por el hotel.
          </p>
          <div className="breakfast-time">
            <strong>{hotel.breakfast.time}</strong>
            <span>{hotel.breakfast.place}</span>
          </div>
          <PillList items={hotel.breakfast.items.slice(0, 8)} />
          <div className="action-row">
            <Link className="button button-outline" to="/servicios/desayuno">
              Ver desayuno
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoomGrid({ Link }) {
  return (
    <div className="room-grid">
      {hotel.rooms.map((room) => (
        <RoomCard key={room.name} room={room} Link={Link} />
      ))}
    </div>
  );
}

// How the 17 rooms break down, so the number of doubles and the single
// room with a direct sea view are visible at a glance.
function RoomTally({ Link }) {
  return (
    <div className="room-tally" data-reveal>
      {hotel.rooms.map((room) => (
        <Link
          key={room.slug}
          to={room.path}
          className={room.scarce ? "room-tally__item is-scarce" : "room-tally__item"}
        >
          <strong>{room.tally.value}</strong>
          <b>{room.tally.label}</b>
          <span>{room.tally.detail}</span>
        </Link>
      ))}
      <p className="room-tally__note">
        17 habitaciones en total: 16 habitaciones más la Suite Presidencial.
        Ocho de las matrimoniales son cuádruples. Vista directa al mar, solo en
        la Suite Presidencial. Algunas dobles también miran al mar, según
        disponibilidad. Cada habitación se reserva por su capacidad máxima, que
        no se negocia.
      </p>
    </div>
  );
}

// Distintivo para las habitaciones donde la vista al mar depende de la
// disponibilidad: un sol sobre dos olas, dibujado para este sitio.
function SeaViewBadge({ note, compact = false }) {
  if (!note) return null;

  return (
    <p className={compact ? "sea-view-badge is-compact" : "sea-view-badge"}>
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="11" r="5.4" />
        <path d="M3 20.5c2.2 0 2.2-1.8 4.3-1.8s2.2 1.8 4.3 1.8 2.2-1.8 4.4-1.8 2.2 1.8 4.3 1.8 2.2-1.8 4.4-1.8 2.2 1.8 4.3 1.8" />
        <path d="M3 25.5c2.2 0 2.2-1.8 4.3-1.8s2.2 1.8 4.3 1.8 2.2-1.8 4.4-1.8 2.2 1.8 4.3 1.8 2.2-1.8 4.4-1.8 2.2 1.8 4.3 1.8" />
      </svg>
      <span>
        <strong>{note.label}</strong>
        {!compact && <span>{note.text}</span>}
      </span>
    </p>
  );
}

function RoomCard({ room, Link }) {
  return (
    <article
      className={room.featured ? "room-card room-card--featured" : "room-card"}
      data-reveal
    >
      <Link className="room-card__media" to={room.path} aria-label={`Ver ${room.name}`}>
        <img src={roomImage(room)} alt="" loading="lazy" decoding="async" />
      </Link>
      <div className="room-card__body">
        <span className={room.scarce ? "room-card__view is-scarce" : "room-card__view"}>
          {room.orientation}
        </span>
        <span>{room.count}</span>
        <h3>{room.name}</h3>
        <p className="room-meta">{room.meta}</p>
        <p className="room-card__capacity">{room.capacity}</p>
        <p className="room-card__wifi">{hotel.wifi.title}</p>
        <SeaViewBadge note={room.seaView} compact />
        <p>{room.description}</p>
        <Link className="text-link" to={room.path}>
          Ver detalle
        </Link>
      </div>
    </article>
  );
}

// Compact amenities strip for the home page. Rooms, spa and breakfast
// already have their own blocks above, so this only lists the practical
// comforts, linking to a page where one exists.
const comfortIcons = {
  wifi: (
    <>
      <path d="M2 8.5a15 15 0 0 1 20 0" />
      <path d="M5.5 12a10 10 0 0 1 13 0" />
      <path d="M9 15.5a5 5 0 0 1 6 0" />
      <circle cx="12" cy="19" r="1" />
    </>
  ),
  parking: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
    </>
  ),
  beach: (
    <>
      <path d="M2 17c2 0 2-1.5 4-1.5S8 17 10 17s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5" />
      <path d="M2 21c2 0 2-1.5 4-1.5S8 21 10 21s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5" />
      <circle cx="17" cy="7" r="3" />
    </>
  ),
  breakfast: (
    <>
      <path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z" />
      <path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H16" />
      <path d="M8 3v3M12 3v3" />
    </>
  ),
  spa: (
    <>
      <path d="M12 21c-4.5 0-8-3-8-7 3 0 6 1.5 8 4 2-2.5 5-4 8-4 0 4-3.5 7-8 7Z" />
      <path d="M12 18c-2-2.5-2-7 0-10 2 3 2 7.5 0 10Z" />
    </>
  ),
  pool: (
    <>
      <path d="M8 16V5a2 2 0 0 1 4 0M16 16V5a2 2 0 0 0-4 0" />
      <path d="M8 9h8M8 13h8" />
      <path d="M2 20c2 0 2-1.5 4-1.5S8 20 10 20s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5" />
    </>
  ),
  safe: (
    <>
      <rect x="3" y="4" width="18" height="15" rx="2" />
      <circle cx="12" cy="11.5" r="3" />
      <path d="M12 8.5v1M12 13.5v1M6 19v2M18 19v2" />
    </>
  ),
  tv: (
    <>
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
};

const comforts = [
  { icon: "wifi", title: "Wi‑Fi propio", detail: "Un equipo en cada habitación, y señal en áreas comunes" },
  { icon: "parking", title: "Estacionamiento", detail: "Propio, cubierto y descubierto" },
  { icon: "beach", title: "Playa", detail: "A 30 pasos, con acceso por rampa", to: "/ubicacion" },
  { icon: "breakfast", title: "Desayuno", detail: hotel.breakfast.time, to: "/servicios/desayuno" },
  { icon: "spa", title: "Spa", detail: "Hidromasaje, saunas y masajes", to: "/servicios/spa" },
  { icon: "pool", title: "Piscinas", detail: "Cubiertas y exterior en temporada", to: "/servicios/piscina" },
  { icon: "safe", title: "Caja de seguridad", detail: "Codificada, con frigobar y pava eléctrica" },
  { icon: "tv", title: "Smart TV", detail: "Android de 50 pulgadas en habitaciones" },
];

// Servicios destacados y guía por categorías. Todo sale de la información
// que dio el hotel (hotel.js); acá solo se ordena para leerlo rápido.
const serviceHighlights = [
  { icon: "wifi", title: "Wi‑Fi propio en cada habitación", text: "Cada habitación tiene su propio equipo." },
  { icon: "parking", title: "Estacionamiento propio", text: "Cubierto y descubierto." },
  { icon: "beach", title: "A 30 pasos del mar", text: "Con acceso por rampa a la playa." },
  { icon: "spa", title: "Spa todo el año", text: "Hidromasaje, saunas y agua fría, cubiertos." },
];

const serviceGuide = [
  {
    icon: "tv",
    title: "En tu habitación",
    items: [
      "Wi‑Fi propio, con equipo dedicado",
      "Smart TV Android de 50 pulgadas",
      "Aire acondicionado",
      "Frigobar y pava eléctrica",
      "Caja de seguridad codificada",
      "Secador de pelo",
    ],
    to: "/servicios/habitaciones",
    cta: "Ver habitaciones",
  },
  {
    icon: "breakfast",
    title: "Desayuno y áreas comunes",
    items: [
      `Desayuno en Planta Baja, de ${hotel.breakfast.time}`,
      "Lobby con TV Android de 70 pulgadas",
      "Wi‑Fi en lobby y áreas comunes",
      "Gimnasio",
      "Bar junto a la piscina",
    ],
    to: "/servicios/desayuno",
    cta: "Ver desayuno",
  },
  {
    icon: "spa",
    title: "Spa y piletas",
    items: hotel.spa,
    to: "/servicios/spa",
    cta: "Ver spa",
  },
  {
    icon: "parking",
    title: "Llegada y playa",
    items: [
      "Estacionamiento propio, cubierto y descubierto",
      "A 30 pasos de la playa",
      "Acceso por rampa a la playa",
    ],
    to: "/ubicacion",
    cta: "Ver ubicación",
  },
  {
    icon: "safe",
    title: "Seguridad y accesibilidad",
    items: [
      "Espacio cardioprotegido",
      "Red de incendio en todo el edificio",
      ...hotel.accessibility,
    ],
  },
];

function ComfortGrid({ Link, only }) {
  const list = only ? comforts.filter((item) => only.includes(item.icon)) : comforts;

  return (
    <ul className="comfort-grid">
      {list.map((amenity) => {
        const content = (
          <>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {comfortIcons[amenity.icon]}
            </svg>
            <strong>{amenity.title}</strong>
            <span>{amenity.detail}</span>
          </>
        );
        return (
          <li key={amenity.title} data-reveal>
            {amenity.to ? <Link to={amenity.to}>{content}</Link> : <div>{content}</div>}
          </li>
        );
      })}
    </ul>
  );
}

function ServiceRouteGrid({ Link, limit }) {
  const visibleServices = limit ? serviceRoutes.slice(0, limit) : serviceRoutes;

  return (
    <div className="service-route-grid">
      {visibleServices.map((service) => (
        <article className="service-card" key={service.to} data-reveal>
          <Link className="service-card__media" to={service.to} aria-label={`Ver ${service.title}`}>
            <img src={service.image} alt="" loading="lazy" decoding="async" />
          </Link>
          <div className="service-card__body">
            <span>{service.meta}</span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <Link className="text-link" to={service.to}>
              Abrir
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

function FactGrid() {
  const facts = [
    { value: "17", label: "habitaciones, suite incluida" },
    { value: "30", label: "pasos de la playa" },
    { value: "2013", label: "inicio del proyecto familiar" },
    { value: "2024", label: "hotel completado" },
  ];

  return (
    <div className="fact-grid" data-reveal>
      {facts.map((fact) => (
        <div key={fact.label}>
          <strong>{fact.value}</strong>
          <span>{fact.label}</span>
        </div>
      ))}
    </div>
  );
}

function DistanceGrid() {
  return (
    <div className="distance-grid" data-reveal>
      {hotel.distances.map((item) => (
        <div className="distance-item" key={item.place}>
          <span>{item.place}</span>
          <strong>{item.distance}</strong>
        </div>
      ))}
    </div>
  );
}

function DetailList({ items }) {
  return (
    <ul className="detail-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function PillList({ items }) {
  return (
    <div className="pill-list">
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function PolicyGrid() {
  return (
    <div className="policy-grid">
      {hotel.policies.map((policy) => (
        <article key={policy.title} className={policy.firm ? "is-firm" : undefined} data-reveal>
          <h3>{policy.title}</h3>
          <p>{policy.text}</p>
        </article>
      ))}
    </div>
  );
}


function TestimonialsSection() {
  return (
    <section className="section testimonials-section">
      <SectionHeading
        eyebrow="Huéspedes"
        title="Lo que dicen quienes ya se hospedaron."
        copy="Reseñas reales, tal como quedaron publicadas en las plataformas de reserva."
      />
      <div className="rating-row" data-reveal>
        {hotel.ratings.map((rating) => (
          <a
            className="rating-badge"
            key={rating.source}
            href={rating.url}
            target="_blank"
            rel="noreferrer"
          >
            <strong>{rating.score}</strong>
            <span>
              {rating.label} · {rating.source} · {rating.count} reseñas
            </span>
          </a>
        ))}
      </div>
      <div className="testimonial-grid">
        {hotel.testimonials.map((testimonial) => (
          <article className="testimonial-card" key={testimonial.author} data-reveal>
            <p>“{testimonial.quote}”</p>
            <span>
              {testimonial.author} · {testimonial.origin}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

function PromotionBand() {
  if (!hotel.promotion.enabled) return null;

  return (
    <section className="section promotion-band" data-reveal>
      <div>
        <p className="overline">{hotel.promotion.title}</p>
        {hotel.promotion.lines.map((line) => (
          <strong key={line}>{line}</strong>
        ))}
        <p>{hotel.promotion.note}</p>
      </div>
      <a className="button button-light" href={hotel.whatsappHref} target="_blank" rel="noreferrer">
        Consultar promoción
      </a>
    </section>
  );
}

function BookingInfo({ Link }) {
  return (
    <section className="section booking-info" data-reveal>
      <div className="booking-info__heading">
        <p className="overline">Reglas de la casa</p>
        <h2>Antes de reservar, tres cosas que no se negocian.</h2>
        <Link className="text-link" to="/contacto">
          Ver contacto
        </Link>
      </div>
      <dl className="booking-info__list">
        {hotel.policies.map((policy) => (
          <div key={policy.title} className={policy.firm ? "is-firm" : undefined}>
            <dt>{policy.title}</dt>
            <dd>{policy.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function FinalCta({ Link, compact = false }) {
  return (
    <section className={compact ? "final-cta final-cta--compact" : "final-cta"}>
      <div className="final-cta__media" aria-hidden="true">
        <img src={images.strip} alt="" loading="lazy" decoding="async" />
      </div>
      <div className="final-cta__content" data-reveal>
        <p className="overline">Reserva y contacto</p>
        <h2>Consultá disponibilidad frente al mar.</h2>
        <p>
          Atención directa por teléfono o email para coordinar tu estadía en
          Valeria del Faro Suite & Spa.
        </p>
        <div className="action-row">
          <a className="button button-primary" href={hotel.whatsappHref} target="_blank" rel="noreferrer">
            Consultar por WhatsApp
          </a>
          <a className="button button-ghost" href={hotel.phoneHref}>
            {hotel.phone}
          </a>
          <Link className="button button-quiet" to="/contacto">
            Ver contacto y mapa
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer({ Link }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="site-footer__brand">
          <Link className="footer-brand" to="/">
            {hotel.name}
            <span>{hotel.descriptor}</span>
          </Link>
          <p>{hotel.concept}</p>
        </div>

        <div className="site-footer__col">
          <p className="footer-title">Contacto</p>
          <address>
            {hotel.addressShort}
            <br />
            Provincia de Buenos Aires
          </address>
          <a href={hotel.phoneHref}>{hotel.phone}</a>
          <a href={hotel.emailHref}>{hotel.email}</a>
        </div>

        <nav className="site-footer__col" aria-label="Navegación secundaria">
          <p className="footer-title">Explorar</p>
          <Link to="/hotel">Hotel</Link>
          <Link to="/servicios/habitaciones">Habitaciones</Link>
          <Link to="/servicios/spa">Spa</Link>
          <Link to="/servicios">Servicios</Link>
          <Link to="/actividades">Actividades</Link>
          <Link to="/contacto">Contacto</Link>
        </nav>

        <div className="site-footer__col">
          <p className="footer-title">Reservas</p>
          <Link className="button button-outline" to="/contacto">
            Consultar disponibilidad
          </Link>
          <div className="footer-social" aria-label="Redes sociales">
            <a href={hotel.whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a href={hotel.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href={hotel.youtube} target="_blank" rel="noreferrer">
              YouTube
            </a>
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>
          © {new Date().getFullYear()} {hotel.fullName}. Todos los derechos reservados.
        </p>
        <p className="footer-credit">Diseñado por Petala®</p>
      </div>
    </footer>
  );
}

export default App;
