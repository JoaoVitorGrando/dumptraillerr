"use client";

import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import type { DriverOfferItem } from "./DriverOffersList";

const DEFAULT_CENTER: [number, number] = [47.6062, -122.3321]; // Seattle

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FitBounds({
  offers,
  selectedOfferId,
}: {
  offers: DriverOfferItem[];
  selectedOfferId: string | null;
}) {
  const map = useMap();

  if (offers.length === 0) return null;

  const selected = selectedOfferId
    ? offers.find((o) => o.id === selectedOfferId)
    : null;

  if (selected) {
    map.flyTo([selected.lat, selected.lng], 13, { duration: 0.6 });
    return null;
  }

  const bounds = L.latLngBounds(offers.map((o) => [o.lat, o.lng] as [number, number]));
  map.fitBounds(bounds, { padding: [30, 30], maxZoom: 13 });
  return null;
}

export default function DriverOffersMap({
  offers,
  selectedOfferId,
  onSelectOffer,
}: {
  offers: DriverOfferItem[];
  selectedOfferId: string | null;
  onSelectOffer: (offerId: string) => void;
}) {
  return (
    <div className="h-[560px] w-full overflow-hidden rounded-xl border border-gray-200">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={11}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds offers={offers} selectedOfferId={selectedOfferId} />

        {offers.map((offer) => (
          <Marker
            key={offer.id}
            position={[offer.lat, offer.lng]}
            icon={markerIcon}
            eventHandlers={{
              click: () => onSelectOffer(offer.id),
            }}
          >
            <Popup>
              <div className="min-w-[190px]">
                <p className="font-semibold text-sm">{offer.trailerName}</p>
                <p className="text-xs mt-0.5">{offer.deliveryAddress}</p>
                <p className="text-xs mt-1">
                  Service: {new Date(offer.serviceDate).toLocaleDateString("en-US")}
                </p>
                <Link
                  href={`/dashboard/driver/offers/${offer.id}`}
                  className="inline-block mt-2 text-xs font-bold text-brand-orange hover:underline"
                >
                  View details →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
