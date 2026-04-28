import dumpTrailerImage from "../assets/DumpTrailer.webp";

// FAGU dump trailer catalog — focused on 12–18 ft (the most-used range
// for roofing crews and construction cleanouts, per the project brief).
// All sizes share the same hero image until dedicated photography for each
// size is provided.
export const TRAILERS = [
  {
    id: "7x12x4",
    name: "Dump Trailer 7x12x4",
    image: dumpTrailerImage,
    imageAlt: "Compact dump trailer ready for residential job site",
    length: "12 ft",
    size: "7 ft wide × 12 ft long × 4 ft high",
    bestFor: "Ideal for small residential jobs",
    capacity: "Capacity varies by material and local disposal rules.",
    hitch: "2-5/16 in ball",
    electrical: "7-pin light plug",
    price: 350,
    highlights: [
      "Quick residential cleanouts",
      "Driveway-friendly footprint",
      "Light renovation debris",
    ],
  },
  {
    id: "7x14x4",
    name: "Dump Trailer 7x14x4",
    image: dumpTrailerImage,
    imageAlt: "Heavy-duty dump trailer at a construction site",
    length: "14 ft",
    size: "7 ft wide × 14 ft long × 4 ft high",
    bestFor: "Ideal for small and medium jobs",
    capacity: "Capacity varies by material and local disposal rules.",
    hitch: "2-5/16 in ball",
    electrical: "7-pin light plug",
    price: 350,
    highlights: [
      "Great for residential cleanouts",
      "Light renovation debris",
      "Yard waste and brush removal",
    ],
  },
  {
    id: "7x16x4",
    name: "Dump Trailer 7x16x4",
    image: dumpTrailerImage,
    imageAlt: "Construction dump trailer parked near work area",
    length: "16 ft",
    size: "7 ft wide × 16 ft long × 4 ft high",
    bestFor: "Ideal for larger jobs",
    capacity: "Capacity varies by material and local disposal rules.",
    hitch: "2-5/16 in ball",
    electrical: "7-pin light plug",
    price: 350,
    highlights: [
      "Heavy renovation debris",
      "Roofing tear-offs",
      "Lot clearing and large cleanouts",
    ],
  },
  {
    id: "7x18x4",
    name: "Dump Trailer 7x18x4",
    image: dumpTrailerImage,
    imageAlt: "Extended dump trailer for heavy roofing tear-offs",
    length: "18 ft",
    size: "7 ft wide × 18 ft long × 4 ft high",
    bestFor: "Ideal for heavy roofing & demolition",
    capacity: "Capacity varies by material and local disposal rules.",
    hitch: "2-5/16 in ball",
    electrical: "7-pin light plug",
    price: 350,
    highlights: [
      "Full roofing tear-offs",
      "Commercial cleanouts",
      "Maximum payload runs",
    ],
  },
];
