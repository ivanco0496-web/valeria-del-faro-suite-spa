import { useState } from "react";
import { hotel } from "./data/hotel.js";

// Formulario de consulta de la página de Contacto. No hay servidor que lo
// reciba: arma la consulta completa y la persona la envía por WhatsApp o email
// con un toque, así llega directo al hotel con todos los datos para responder.

// Capacidad máxima por habitación, que no se negocia.
const roomCapacity = { matrimonial: 4, doble: 2, presidencial: 4 };

function todayISO() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

function formatDate(iso) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

function nightsBetween(from, to) {
  return Math.round((new Date(to) - new Date(from)) / 86400000);
}

function nightsLabel(nights) {
  return `${nights} ${nights === 1 ? "noche" : "noches"}`;
}

const emptyRequest = {
  name: "",
  email: "",
  phone: "",
  arrival: "",
  departure: "",
  guests: "2",
  room: "",
  message: "",
  rules: false,
};

function validateRequest(data) {
  const errors = {};
  if (data.name.trim().length < 3) errors.name = "Escribí tu nombre y apellido.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = "Revisá el email.";
  if (data.phone.replace(/\D/g, "").length < 8) errors.phone = "Escribí un teléfono o WhatsApp.";
  if (!data.arrival) errors.arrival = "Elegí la fecha de llegada.";
  else if (data.arrival < todayISO()) errors.arrival = "La llegada no puede ser una fecha pasada.";
  if (!data.departure) errors.departure = "Elegí la fecha de salida.";
  else if (data.arrival && data.departure <= data.arrival) {
    errors.departure = "La salida tiene que ser después de la llegada.";
  }
  const max = roomCapacity[data.room];
  if (max && Number(data.guests) > max) {
    const room = hotel.rooms.find((item) => item.slug === data.room);
    errors.guests = `La ${room.name} admite hasta ${max} huéspedes. La capacidad no se negocia.`;
  }
  if (!data.rules) errors.rules = "Confirmá que leíste las reglas de la casa.";
  return errors;
}

function requestText(data) {
  const room = hotel.rooms.find((item) => item.slug === data.room);
  const nights = nightsBetween(data.arrival, data.departure);
  return [
    "Hola, quiero consultar disponibilidad en Valeria del Faro Suite & Spa.",
    "",
    `Nombre: ${data.name.trim()}`,
    `Llegada: ${formatDate(data.arrival)} · Salida: ${formatDate(data.departure)} (${nightsLabel(nights)})`,
    `Huéspedes: ${data.guests}`,
    `Habitación: ${room ? room.name : "Sin preferencia"}`,
    `Email: ${data.email.trim()} · Teléfono: ${data.phone.trim()}`,
    data.message.trim() ? `Mensaje: ${data.message.trim()}` : null,
    "",
    "Leí las reglas de la casa: solo mayores de 12 años, sin mascotas y capacidad máxima por habitación.",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

function RequestReady({ data, onEdit }) {
  const text = requestText(data);
  const nights = nightsBetween(data.arrival, data.departure);
  const room = hotel.rooms.find((item) => item.slug === data.room);
  const whatsappNumber = new URL(hotel.whatsappHref).searchParams.get("phone");
  const subject = `Consulta de disponibilidad · ${data.name.trim()}`;

  return (
    <div className="request-ready" role="status">
      <p className="request-ready__badge">Tu consulta está lista</p>
      <h3>Último paso: enviala al hotel.</h3>
      <p>
        Todavía no se envió. Tocá WhatsApp o email y se abre con todos tus datos
        escritos: solo tenés que mandarla.
      </p>
      <dl>
        <div>
          <dt>Fechas</dt>
          <dd>
            {formatDate(data.arrival)} al {formatDate(data.departure)} · {nightsLabel(nights)}
          </dd>
        </div>
        <div>
          <dt>Huéspedes</dt>
          <dd>{data.guests}</dd>
        </div>
        <div>
          <dt>Habitación</dt>
          <dd>{room ? room.name : "Sin preferencia"}</dd>
        </div>
      </dl>
      <div className="action-row">
        <a
          className="button button-primary"
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noreferrer"
        >
          Enviar por WhatsApp
        </a>
        <a
          className="button button-outline"
          href={`${hotel.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`}
        >
          Enviar por email
        </a>
      </div>
      <button className="text-link request-ready__edit" type="button" onClick={onEdit}>
        Modificar mis datos
      </button>
    </div>
  );
}

export function ReservationForm() {
  const [data, setData] = useState(emptyRequest);
  const [errors, setErrors] = useState({});
  const [ready, setReady] = useState(false);

  const update = (name) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const submit = (event) => {
    event.preventDefault();
    const found = validateRequest(data);
    setErrors(found);
    if (Object.keys(found).length === 0) setReady(true);
  };

  if (ready) return <RequestReady data={data} onEdit={() => setReady(false)} />;

  const field = (name) => ({
    id: `consulta-${name}`,
    name,
    "aria-invalid": errors[name] ? "true" : undefined,
    "aria-describedby": errors[name] ? `consulta-${name}-error` : undefined,
  });
  const error = (name) =>
    errors[name] ? (
      <span className="request-form__error" id={`consulta-${name}-error`}>
        {errors[name]}
      </span>
    ) : null;

  return (
    <form className="request-form" onSubmit={submit} noValidate>
      <label className="request-form__wide">
        <span>Nombre y apellido</span>
        <input {...field("name")} value={data.name} onChange={update("name")} autoComplete="name" />
        {error("name")}
      </label>
      <label>
        <span>Email</span>
        <input {...field("email")} type="email" value={data.email} onChange={update("email")} autoComplete="email" />
        {error("email")}
      </label>
      <label>
        <span>Teléfono o WhatsApp</span>
        <input {...field("phone")} type="tel" value={data.phone} onChange={update("phone")} autoComplete="tel" />
        {error("phone")}
      </label>
      <label>
        <span>Llegada</span>
        <input {...field("arrival")} type="date" min={todayISO()} value={data.arrival} onChange={update("arrival")} />
        {error("arrival")}
      </label>
      <label>
        <span>Salida</span>
        <input
          {...field("departure")}
          type="date"
          min={data.arrival || todayISO()}
          value={data.departure}
          onChange={update("departure")}
        />
        {error("departure")}
      </label>
      <label>
        <span>Huéspedes</span>
        <select {...field("guests")} value={data.guests} onChange={update("guests")}>
          {["1", "2", "3", "4"].map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
        {error("guests")}
      </label>
      <label>
        <span>Habitación</span>
        <select {...field("room")} value={data.room} onChange={update("room")}>
          <option value="">Sin preferencia</option>
          {hotel.rooms.map((room) => (
            <option key={room.slug} value={room.slug}>
              {room.name} · {room.capacity}
            </option>
          ))}
        </select>
      </label>
      <p className="request-form__hint request-form__wide">
        ¿Son más de 4? Contanos en el mensaje cuántas habitaciones necesitan.
      </p>
      <label className="request-form__wide">
        <span>Mensaje (opcional)</span>
        <textarea {...field("message")} rows="3" value={data.message} onChange={update("message")} />
      </label>
      <label className="request-form__check request-form__wide">
        <input {...field("rules")} type="checkbox" checked={data.rules} onChange={update("rules")} />
        <span>
          Leí las reglas de la casa: solo mayores de 12 años, sin mascotas y
          capacidad máxima por habitación.
        </span>
        {error("rules")}
      </label>
      <button className="button button-primary request-form__wide" type="submit">
        Preparar mi consulta
      </button>
    </form>
  );
}

export function ReservationSteps() {
  const steps = [
    ["Completás tus datos", "Fechas, huéspedes y la habitación que te interesa."],
    ["La enviás al hotel", "Por WhatsApp o email, con un toque y todo ya escrito."],
    ["Te respondemos", "Con la disponibilidad y la tarifa para tus fechas."],
    ["Confirmás la reserva", "Siguiendo las indicaciones que te pasa el hotel."],
  ];

  return (
    <div className="request-steps">
      <p className="overline">Cómo sigue tu reserva</p>
      <ol>
        {steps.map(([title, text]) => (
          <li key={title}>
            <strong>{title}</strong>
            <span>{text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

const contactIcons = {
  whatsapp: (
    <path d="M4 20l1.3-3.9A8 8 0 1 1 8 18.7L4 20Zm5-11.5c.3 2.8 2.7 5.2 5.5 5.5l1.2-1.4-2-1-1 .8a4 4 0 0 1-2.1-2.1l.8-1-1-2L9 8.5Z" />
  ),
  phone: (
    <path d="M5 4h3l2 5-2.2 1.3a11 11 0 0 0 5.9 5.9L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
};

export function ContactCards() {
  const cards = [
    {
      icon: "whatsapp",
      label: "WhatsApp",
      value: "La respuesta más rápida",
      href: hotel.whatsappHref,
      external: true,
      main: true,
    },
    { icon: "phone", label: "Teléfono", value: hotel.phone, href: hotel.phoneHref },
    { icon: "mail", label: "Email", value: hotel.email, href: hotel.emailHref },
    {
      icon: "pin",
      label: "Dirección",
      value: hotel.addressShort,
      href: hotel.mapsHref,
      external: true,
      cta: "Cómo llegar",
    },
  ];

  return (
    <div className="contact-cards">
      {cards.map((card) => (
        <a
          key={card.label}
          className={card.main ? "contact-card is-main" : "contact-card"}
          href={card.href}
          target={card.external ? "_blank" : undefined}
          rel={card.external ? "noreferrer" : undefined}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {contactIcons[card.icon]}
          </svg>
          <span>
            <small>{card.label}</small>
            <strong>{card.value}</strong>
            {card.cta && <em>{card.cta} →</em>}
          </span>
        </a>
      ))}
    </div>
  );
}
