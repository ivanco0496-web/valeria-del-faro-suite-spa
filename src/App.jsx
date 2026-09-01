import { useEffect, useState } from "react";
import { hotel } from "./data/hotel.js";
import logo from "./assets/hotel/valeria-del-faro-logo.webp";
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
import poolCovered from "./assets/hotel/pool-covered-wide.avif";
import hotelEntryWide from "./assets/hotel/hotel-entry-wide.avif";
import activityCabalgatas from "./assets/activities/cabalgatas.webp";
import activityFaroQuerandi from "./assets/activities/faro-querandi.webp";
import activityCuatriciclos from "./assets/activities/cuatriciclos.webp";
import activityBicicletas from "./assets/activities/bicicletas.webp";
import activityTirolesa from "./assets/activities/tirolesa.webp";
import activityCineTeatro from "./assets/activities/cine-teatro.webp";

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

// Note: room-matrimonial-wide.avif, hotel-exterior-wide.avif, contact-wide.avif
// and activities-coast.avif are real Valeria del Faro photos (verified against
// the site backup by hash) but are lifestyle/stock-style shots used elsewhere
// on the live site, not photos of this property, so they're kept but unused here.

const images = {
  hero: poolExterior,
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
  pool: poolCovered,
  poolExterior,
  contact: hotelEntryWide,
  hotelEntry: hotelEntryWide,
  hotelExterior: poolExterior,
};

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
    meta: "17 habitaciones",
    to: "/servicios/habitaciones",
    image: images.roomMatrimonial,
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
    image: images.breakfast,
    description:
      "Desayuno servido en Planta Baja con productos clásicos para empezar el día sin apuro.",
  },
  {
    title: "Piscina",
    meta: "Hidromasaje · agua fría · temporada",
    to: "/servicios/piscina",
    image: images.pool,
    description:
      "Piscina de hidromasajes, piscina de agua fría y piscina exterior climatizada en temporada alta.",
  },
  {
    title: "Playa",
    meta: "A 30 pasos del mar",
    to: "/servicios/playa",
    image: images.strip,
    description:
      "Acceso por rampa, servicio de playa durante temporada alta y balneario exclusivo para dos personas.",
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
  "/servicios/playa": "Playa",
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
  if (room.slug === "presidencial") return images.suite;
  if (room.slug === "doble") return images.roomDoble;
  return images.roomMatrimonial;
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
  if (path === "/servicios/playa") return <BeachPage Link={Link} />;
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

function HomePage({ Link }) {
  return (
    <>
      <section className="home-hero">
        <div className="hero-media" aria-hidden="true">
          <img src={images.hero} alt="" fetchPriority="high" decoding="async" />
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
            <Link className="button button-primary" to="/contacto">
              Consultar disponibilidad
            </Link>
            <a className="button button-ghost" href={hotel.phoneHref}>
              Llamar ahora
            </a>
            <Link className="button button-quiet" to="/servicios/habitaciones">
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
          <Link className="button button-primary" to="/contacto">
            Reservar
          </Link>
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
        image={images.coast}
        index="02"
        eyebrow="La propuesta central"
        title="Del hotel al mar. Solo 30 pasos."
        copy="El hotel destaca su cercanía con la playa, el acceso por rampa y el servicio de playa durante temporada alta."
        Link={Link}
        cta={{ label: "Descubrir ubicación", to: "/ubicacion" }}
      >
        <DetailList items={hotel.valuePoints.slice(1, 5)} />
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
        <RoomGrid Link={Link} />
      </section>

      <ImageFeature
        image={images.spa}
        index="04"
        eyebrow="Spa & bienestar"
        title="El arte de descansar."
        copy="Un espacio para desconectar con hidromasaje, piscinas, saunas, vestuarios y servicio de masajes con reserva previa."
        reverse
        dark
        Link={Link}
        cta={{ label: "Ver spa", to: "/servicios/spa" }}
      >
        <PillList items={hotel.spa.slice(0, 5)} />
      </ImageFeature>

      <BreakfastFeature Link={Link} />

      <section className="section service-preview">
        <SectionHeading
          index="06"
          eyebrow="Servicios"
          title="Lo esencial, resuelto con calma."
          copy="Desayuno, playa, piscina, estacionamiento, Wi-Fi y detalles prácticos para una estadía simple."
          Link={Link}
          cta={{ label: "Explorar servicios", to: "/servicios" }}
        />
        <ServiceRouteGrid Link={Link} limit={5} />
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

      <PromotionBand />
      <FinalCta Link={Link} />
    </>
  );
}

function HotelPage({ Link }) {
  return (
    <>
      <PageHero
        Link={Link}
        image={images.hotelExterior}
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
      <section className="section policy-section">
        <SectionHeading
          eyebrow="Información importante"
          title="Condiciones de hospedaje."
          copy="Información real informada por el hotel para evitar consultas innecesarias."
        />
        <PolicyGrid />
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
        image={images.coast}
        eyebrow="Servicios"
        title="Comodidades claras para una estadía simple."
        copy="Wi-Fi, estacionamiento, servicio de playa, spa, desayuno y equipamiento de habitaciones según la información provista por el hotel."
        crumbs={[{ label: "Inicio", to: "/" }, { label: "Servicios" }]}
      />
      <section className="section service-preview">
        <ServiceRouteGrid Link={Link} />
      </section>
      <section className="section amenity-section">
        <SectionHeading
          eyebrow="Comodidades"
          title="Todo lo informado por el hotel, ordenado para consultar rápido."
        />
        <AmenityGrid />
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
        title="17 habitaciones y una suite con vista directa al mar."
        copy="Matrimoniales, dobles y Suite Presidencial, con superficies amplias y equipamiento real informado por el hotel."
        crumbs={[
          { label: "Inicio", to: "/" },
          { label: "Servicios", to: "/servicios" },
          { label: "Habitaciones" },
        ]}
      />
      <section className="section rooms-section">
        <RoomGrid Link={Link} />
      </section>
      <ImageFeature
        image={images.suiteDetail}
        eyebrow="Suite Presidencial"
        title="Vista directa al mar desde el 4.º piso."
        copy="Acceso privado mediante ascensor, cama sommier Queen, sofá cama con carrito, área de estar con dos sillones, vestidor y ducha escocesa."
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
            <Link className="button button-primary" to="/contacto">
              Consultar disponibilidad
            </Link>
            <Link className="button button-outline" to="/servicios/habitaciones">
              Ver habitaciones
            </Link>
          </div>
        </div>
        <aside className="detail-panel" data-reveal>
          <h3>Características</h3>
          <DetailList items={room.details} />
        </aside>
      </section>
      {room.youtubeId && (
        <section className="section video-section">
          <SectionHeading eyebrow="Recorrido en video" title={`Conocé la habitación ${room.name}.`} />
          <YouTubeEmbed videoId={room.youtubeId} title={`Video de la habitación ${room.name}`} />
        </section>
      )}
    </>
  );
}

function YouTubeEmbed({ videoId, title }) {
  return (
    <div className="video-embed" data-reveal>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function SpaPage({ Link }) {
  return (
    <>
      <PageHero
        Link={Link}
        image={images.heroPoolGlass}
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
        </div>
      </section>
      <section className="section video-section">
        <SectionHeading eyebrow="Recorrido en video" title="Conocé el circuito de spa." />
        <YouTubeEmbed videoId={hotel.spaYoutubeId} title="Video del circuito de spa" />
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
        image={images.breakfastDetail}
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
  const poolItems = hotel.spa.filter((item) => item.includes("Piscina"));

  return (
    <>
      <PageHero
        Link={Link}
        image={images.pool}
        eyebrow="Piscina"
        title="Agua, descanso y temporada de playa."
        copy="El hotel informa piscina de hidromasajes, piscina de agua fría y piscina exterior climatizada durante temporada alta."
        crumbs={[
          { label: "Inicio", to: "/" },
          { label: "Servicios", to: "/servicios" },
          { label: "Piscina" },
        ]}
      />
      <section className="section detail-layout">
        <div className="detail-copy" data-reveal>
          <p className="overline">Piscinas</p>
          <h2>Opciones para relajarse dentro del circuito de bienestar.</h2>
        </div>
        <aside className="detail-panel" data-reveal>
          <h3>Información disponible</h3>
          <DetailList items={poolItems} />
        </aside>
      </section>
      <FinalCta Link={Link} compact />
    </>
  );
}

function BeachPage({ Link }) {
  return (
    <>
      <PageHero
        Link={Link}
        image={images.strip}
        eyebrow="Playa"
        title="A 30 pasos del mar."
        copy="El hotel cuenta con acceso por rampa a la playa y servicio de playa durante temporada alta."
        crumbs={[
          { label: "Inicio", to: "/" },
          { label: "Servicios", to: "/servicios" },
          { label: "Playa" },
        ]}
      />
      <section className="section split-layout">
        <div data-reveal>
          <p className="overline">Frente costero</p>
          <h2>La playa es la protagonista de la estadía.</h2>
        </div>
        <div className="flow-copy" data-reveal>
          <DetailList items={hotel.valuePoints.slice(0, 4)} />
          <div className="action-row">
            <Link className="button button-primary" to="/ubicacion">
              Ver ubicación
            </Link>
            <Link className="button button-outline" to="/contacto">
              Consultar
            </Link>
          </div>
        </div>
      </section>
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
        image={images.contact}
        eyebrow="Reserva y contacto"
        title="¿Nos vemos en la costa?"
        copy="Consultá disponibilidad directamente con Valeria del Faro Suite & Spa."
        crumbs={[{ label: "Inicio", to: "/" }, { label: "Contacto" }]}
      />
      <section className="section contact-page">
        <ContactGrid />
        <div className="contact-note" data-reveal>
          <p className="overline">Información importante</p>
          <PolicyGrid />
        </div>
      </section>
      <section className="section map-section">
        <MapEmbed />
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

function PageHero({ Link, image, eyebrow, title, copy, crumbs }) {
  return (
    <section className="page-hero">
      <div className="page-hero__media" aria-hidden="true">
        <img src={image} alt="" fetchPriority="high" decoding="async" />
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
          <Link className="button button-primary" to="/contacto">
            Consultar disponibilidad
          </Link>
          <a className="button button-ghost" href={hotel.phoneHref}>
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

function ImageFeature({
  image,
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

  return (
    <section className={className}>
      <div className="image-feature__media" data-reveal>
        <img src={image} alt="" loading="lazy" decoding="async" />
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

function BreakfastFeature({ Link }) {
  return (
    <section className="section breakfast-section">
      <div className="breakfast-panel" data-reveal>
        <div className="breakfast-panel__media" aria-hidden="true">
          <img src={images.breakfast} alt="" loading="lazy" decoding="async" />
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
        <span>{room.count}</span>
        <h3>{room.name}</h3>
        <p className="room-meta">{room.meta}</p>
        <p>{room.description}</p>
        <Link className="text-link" to={room.path}>
          Ver detalle
        </Link>
      </div>
    </article>
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
    { value: "17", label: "habitaciones" },
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

function AmenityGrid() {
  return (
    <div className="amenity-grid">
      {hotel.services.map((service) => (
        <article className="amenity-item" key={service} data-reveal>
          <span aria-hidden="true" />
          <p>{service}</p>
        </article>
      ))}
    </div>
  );
}

function PolicyGrid() {
  return (
    <div className="policy-grid">
      {hotel.policies.map((policy) => (
        <article key={policy.title} data-reveal>
          <h3>{policy.title}</h3>
          <p>{policy.text}</p>
        </article>
      ))}
    </div>
  );
}

function ContactGrid() {
  return (
    <div className="contact-grid" data-reveal>
      <a className="contact-grid__whatsapp" href={hotel.whatsappHref} target="_blank" rel="noreferrer">
        <span>WhatsApp</span>
        <strong>Escribinos directo</strong>
      </a>
      <a href={hotel.phoneHref}>
        <span>Teléfono</span>
        <strong>{hotel.phone}</strong>
      </a>
      <a href={hotel.emailHref}>
        <span>Email</span>
        <strong>{hotel.email}</strong>
      </a>
      <div>
        <span>Dirección</span>
        <strong>{hotel.address}</strong>
      </div>
      <div>
        <span>Ubicación</span>
        <strong>{hotel.location}</strong>
      </div>
      <a href={hotel.mapsHref} target="_blank" rel="noreferrer">
        <span>Mapa</span>
        <strong>Abrir ubicación</strong>
      </a>
    </div>
  );
}

function PromotionBand() {
  if (!hotel.promotion.enabled) return null;

  return (
    <section className="section promotion-band" data-reveal>
      <p className="overline">{hotel.promotion.title}</p>
      <div>
        {hotel.promotion.lines.map((line) => (
          <strong key={line}>{line}</strong>
        ))}
      </div>
      <p>{hotel.promotion.note}</p>
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
          <Link className="button button-primary" to="/contacto">
            Consultar disponibilidad
          </Link>
          <a className="button button-ghost" href={hotel.whatsappHref} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a className="button button-quiet" href={hotel.emailHref}>
            Enviar email
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer({ Link }) {
  return (
    <footer className="site-footer">
      <div>
        <Link className="footer-brand" to="/">
          {hotel.fullName}
        </Link>
        <p>{hotel.concept}</p>
        <p>{hotel.address}</p>
        <p>{hotel.phone}</p>
      </div>
      <nav aria-label="Navegación secundaria">
        <Link to="/hotel">Hotel</Link>
        <Link to="/servicios/habitaciones">Habitaciones</Link>
        <Link to="/servicios/spa">Spa</Link>
        <Link to="/servicios">Servicios</Link>
        <Link to="/actividades">Actividades</Link>
        <Link to="/contacto">Contacto</Link>
      </nav>
      <div className="footer-connect">
        <Link className="button button-outline" to="/contacto">
          Reservar
        </Link>
        <div className="footer-social" aria-label="Redes sociales">
          <a href={hotel.whatsappHref} target="_blank" rel="noreferrer" aria-label="WhatsApp">
            WhatsApp
          </a>
          <a href={hotel.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
            Instagram
          </a>
          <a href={hotel.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">
            YouTube
          </a>
        </div>
        <p className="footer-copyright">
          © {new Date().getFullYear()} {hotel.fullName}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default App;
