import trailer14Image from "../assets/dumptrailler.jpeg";
import trailer16Image from "../assets/Dumptrailler3.jpg";

// Trailer catalog used across the site (cards, form, summary)
export const TRAILERS = [
  {
    id: "7x14x4",
    name: "Dump Trailer 7x14x4",
    image: trailer14Image,
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
    image: trailer16Image,
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
];
