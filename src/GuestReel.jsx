import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { photoSrc } from "./media.js";
import poolSunset from "./assets/hotel/pool-sunset.avif";
import heroPoolGlass from "./assets/hotel/hero-pool-glass.avif";
import breakfast from "./assets/hotel/breakfast.avif";

/*
  Reel de huéspedes: las reseñas pasan como un videito.

  - Cada reseña llega con el barrido de luz del faro y se apoya en la foto de
    lo que cuenta (la pileta, el desayuno, la vista...).
  - Las palabras se van encendiendo, como si el haz de luz las leyera.
  - Arriba, una barra de progreso por reseña; las de Google van primero y
    después las de las otras plataformas, agrupadas.
  - Al final, una pantalla de cierre con el puntaje y la consulta por WhatsApp.

  Se pausa solo cuando está fuera de pantalla, con el mouse encima, con el foco
  del teclado adentro, al mantener apretado y desde el botón. Con
  "reducir movimiento" no avanza solo y no anima nada: se navega a mano.
*/

// Fotos de fondo. `pos` es la parte de la foto que se conserva al recortar en
// escritorio y `posM` en celular, donde el cuadro es vertical. `veil` es cuánto
// se oscurece la foto para que el texto se lea: más en las claras.
const SCENES = {
  "piscina-atardecer": { src: poolSunset, pos: "50% 56%", posM: "38% 50%", veil: 0.2 },
  dormitorio: { src: photoSrc("matrimonial-dormitorio"), pos: "50% 60%", posM: "34% 50%", veil: 0.4 },
  recepcion: { src: photoSrc("hotel-lobby"), pos: "42% 55%", posM: "30% 55%", veil: 0.5 },
  "piscina-cubierta": { src: heroPoolGlass, pos: "50% 72%", posM: "56% 74%", veil: 0.34 },
  suite: { src: photoSrc("suite-panoramica"), pos: "50% 62%", posM: "50% 62%", veil: 0.42 },
  "suite-dormitorio": { src: photoSrc("suite-dormitorio"), pos: "55% 55%", posM: "62% 55%", veil: 0.3 },
  balcon: { src: photoSrc("matrimonial-balcon"), pos: "50% 52%", posM: "66% 50%", veil: 0.4 },
  desayuno: { src: breakfast, pos: "50% 62%", posM: "56% 62%", veil: 0.46 },
  "vista-mar": { src: photoSrc("matrimonial-vista"), pos: "62% 40%", posM: "82% 40%", veil: 0.4 },
  "salon-desayuno": { src: photoSrc("hotel-desayuno"), pos: "60% 50%", posM: "72% 50%", veil: 0.44 },
  fachada: { src: photoSrc("hotel-fachada"), pos: "62% 50%", posM: "78% 45%", veil: 0.34 },
  entrada: { src: photoSrc("hotel-entrada"), pos: "50% 55%", posM: "46% 55%", veil: 0.4 },
};

// Hacia dónde se desliza la foto en cada reseña (cámara lenta).
const DRIFT = [
  ["-2.6%", "-1.2%"],
  ["2.4%", "-1%"],
  ["-1.8%", "1.4%"],
  ["2.2%", "1.2%"],
];

// Cuánto dura cada reseña: según lo que haya que leer, entre 6,5 y 13 s.
const BASE_MS = 2800;
const PER_WORD_MS = 210;
const MIN_MS = 6500;
const MAX_MS = 13000;
const CLOSING_MS = 8000;
// Un toque largo pausa; uno corto no hace nada (así no se frena por accidente).
const HOLD_MS = 260;
const SWIPE_PX = 48;

const clamp = (min, value, max) => Math.min(max, Math.max(min, value));
const wrap = (index, total) => ((index % total) + total) % total;
const cls = (...names) => names.filter(Boolean).join(" ");
const pad = (value) => String(value).padStart(2, "0");

function useReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return undefined;
    const media = window.matchMedia(query);
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

const ICONS = {
  prev: <path d="M14.5 5.5 8 12l6.5 6.5" />,
  next: <path d="M9.5 5.5 16 12l-6.5 6.5" />,
  pause: (
    <>
      <path d="M8.5 5.5v13" />
      <path d="M15.5 5.5v13" />
    </>
  ),
  play: <path d="M8.5 5.4v13.2L18.8 12 8.5 5.4Z" />,
};

function Icon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill={name === "play" ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[name]}
    </svg>
  );
}

function Scene({ slide, index, state }) {
  const scene = SCENES[slide.scene] ?? SCENES.fachada;
  const [dx, dy] = DRIFT[index % DRIFT.length];

  return (
    <div
      className={cls("reel__scene", state === "active" && "is-active", state === "leaving" && "is-leaving")}
      style={{
        "--pos": scene.pos,
        "--pos-m": scene.posM ?? scene.pos,
        "--veil": scene.veil,
        "--kb-x": dx,
        "--kb-y": dy,
        // Un poco más que la reseña, así la foto sigue moviéndose mientras se funde.
        "--kb-dur": `${slide.dur + 2400}ms`,
      }}
      aria-hidden="true"
    >
      <img src={scene.src} alt="" loading="lazy" decoding="async" draggable={false} />
    </div>
  );
}

function ReviewSlide({ slide, position, total, leaving }) {
  const count = slide.words.length;
  const size = count > 44 ? "s" : count > 26 ? "m" : "l";
  // Las palabras se encienden en poco más de la mitad del tiempo y el resto
  // queda para leer con calma.
  const step = Math.min(slide.dur * 0.58, count * 330) / count;
  const rating = slide.rating ?? 5;

  return (
    <figure
      className={cls("reel__slide", leaving && "is-leaving")}
      data-size={size}
      role={leaving ? undefined : "group"}
      aria-roledescription={leaving ? undefined : "slide"}
      aria-label={leaving ? undefined : `${position} de ${total}`}
      aria-hidden={leaving ? "true" : undefined}
      inert={leaving ? true : undefined}
    >
      <span className="reel__stars" role="img" aria-label={`${rating} de 5 estrellas`}>
        {"★".repeat(rating)}
      </span>
      <blockquote className="reel__quote" style={{ "--step": `${step}ms` }}>
        {slide.words.map((word, i) => (
          <Fragment key={i}>
            <span className="reel__w" style={{ "--i": i }}>
              {word}
            </span>{" "}
          </Fragment>
        ))}
      </blockquote>
      <figcaption className="reel__author">
        <span className="reel__sr">{`Reseña de ${slide.source}. `}</span>
        <strong>{slide.author}</strong>
        {slide.place && <span>{slide.place}</span>}
        {slide.translated && <em>Traducida del {slide.translated}</em>}
      </figcaption>
    </figure>
  );
}

function ClosingSlide({ closing, position, total, leaving }) {
  return (
    <div
      className={cls("reel__slide reel__slide--closing", leaving && "is-leaving")}
      role={leaving ? undefined : "group"}
      aria-roledescription={leaving ? undefined : "slide"}
      aria-label={leaving ? undefined : `${position} de ${total}`}
      aria-hidden={leaving ? "true" : undefined}
      inert={leaving ? true : undefined}
    >
      <p className="reel__script">{closing.script}</p>
      <p className="reel__closing-title">{closing.title}</p>
      <p className="reel__closing-stat">{closing.stat}</p>
      <a className="button button-primary" href={closing.cta.href} target="_blank" rel="noreferrer">
        {closing.cta.label}
      </a>
    </div>
  );
}

export function GuestReel({ reviews, closing }) {
  const reduced = useReducedMotion();
  const rootRef = useRef(null);
  const press = useRef({ x: 0, y: 0, swipe: false, timer: 0 });

  const slides = useMemo(() => {
    const items = reviews.map((review) => {
      const words = review.quote.split(/\s+/).filter(Boolean);
      return { ...review, words, dur: clamp(MIN_MS, BASE_MS + words.length * PER_WORD_MS, MAX_MS) };
    });
    items.push({ closing: true, source: null, scene: closing.scene, dur: CLOSING_MS });
    return items;
  }, [reviews, closing]);
  const total = slides.length;

  // Barras de progreso agrupadas por plataforma (y el cierre, solo).
  const groups = useMemo(() => {
    const out = [];
    slides.forEach((slide, i) => {
      const last = out[out.length - 1];
      if (last && last.source === slide.source) last.items.push(i);
      else out.push({ source: slide.source, items: [i] });
    });
    return out;
  }, [slides]);
  const sources = groups.filter((group) => group.source);

  const [view, setView] = useState({ index: 0, prev: -1, run: 0 });
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [started, setStarted] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [hover, setHover] = useState(false);
  const [kbFocus, setKbFocus] = useState(false);
  const [holding, setHolding] = useState(false);

  const playing = !reduced && inView && !userPaused && !tabHidden && !hover && !kbFocus && !holding;

  const step = useCallback(
    (delta) =>
      setView((v) => ({ index: wrap(v.index + delta, total), prev: v.index, run: v.run + 1 })),
    [total],
  );
  const go = useCallback(
    (to) =>
      setView((v) => {
        const index = wrap(to, total);
        return index === v.index ? v : { index, prev: v.index, run: v.run + 1 };
      }),
    [total],
  );

  // Arranca recién cuando se ve: así la primera reseña se lee entera.
  useEffect(() => {
    const node = rootRef.current;
    if (!node || !("IntersectionObserver" in window)) {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inView) setStarted(true);
  }, [inView]);

  useEffect(() => {
    const update = () => setTabHidden(document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => () => window.clearTimeout(press.current.timer), []);

  const onPointerEnter = (event) => {
    if (event.pointerType === "mouse") setHover(true);
  };

  const onPointerLeave = (event) => {
    window.clearTimeout(press.current.timer);
    setHolding(false);
    if (event.pointerType === "mouse") setHover(false);
  };

  const onPointerDown = (event) => {
    if (event.target.closest("a, button, .reel__seg")) return;
    const p = press.current;
    p.x = event.clientX;
    p.y = event.clientY;
    p.swipe = event.pointerType !== "mouse";
    window.clearTimeout(p.timer);
    p.timer = window.setTimeout(() => setHolding(true), HOLD_MS);
  };

  const endPress = (event, cancelled) => {
    const p = press.current;
    window.clearTimeout(p.timer);
    setHolding(false);
    const swipe = p.swipe && !cancelled;
    p.swipe = false;
    if (!swipe) return;
    const dx = event.clientX - p.x;
    const dy = event.clientY - p.y;
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
  };

  const onKeyDown = (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowRight") step(1);
    else if (event.key === "ArrowLeft") step(-1);
    else if (event.key === "Home") go(0);
    else if (event.key === "End") go(total - 1);
    else return;
    event.preventDefault();
  };

  // Pausa por teclado, no por un clic de mouse sobre un botón.
  const onFocus = (event) => {
    let visible = true;
    try {
      visible = event.target.matches(":focus-visible");
    } catch {
      // Selector no soportado: se pausa igual.
    }
    if (visible) setKbFocus(true);
  };

  const onBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setKbFocus(false);
  };

  const { index, prev, run } = view;
  const current = slides[index];
  const near = new Set([index, prev, wrap(index + 1, total), wrap(index - 1, total)]);

  const renderSlide = (i, leaving) => {
    const slide = slides[i];
    return slide.closing ? (
      <ClosingSlide
        key={leaving ? `out-${run}` : `in-${run}`}
        closing={closing}
        position={i + 1}
        total={total}
        leaving={leaving}
      />
    ) : (
      <ReviewSlide
        key={leaving ? `out-${run}` : `in-${run}`}
        slide={slide}
        position={i + 1}
        total={total}
        leaving={leaving}
      />
    );
  };

  return (
    <div
      ref={rootRef}
      className="reel"
      data-reveal
      data-playing={playing}
      data-started={started}
      data-reduced={reduced || undefined}
      role="group"
      aria-roledescription="carousel"
      aria-label="Reseñas de huéspedes"
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <div
        className="reel__stage"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={(event) => endPress(event, false)}
        onPointerCancel={(event) => endPress(event, true)}
      >
        <div className="reel__scenes" aria-hidden="true">
          {slides.map((slide, i) =>
            near.has(i) ? (
              <Scene
                key={i}
                slide={slide}
                index={i}
                state={i === index ? "active" : i === prev ? "leaving" : "idle"}
              />
            ) : null,
          )}
        </div>

        {!reduced && <span key={`${run}-${started}`} className="reel__beam" aria-hidden="true" />}

        <div className="reel__top">
          <div className="reel__progress" aria-hidden="true">
            {groups.map((group) => (
              <div className="reel__group" key={group.items[0]} style={{ flexGrow: group.items.length }}>
                {group.items.map((i) => (
                  <span
                    key={i}
                    className={cls("reel__seg", i < index && "is-done", i === index && "is-current")}
                    onClick={() => go(i)}
                  >
                    <span className="reel__track">
                      {i === index && (
                        <i
                          key={run}
                          className="reel__fill"
                          style={{ animationDuration: `${slides[i].dur}ms` }}
                          onAnimationEnd={() => step(1)}
                        />
                      )}
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="reel__tools">
            <div className="reel__sources" role="group" aria-label="Plataformas">
              {sources.map((group) => (
                <button
                  type="button"
                  key={group.source}
                  className="reel__source"
                  aria-current={current.source === group.source ? "true" : undefined}
                  onClick={() => go(group.items[0])}
                >
                  {group.source}
                </button>
              ))}
            </div>
            {!reduced && (
              <button
                type="button"
                className="reel__btn"
                aria-label={userPaused ? "Reproducir reseñas" : "Pausar reseñas"}
                onClick={() => setUserPaused((paused) => !paused)}
              >
                <Icon name={userPaused ? "play" : "pause"} />
              </button>
            )}
          </div>
        </div>

        <div className="reel__slides" aria-live={playing ? "off" : "polite"} aria-atomic="true">
          {prev >= 0 && prev !== index && renderSlide(prev, true)}
          {renderSlide(index, false)}
        </div>

        <div className="reel__bar">
          <span className="reel__count" aria-hidden="true">
            {pad(index + 1)} <i>/</i> {pad(total)}
          </span>
          <div className="reel__nav">
            <button type="button" className="reel__btn" aria-label="Reseña anterior" onClick={() => step(-1)}>
              <Icon name="prev" />
            </button>
            <button type="button" className="reel__btn" aria-label="Reseña siguiente" onClick={() => step(1)}>
              <Icon name="next" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
