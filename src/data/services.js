import dumpTrailer from "../assets/banner.png";
import enclosedTrailer from "../assets/EnclosedTrailer.webp";
import flatbedTrailer from "../assets/FlatbedTrailer.webp";
import utilityTrailer from "../assets/utility-trailer.webp";
import carHauler from "../assets/traillerparacarros.webp";
import cargoTrailer from "../assets/CargoTrailer.webp";
import boxTrailer from "../assets/BoxTrailer.webp";
import motorcycleTrailer from "../assets/Motorcycletrailler.webp";
import horseTrailer from "../assets/HorseTrailer4.webp";
import towTrailer from "../assets/TowTrailer.webp";
import boatTrailer from "../assets/boat-trailer.webp";

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
      "12 to 20 ft hydraulic dump trailers, the most-used range for roofing crews and contractors. Online booking, day-before delivery and pickup included.",
    sizes: ["12 ft", "14 ft", "16 ft", "18 ft", "20 ft"],
    startingPrice: 350,
    bestFor: [
      "Roofing tear-offs",
      "Construction & renovation debris",
      "Yard waste, brush and lot clearing",
      "Full property cleanouts",
    ],
    specs: [
      { label: "Width", value: "7 ft" },
      { label: "Length", value: "12 – 20 ft" },
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
  {
    slug: "cargo-trailer",
    name: "Cargo Trailer",
    image: cargoTrailer,
    badge: "Coming soon",
    available: false,
    tagline: "Flexible enclosed hauling for business and personal loads.",
    short:
      "Cargo trailers for deliveries, mobile operations and secure moves. Balanced for daily use with practical loading and lockable storage.",
    sizes: ["6×10", "6×12", "7×14", "8.5×16"],
    startingPrice: null,
    bestFor: [
      "Business deliveries",
      "Moving equipment and inventory",
      "Mobile service crews",
      "Weekend relocation jobs",
    ],
    specs: [
      { label: "Widths", value: "6 – 8.5 ft" },
      { label: "Lengths", value: "10 – 16 ft" },
      { label: "Axles", value: "Single / tandem" },
      { label: "Doors", value: "Rear ramp + side entry" },
      { label: "Security", value: "Lock-ready hardware" },
      { label: "Electrical", value: "7-pin plug" },
    ],
    highlights: [
      "Secure and weather-resistant transport",
      "Versatile for business or household use",
      "Smooth towing and stable handling",
      "Easy access with ramp + side door",
    ],
    primaryCta: { label: "Get on the waitlist", href: "/partner/customer" },
    secondaryCta: { label: "Back to all services", href: "/#services" },
  },
  {
    slug: "box-trailer",
    name: "Box Trailer",
    image: boxTrailer,
    badge: "Coming soon",
    available: false,
    tagline: "Compact enclosed option for secure daily hauling.",
    short:
      "Box trailers for teams that need a tighter footprint while keeping tools and cargo protected from weather and theft.",
    sizes: ["5×8", "6×10", "6×12"],
    startingPrice: null,
    bestFor: [
      "Small contractor crews",
      "Tool and parts transport",
      "Urban deliveries",
      "Homeowner project runs",
    ],
    specs: [
      { label: "Widths", value: "5 – 6 ft" },
      { label: "Lengths", value: "8 – 12 ft" },
      { label: "Hitch", value: "2 in ball" },
      { label: "Door", value: "Rear ramp / barn doors" },
      { label: "Interior", value: "Dry enclosed bay" },
      { label: "Electrical", value: "4 or 7-pin" },
    ],
    highlights: [
      "Compact and easy to maneuver",
      "Secure enclosed storage on the move",
      "Ideal for lighter recurring jobs",
      "Simple loading and unloading",
    ],
    primaryCta: { label: "Get on the waitlist", href: "/partner/customer" },
    secondaryCta: { label: "Back to all services", href: "/#services" },
  },
  {
    slug: "motorcycle-trailer",
    name: "Motorcycle Trailer",
    image: motorcycleTrailer,
    badge: "Coming soon",
    available: false,
    tagline: "Purpose-built transport for bikes, safely strapped and stable.",
    short:
      "Motorcycle trailers designed for one or multiple bikes with secure tie-down geometry and easy loading ramps.",
    sizes: ["Single bike", "2-bike", "3-bike", "4-bike"],
    startingPrice: null,
    bestFor: [
      "Track-day transport",
      "Dealership pickups",
      "Private bike moves",
      "Event and rally logistics",
    ],
    specs: [
      { label: "Capacity", value: "1 – 4 motorcycles" },
      { label: "Loading", value: "Low-angle rear ramp" },
      { label: "Tie-downs", value: "Integrated anchor points" },
      { label: "Wheel chock", value: "Optional / configurable" },
      { label: "Hitch", value: "2 in ball" },
      { label: "Electrical", value: "4-pin plug" },
    ],
    highlights: [
      "Stable platform for bike transport",
      "Fast loading with low ramp angle",
      "Multiple tie-down positions",
      "Great for enthusiasts and shops",
    ],
    primaryCta: { label: "Get on the waitlist", href: "/partner/customer" },
    secondaryCta: { label: "Back to all services", href: "/#services" },
  },
  {
    slug: "horse-trailer",
    name: "Horse Trailer",
    image: horseTrailer,
    badge: "Coming soon",
    available: false,
    tagline: "Comfort-oriented equine transport with practical safety features.",
    short:
      "Horse trailers with proper ventilation, partitions and stable ride behavior for safe transport between barns, events and clinics.",
    sizes: ["2-horse", "3-horse", "4-horse"],
    startingPrice: null,
    bestFor: [
      "Barn-to-event transport",
      "Training and clinic trips",
      "Breeding and boarding logistics",
      "Regional equestrian moves",
    ],
    specs: [
      { label: "Capacity", value: "2 – 4 horses" },
      { label: "Layout", value: "Straight / slant load" },
      { label: "Ventilation", value: "Side vents + roof flow" },
      { label: "Flooring", value: "Non-slip reinforced" },
      { label: "Hitch", value: "Bumper / gooseneck" },
      { label: "Brakes", value: "Electric on both axles" },
    ],
    highlights: [
      "Animal-focused safety design",
      "Ventilated and comfortable interior",
      "Stable towing at highway speeds",
      "Ready for event-day logistics",
    ],
    primaryCta: { label: "Get on the waitlist", href: "/partner/customer" },
    secondaryCta: { label: "Back to all services", href: "/#services" },
  },
  {
    slug: "tow-trailer",
    name: "Tow Trailer",
    image: towTrailer,
    badge: "Coming soon",
    available: false,
    tagline: "Heavy-duty platform for recoveries and multi-use towing jobs.",
    short:
      "Tow-focused trailers for operators and service teams that need dependable structure, braking and load security in daily operations.",
    sizes: ["18 ft", "20 ft", "22 ft", "24 ft"],
    startingPrice: null,
    bestFor: [
      "Recovery support operations",
      "Vehicle relocation",
      "Fleet and yard logistics",
      "Equipment hauling",
    ],
    specs: [
      { label: "Lengths", value: "18 – 24 ft" },
      { label: "Capacity", value: "Up to 12k lbs" },
      { label: "Deck", value: "Steel / reinforced frame" },
      { label: "Tie-downs", value: "D-rings + strap points" },
      { label: "Brakes", value: "Electric dual axle" },
      { label: "Winch", value: "Optional mount-ready" },
    ],
    highlights: [
      "Built for frequent towing workloads",
      "Reinforced frame for heavier loads",
      "Secure tie-down system",
      "Operator-friendly loading flow",
    ],
    primaryCta: { label: "Get on the waitlist", href: "/partner/customer" },
    secondaryCta: { label: "Back to all services", href: "/#services" },
  },
  {
    slug: "boat-trailer",
    name: "Boat Trailer",
    image: boatTrailer,
    badge: "Coming soon",
    available: false,
    tagline: "Reliable launch-and-retrieve support for marine transport.",
    short:
      "Boat trailers sized for small and medium vessels, with launch-oriented geometry and corrosion-conscious components.",
    sizes: ["16 ft", "18 ft", "20 ft", "24 ft"],
    startingPrice: null,
    bestFor: [
      "Marina-to-storage transport",
      "Seasonal launches and retrievals",
      "Service yard movements",
      "Private boating logistics",
    ],
    specs: [
      { label: "Lengths", value: "16 – 24 ft boats" },
      { label: "Support", value: "Bunks / roller setups" },
      { label: "Frame", value: "Marine-ready finish" },
      { label: "Winch", value: "Manual / optional electric" },
      { label: "Lights", value: "Water-resistant harness" },
      { label: "Brakes", value: "Surge or electric options" },
    ],
    highlights: [
      "Designed for smooth ramp operations",
      "Stable hull support and tie-down points",
      "Marine-focused component durability",
      "Great for private and commercial users",
    ],
    primaryCta: { label: "Get on the waitlist", href: "/partner/customer" },
    secondaryCta: { label: "Back to all services", href: "/#services" },
  },
];

// Launch gate:
// - true  => show only dump-trailer in public UI/routes
// - false => show all service categories
export const SHOW_ONLY_DUMP_TRAILERS = true;

export const PUBLIC_SERVICES = SHOW_ONLY_DUMP_TRAILERS
  ? SERVICES.filter((s) => s.slug === "dump-trailer")
  : SERVICES;

export const findService = (slug) =>
  SERVICES.find((s) => s.slug === slug) ?? null;

export const findPublicService = (slug) =>
  PUBLIC_SERVICES.find((s) => s.slug === slug) ?? null;
