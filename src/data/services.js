import dumpTrailer from "../assets/DumpTrailer.webp";
import enclosedTrailer from "../assets/EnclosedTrailer.webp";
import flatbedTrailer from "../assets/FlatbedTrailer.webp";
import utilityTrailer from "../assets/utility-trailer.webp";
import carHauler from "../assets/traillerparacarros.webp";

/* -------------------------------------------------------------------------- */
/* FAGU service catalog                                                       */
/* -------------------------------------------------------------------------- */
/* Each category powers:                                                      */
/*   - the home carousel (image + short pitch + "Learn more" link)            */
/*   - a dedicated route at /services/:slug rendered by ServicePage           */
/*                                                                            */
/* Dump Trailer is the MVP focus (12-18 ft) and links to the booking flow.    */
/* The other categories are presented as upcoming services.                   */
/* -------------------------------------------------------------------------- */

export const SERVICES = [
  {
    slug: "dump-trailer",
    name: "Dump Trailer",
    image: dumpTrailer,
    badge: "MVP — Available now",
    available: true,
    tagline: "Roofing tear-offs, construction debris and full cleanouts.",
    short:
      "12 to 18 ft hydraulic dump trailers — the most-used range for roofing crews and contractors. Online booking, day-before delivery and pickup included.",
    sizes: ["12 ft", "14 ft", "16 ft", "18 ft"],
    startingPrice: 350,
    bestFor: [
      "Roofing tear-offs",
      "Construction & renovation debris",
      "Yard waste, brush and lot clearing",
      "Full property cleanouts",
    ],
    specs: [
      { label: "Width", value: "7 ft" },
      { label: "Length", value: "12 – 18 ft" },
      { label: "Height", value: "4 ft sides" },
      { label: "Hitch", value: "2-5/16 in ball" },
      { label: "Electrical", value: "7-pin plug" },
      { label: "Lift", value: "Hydraulic" },
    ],
    highlights: [
      "Same-day quote, day-before delivery",
      "Prepaid reservations — your date is locked in",
      "50% off your second trailer for the same job site",
      "Disposal/dump fees billed separately",
    ],
    primaryCta: { label: "Book a Dump Trailer", href: "/services/dump-trailer#booking" },
    secondaryCta: { label: "See sizes & pricing", href: "/services/dump-trailer#trailers" },
  },
  {
    slug: "enclosed-trailer",
    name: "Enclosed Trailer",
    image: enclosedTrailer,
    badge: "Coming soon",
    available: false,
    tagline: "Secure, weather-proof transport for tools and gear.",
    short:
      "Fully-enclosed trailers for contractors, mobile workshops, event crews and anyone who needs to move equipment safely and out of the weather.",
    sizes: ['6×12', '7×14', '8.5×16', '8.5×20'],
    startingPrice: null,
    bestFor: [
      "Contractor mobile workshops",
      "Tool & equipment transport",
      "Event/road crew gear",
      "Long-distance moves",
    ],
    specs: [
      { label: "Widths", value: "6 – 8.5 ft" },
      { label: "Lengths", value: "12 – 24 ft" },
      { label: "Doors", value: "Rear ramp + side" },
      { label: "Interior", value: "Lined / lit" },
      { label: "Tie-downs", value: "D-rings included" },
      { label: "Lock", value: "Heavy-duty latch" },
    ],
    highlights: [
      "Weather-proof and lockable",
      "Multiple lengths to fit any payload",
      "Optional cargo organization kit",
      "Insurance-friendly transport",
    ],
    primaryCta: { label: "Get on the waitlist", href: "/partner/customer" },
    secondaryCta: { label: "Back to all services", href: "/#services" },
  },
  {
    slug: "flatbed-trailer",
    name: "Flatbed Trailer",
    image: flatbedTrailer,
    badge: "Coming soon",
    available: false,
    tagline: "Open-deck hauling for oversized and odd-shaped loads.",
    short:
      "Heavy-duty flatbeds for moving lumber, steel, machinery, pallets and anything that doesn't fit in a closed trailer.",
    sizes: ["16 ft", "20 ft", "24 ft", "30 ft gooseneck"],
    startingPrice: null,
    bestFor: [
      "Lumber, steel and pipe",
      "Pallets and bulk material",
      "Compact equipment",
      "Oversized commercial freight",
    ],
    specs: [
      { label: "Lengths", value: "16 – 30 ft" },
      { label: "Deck", value: "Pressure-treated wood" },
      { label: "Capacity", value: "Up to 14k lbs" },
      { label: "Hitch", value: "Bumper or gooseneck" },
      { label: "Tie-downs", value: "Stake pockets + rub rail" },
      { label: "Ramps", value: "Slide-out optional" },
    ],
    highlights: [
      "Easy load from any side",
      "High payload capacity",
      "Available with goose-neck for big rigs",
      "Tarp / strap kits available",
    ],
    primaryCta: { label: "Get on the waitlist", href: "/partner/customer" },
    secondaryCta: { label: "Back to all services", href: "/#services" },
  },
  {
    slug: "utility-trailer",
    name: "Utility Trailer",
    image: utilityTrailer,
    badge: "Coming soon",
    available: false,
    tagline: "Lightweight everyday hauling for homeowners and small crews.",
    short:
      "Open utility trailers built for landscaping, deliveries, small moves and weekend projects. Easy to tow with a regular SUV or pickup.",
    sizes: ["5×8", "6×10", "6×12", "7×14"],
    startingPrice: null,
    bestFor: [
      "Landscaping and lawn equipment",
      "Furniture and appliance moves",
      "ATV / motorcycle transport",
      "Yard waste runs",
    ],
    specs: [
      { label: "Widths", value: "5 – 7 ft" },
      { label: "Lengths", value: "8 – 14 ft" },
      { label: "Sides", value: "Mesh or solid" },
      { label: "Ramp", value: "Fold-up gate" },
      { label: "Hitch", value: "2 in ball" },
      { label: "Electrical", value: "4-pin plug" },
    ],
    highlights: [
      "Tows behind most SUVs and pickups",
      "Fast loading with fold-down gate",
      "Affordable daily rates",
      "Perfect for weekend projects",
    ],
    primaryCta: { label: "Get on the waitlist", href: "/partner/customer" },
    secondaryCta: { label: "Back to all services", href: "/#services" },
  },
  {
    slug: "car-hauler",
    name: "Car Hauler",
    image: carHauler,
    badge: "Coming soon",
    available: false,
    tagline: "Built for cars, trucks and powersports — load with confidence.",
    short:
      "Open and tilt-deck car haulers for dealerships, mechanics, towing operators and enthusiasts moving vehicles between sites.",
    sizes: ["18 ft", "20 ft", "22 ft", "24 ft"],
    startingPrice: null,
    bestFor: [
      "Vehicle transport for dealerships",
      "Towing & roadside operators",
      "Auction & private buyers",
      "Track day & event hauling",
    ],
    specs: [
      { label: "Lengths", value: "18 – 24 ft" },
      { label: "Capacity", value: "Up to 10k lbs" },
      { label: "Loading", value: "Slide-in or tilt-deck" },
      { label: "Tie-downs", value: "Wheel straps included" },
      { label: "Winch", value: "Optional" },
      { label: "Brakes", value: "Electric on both axles" },
    ],
    highlights: [
      "Smooth low-angle loading",
      "Heavy-duty straps and chains",
      "Fits most full-size vehicles",
      "Optional winch for non-running cars",
    ],
    primaryCta: { label: "Get on the waitlist", href: "/partner/customer" },
    secondaryCta: { label: "Back to all services", href: "/#services" },
  },
];

export const findService = (slug) =>
  SERVICES.find((s) => s.slug === slug) ?? null;
