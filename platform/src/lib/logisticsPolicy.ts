export type TransportProvider = "OWNER" | "DRIVER_MARKETPLACE" | "CUSTOMER_PICKUP";

export function parseTransportProvider(notes?: string | null): TransportProvider {
  const match = notes?.match(/provider=(OWNER|DRIVER_MARKETPLACE|CUSTOMER_PICKUP)/);
  if (!match) return "DRIVER_MARKETPLACE";
  return match[1] as TransportProvider;
}

export function shouldRequirePickupTeam(provider: TransportProvider) {
  return provider === "DRIVER_MARKETPLACE";
}

export function decidePostDisposalRoute(hasNextCustomer: boolean) {
  return hasNextCustomer ? "DROPOFF" : "REPOSITION";
}
