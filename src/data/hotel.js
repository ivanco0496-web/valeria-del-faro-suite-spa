export const hotel = {
  name: "Valeria del Faro",
  descriptor: "Suite & Spa",
  fullName: "Valeria del Faro Suite & Spa",
  location: "Valeria del Mar, Buenos Aires, Argentina",
  address: "Corbeta Cefiro 42, Valeria del Mar, Provincia de Buenos Aires, Argentina",
  addressShort: "Corbeta Cefiro 42, Valeria del Mar",
  phone: "+54 2254 51 3191",
  phoneHref: "tel:+542254513191",
  email: "valeriadelfarohotel@gmail.com",
  emailHref: "mailto:valeriadelfarohotel@gmail.com",
  website: "https://www.valeriadelfarosuiteyspa.com/",
  // El mapa busca al hotel por su nombre en Google Maps: buscando solo la
  // dirección, Google marcaba la calle y no mostraba el hotel.
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Hotel%20Valeria%20Del%20Faro%20Suite%20%26%20SPA%20Valeria%20del%20Mar",
  mapsEmbedSrc:
    "https://www.google.com/maps?q=Hotel%20Valeria%20Del%20Faro%20Suite%20%26%20SPA%20Valeria%20del%20Mar&output=embed",
  whatsappHref:
    "https://api.whatsapp.com/send?phone=5491136422333&text=Hotel%20Valeria%20del%20Faro%3A%20Por%20favor%20ingrese%20Nombre%20y%20apellido%2C%20Email%2C%20cant%20de%20personas%2C%20fecha%20de%20reserva%2C%20y%20mensaje%3A%20Gracias",
  instagram: "https://www.instagram.com/hotelvaleriadelfaro/",
  youtube: "https://www.youtube.com/@ValeriaDelFaroSuiteSpa",
  concept:
    "Un hotel familiar pensado para descansar, relajarse y vivir la costa con una experiencia de spa.",
  history:
    "Somos una empresa familiar. Empezamos este proyecto en 2013, enamorados de este lugar, y en 2024 pudimos darle forma a este sueño con mucho trabajo y empuje.",
  promise: "A solo 30 pasos de la playa",
  // Cada habitación tiene su propio equipo de Wi-Fi (el disco del techo).
  wifi: {
    title: "Wi‑Fi propio en la habitación",
    text: "Cada habitación tiene su propio equipo de Wi‑Fi: no compartís la señal con el resto del hotel.",
  },
  valuePoints: [
    "A solo 30 pasos de la playa",
    "Acceso por rampa a la playa",
    "Estacionamiento propio, cubierto y descubierto",
  ],
  distances: [
    { place: "Centro comercial de Valeria", distance: "6 cuadras" },
    { place: "Cariló", distance: "3 km" },
    { place: "Pinamar", distance: "5 km" },
  ],
  rooms: [
    {
      slug: "matrimonial",
      path: "/servicios/habitaciones/matrimonial",
      name: "Matrimonial",
      meta: "36 m² · King · Vista al frente",
      orientation: "Al frente",
      capacity: "2 huéspedes · las cuádruples, hasta 4",
      tally: { value: "10", label: "matrimoniales", detail: "Cama King · al frente" },
      count: "10 habitaciones matrimoniales",
      youtubeId: "822ehOE3uj4",
      // Videos y fotos propios, cortados de las filmaciones del hotel.
      heroVideo: "matrimonial-hero",
      clips: [
        { label: "Ambiente", text: "Luz natural y ventanal al frente.", video: "matrimonial-ambiente", photo: "matrimonial-ambiente" },
        { label: "Dormitorio", text: "Cama King con blanquería del hotel.", video: "matrimonial-dormitorio", photo: "matrimonial-dormitorio" },
        { label: "Balcón", text: "Médanos y mar desde el balcón.", video: "matrimonial-balcon", photo: "matrimonial-balcon" },
        { label: "Vista al mar", text: "La costa desde la ventana.", video: "matrimonial-vista", photo: "matrimonial-vista" },
        { label: "Baño", text: "Baño completo con ducha.", video: "matrimonial-bano", photo: "matrimonial-bano" },
        { label: "Detalles", text: "Lámparas de lectura y toallas bordadas.", video: "matrimonial-detalles", photo: "matrimonial-detalle" },
      ],
      photos: [
        { name: "matrimonial-galeria-1", caption: "Cama y ventanal al frente" },
        { name: "matrimonial-galeria-2", caption: "Bacha, microondas y frigobar" },
        { name: "matrimonial-galeria-4", caption: "Cortina divisoria y mesa" },
        { name: "matrimonial-galeria-3", caption: "Amenities en la ducha" },
      ],
      description:
        "Habitaciones con cama King y vista al frente. Ocho, ubicadas en el primer y segundo piso, son cuádruples e incluyen un sofá cama con carrito.",
      details: [
        "36 m²",
        "Cama King de 1,80 × 2,00 m",
        "Dos equipos de aire acondicionado",
        "Smart TV de 50 pulgadas",
        "Wi‑Fi propio: equipo dedicado en la habitación",
        "Frigobar",
        "Caja de seguridad",
        "Secador de pelo",
      ],
    },
    {
      slug: "doble",
      path: "/servicios/habitaciones/doble",
      name: "Doble",
      meta: "36 m² · Dos sommieres · Convertible a King",
      orientation: "Contrafrente",
      capacity: "2 huéspedes",
      seaView: {
        label: "Vista al mar según disponibilidad",
        text: "Solo algunas habitaciones dobles tienen vista al mar. No se garantiza al reservar: se asigna según disponibilidad. Consultanos antes de confirmar.",
      },
      tally: { value: "6", label: "dobles", detail: "Dos camas · contrafrente" },
      count: "6 habitaciones de dos camas individuales",
      youtubeId: "ye1ZfmH5NIY",
      heroVideo: "doble-hero",
      clips: [
        { label: "Dormitorio", text: "Dos camas sommier individuales.", video: "doble-dormitorio", photo: "doble-dormitorio" },
        { label: "Dos camas", text: "Se pueden unir para formar una King, junto a la ventana esquinera.", video: "doble-camas", photo: "doble-camas" },
        { label: "Baño", text: "Baño completo con ducha.", video: "doble-bano", photo: "doble-bano" },
        { label: "Detalles", text: "Amenities y toallas del hotel.", video: "doble-detalles", photo: "doble-detalle" },
        { label: "Habitación adaptada", text: "Una del primer piso, con barrales y ducha accesible.", video: "doble-adaptada", photo: "doble-adaptada" },
      ],
      photos: [
        { name: "doble-galeria-2", caption: "Ventana esquinera, en las dobles con vista al mar" },
        { name: "doble-galeria-1", caption: "Estar con TV" },
        { name: "doble-galeria-3", caption: "Baño completo" },
        { name: "doble-galeria-4", caption: "Baño de la habitación adaptada" },
      ],
      description:
        "Ubicadas en el contrafrente, con dos camas individuales sommier que pueden unirse para formar una cama matrimonial King.",
      details: [
        "36 m²",
        "Dos sommieres de 0,90 × 2,00 m, que unidos forman una King de 1,80 × 2,00 m",
        "Aire acondicionado",
        "Smart TV de 50 pulgadas",
        "Wi‑Fi propio: equipo dedicado en la habitación",
        "Frigobar",
        "Caja de seguridad",
        "Secador de pelo",
      ],
      note:
        "Una habitación del primer piso está adaptada para personas con movilidad reducida.",
    },
    {
      slug: "presidencial",
      path: "/servicios/habitaciones/presidencial",
      name: "Suite Presidencial",
      meta: "Vista directa al mar · 4.º piso · Hasta 4 huéspedes",
      orientation: "Vista directa al mar",
      capacity: "Hasta 4 huéspedes",
      scarce: true,
      tally: { value: "1", label: "suite", detail: "Única con vista directa al mar" },
      count: "Acceso privado mediante ascensor",
      youtubeId: "GkKurmulalE",
      heroVideo: "suite-hero",
      clips: [
        { label: "Dormitorio", text: "Cama King bajo las claraboyas.", video: "suite-dormitorio", photo: "suite-dormitorio" },
        { label: "Área de estar", text: "Dos sillones y mesa ratona.", video: "suite-estar", photo: "suite-estar" },
        { label: "Claraboyas", text: "Cielo abierto sobre la suite.", video: "suite-claraboyas", photo: "suite-claraboya" },
        { label: "Ducha escocesa", text: "Baño con ducha escocesa.", video: "suite-ducha", photo: "suite-ducha" },
        { label: "Vestidor", text: "Vestidor con percheros.", video: "suite-vestidor", photo: "suite-detalle" },
        { label: "Baño", text: "Doble bacha bajo la claraboya.", video: "suite-bano", photo: "suite-bano" },
      ],
      photos: [
        { name: "suite-panoramica", caption: "La suite completa" },
        { name: "suite-galeria-1", caption: "Estar y comedor" },
        { name: "suite-galeria-4", caption: "Office bajo la claraboya" },
        { name: "suite-galeria-2", caption: "Baño de la suite" },
      ],
      description:
        "Una suite exclusiva con vista directa al mar, cama King, área de estar con dos sillones, mesa ratona y sofá cama con carrito.",
      details: [
        "Cama King de 1,80 × 2,00 m y sofá cama con carrito",
        "Área de estar con dos sillones y mesa ratona",
        "Wi‑Fi propio: equipo dedicado en la habitación",
        "Aire acondicionado",
        "Frigobar",
        "Caja de seguridad",
        "Vestidor",
        "Ducha escocesa",
        "Secador de pelo",
      ],
      featured: true,
    },
  ],
  spaYoutubeId: "qIvASln30qI",
  // Pool and sauna shots inside the "Servicios" video (horizontal).
  spaVideoReel: [[14, 17], [20, 24]],
  // Vertical "Circuito Spa Pareja" short: one fragment per spa space.
  spaCircuitYoutubeId: "qrTuEjDr19k",
  spaMoments: [
    { label: "Piscina de hidromasaje", text: "Climatizada y cubierta, bajo galería de vidrio.", start: 30, end: 36 },
    { label: "Cascada", text: "Hidromasajes en las paredes de la piscina.", start: 39, end: 45 },
    { label: "Sauna seco", text: "Sauna seco revestido en madera.", start: 12, end: 18 },
    { label: "Sauna húmedo", text: "Vapor para completar el circuito.", start: 21, end: 27 },
    { label: "Batas y vestuarios", text: "Vestuarios con duchas, batas y toallones.", start: 6, end: 10 },
  ],
  pools: [
    {
      name: "Piscina de hidromasaje",
      meta: "Climatizada · cubierta",
      description:
        "La pileta más grande del circuito, bajo una galería de vidrio con hidromasajes en las paredes. Disponible todo el año.",
    },
    {
      name: "Piscina de agua fría",
      meta: "Cubierta",
      description:
        "Un tramo de agua fría para completar el contraste después del sauna o el hidromasaje.",
    },
    {
      name: "Piscina exterior",
      meta: "Una sola · templada · temporada alta",
      description:
        "Es la única piscina exterior del hotel: de agua templada y abierta solo durante la temporada alta de verano.",
    },
  ],
  accessibleRoomYoutubeId: "ajfkw0uQh3s",
  spa: [
    "Piscina de hidromasaje climatizada y cubierta",
    "Piscina de agua fría cubierta",
    "Sauna seco",
    "Sauna húmedo",
    "Vestuarios con duchas, batas y toallones",
    "Masajes con reserva previa",
    "Una piscina exterior templada, solo en temporada alta",
  ],
  breakfast: {
    time: "08:30 a 10:30 hs",
    place: "Planta Baja",
    items: [
      "Café con leche o té",
      "Tostadas y medialunas",
      "Tostados de arroz",
      "Mermelada, queso crema y manteca",
      "Galletitas caseras y cereales",
      "Jugo de naranja",
      "Yogur de frutilla y vainilla",
      "Huevos revueltos",
    ],
  },
  services: [
    "Wi‑Fi propio en cada habitación, con su propio equipo",
    "Wi‑Fi en lobby y áreas comunes",
    "Frigobar, pava eléctrica y caja de seguridad codificada",
    "TV Android de 50 pulgadas en habitaciones",
    "TV Android de 70 pulgadas en lobby",
    "Estacionamiento propio, cubierto y descubierto",
    "Acceso por rampa a la playa",
    "Espacio cardio protegido",
    "Red de incendio en todo el edificio",
    "Gimnasio",
    "Bar junto a la piscina",
  ],
  // Reglas de la casa. Las tres primeras son condiciones firmes y se
  // repiten en el inicio, en habitaciones y en contacto.
  policies: [
    {
      title: "Solo mayores de 12 años",
      text: "El hotel hospeda únicamente a huéspedes mayores de 12 años. No es una preferencia: no se alojan menores de esa edad. La reserva debe hacerla un huésped mayor de 18.",
      firm: true,
    },
    {
      title: "No se aceptan mascotas",
      text: "El hotel no recibe mascotas de ningún tipo ni tamaño, en ninguna habitación ni en áreas comunes.",
      firm: true,
    },
    {
      title: "Capacidad máxima por habitación",
      text: "La cantidad de personas por habitación no se negocia: se reserva por la capacidad máxima de cada habitación y no se admiten huéspedes adicionales.",
      firm: true,
    },
    {
      title: "Check‑in / Check‑out",
      text: "Entrada de 15:00 a 18:00 hs. Salida de 8:00 a 11:00 hs.",
    },
    {
      title: "Acceso al spa",
      text: "El circuito de spa está reservado a huéspedes mayores de 18 años.",
    },
  ],
  ratings: [
    {
      source: "Booking.com",
      score: "9,3",
      label: "Fantástico",
      count: 14,
      url: "https://www.booking.com/hotel/ar/valeria-del-faro-suite-amp-spa.es.html",
    },
    {
      source: "Hoteles.com",
      score: "9,4",
      label: "Excepcional",
      count: 14,
      url: "https://ar.hoteles.com/ho3422458848/",
    },
    {
      source: "Google",
      score: "5,0",
      label: "Excelente",
      count: 132,
      url: "https://www.google.com/maps/search/?api=1&query=Hotel%20Valeria%20Del%20Faro%20Suite%20%26%20SPA%20Valeria%20del%20Mar",
    },
  ],
  testimonials: [
    {
      quote:
        "En general me gustó todo, comenzando con la atención: los dueños muy agradables, correctos y respetuosos. La habitación muy confortable y la buena atención de las trabajadoras del hotel. En fin, todo muy lindo.",
      author: "Dahiana",
      origin: "Paraguay",
    },
    {
      quote:
        "El hotel es nuevo, impecable, excelente ubicación y hermosas instalaciones. Incluida la pileta y el jacuzzi. A media cuadra de la playa. Las habitaciones luminosas y amplias. El cuidado de los dueños por cada detalle y muy atentos.",
      author: "Graciela",
      origin: "Argentina",
    },
    {
      quote:
        "La ubicación es excelente, a pasos de la playa. Las instalaciones son muy buenas: el spa, la pileta exterior, el mobiliario, la decoración. La atención del personal fue muy amable.",
      author: "Andrea",
      origin: "Argentina",
    },
    {
      quote:
        "Hermosas y muy cuidadas las instalaciones. Está atendida por los dueños y eso marca la diferencia. Excelente trato de ellos y de todo el personal.",
      author: "Luis",
      origin: "Argentina",
    },
  ],
  accessibility: [
    "Ascensor con puerta de 117 cm de ancho",
    "Estacionamiento con lugar reservado para personas con discapacidad",
    "Rampa en la entrada principal y en el acceso a la playa",
    "Baño público y piscina con acceso para silla de ruedas",
    "Alarmas visuales en los pasillos",
    "Habitación del primer piso adaptada para movilidad reducida",
  ],
  nearby: {
    restaurants: [
      { name: "Tamarisco", distance: "20 m" },
      { name: "Tío Enrique", distance: "450 m" },
      { name: "Il Comendatore Benito Duante", distance: "700 m" },
    ],
    beaches: [
      { name: "Playa Valeria del Mar", distance: "0,1 km · 1 min a pie" },
      { name: "Playa Cariló", distance: "1 km · 11 min a pie" },
      { name: "Playa Pinamar", distance: "5,3 km · 10 min en auto" },
    ],
  },
  spaRitual: {
    duration: "60 a 90 minutos",
    rounds: [
      {
        title: "Ronda 1 — Preparación",
        steps: [
          "Ducha tibia (2 min)",
          "Sauna seco finlandés (8 a 10 min)",
          "Piscina de agua fría (30 seg a 1 min)",
          "Descanso (5 min)",
        ],
      },
      {
        title: "Ronda 2 — Limpieza profunda",
        steps: [
          "Sauna húmedo / hammam (8 a 10 min)",
          "Piscina de agua fría (30 seg a 1 min)",
          "Piscina con hidromasaje (10 a 15 min)",
          "Descanso (5 min)",
        ],
      },
      {
        title: "Ronda 3 — Opcional",
        steps: [
          "Repetir sauna seco o húmedo, solo recomendado sin afecciones cardíacas ni presión alta",
        ],
      },
    ],
    healthNote:
      "Se recomienda a huéspedes con fiebre, presión arterial no controlada, embarazo o problemas cardíacos consultar a su médico antes de usar el spa. Se aconseja hidratarse antes, durante y después, y no ingresar con el estómago completamente lleno o vacío.",
  },
  activities: [
    "Cabalgatas al amanecer en la playa",
    "Excursión al Faro Querandí",
    "Alquiler de cuatriciclos por la playa",
    "Bicicletas y caminatas por Pinamar y Ostende",
    "Tirolesa, paintball, arco y flecha y mini cuatriciclos",
    "Cine, teatro y actividades culturales",
  ],
  promotion: {
    // Para apagarla, poner enabled en false. Textos editables acá.
    enabled: true,
    title: "Promoción especial",
    lines: ["Reservá 3 noches y pagás 2.", "Quedate 5 noches y pagás 4."],
    note: "Consultá vigencia y disponibilidad por WhatsApp.",
  },
};
