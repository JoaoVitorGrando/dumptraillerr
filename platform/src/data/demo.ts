/**
 * Demo data — substitui queries reais do Supabase até as credenciais chegarem.
 * Para conectar ao banco real: substitua as funções abaixo por queries Supabase/Prisma.
 */

// ─── TIPOS ───────────────────────────────────────────────────────────────────

export type BookingStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "refunded";
export type TrailerStatus = "available" | "rented" | "maintenance";
export type JobStatus = "assigned" | "en_route" | "delivered" | "completed";
export type UserRole = "customer" | "owner" | "driver" | "admin";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface DemoBooking {
  id: string;
  createdAt: string;
  status: BookingStatus;
  trailer: { size: string; name: string; image: string };
  deliveryDate: string;
  pickupDate: string;
  address: string;
  city: string;
  totalAmount: number; // cents
  paymentStatus: PaymentStatus;
  stripeSessionId?: string;
  notes?: string;
}

export interface DemoTrailer {
  id: string;
  name: string;
  size: string;
  status: TrailerStatus;
  dailyRate: number; // cents
  image: string;
  totalEarnings: number; // cents
  totalTrips: number;
  year: number;
  licensePlate: string;
  nextAvailable?: string;
}

export interface DemoJob {
  id: string;
  status: JobStatus;
  customerName: string;
  address: string;
  city: string;
  trailerSize: string;
  scheduledTime: string;
  earnings: number; // cents
  tip: number; // cents
  distanceMiles: number;
  notes?: string;
  photos: string[];
  signatureObtained: boolean;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  approvalStatus: ApprovalStatus;
  createdAt: string;
  phone?: string;
  totalBookings?: number;
  totalEarnings?: number; // cents
}

export interface DemoEarning {
  period: string; // e.g. "May 2026"
  gross: number; // cents
  net: number; // cents (after platform fee)
  trips: number;
}

// ─── DADOS DEMO ──────────────────────────────────────────────────────────────

export const DEMO_BOOKINGS: DemoBooking[] = [
  {
    id: "bk_001",
    createdAt: "2026-04-28T14:22:00Z",
    status: "completed",
    trailer: { size: "7×14", name: "7×14 Dump Trailer", image: "/assets/7x14.png" },
    deliveryDate: "2026-04-30",
    pickupDate: "2026-05-02",
    address: "1420 NW 57th St",
    city: "Seattle, WA 98107",
    totalAmount: 35000,
    paymentStatus: "paid",
    stripeSessionId: "cs_demo_001",
    notes: "Gate code: 1234",
  },
  {
    id: "bk_002",
    createdAt: "2026-05-01T09:10:00Z",
    status: "active",
    trailer: { size: "7×16", name: "7×16 Dump Trailer", image: "/assets/7x16.png" },
    deliveryDate: "2026-05-03",
    pickupDate: "2026-05-06",
    address: "3201 Eastlake Ave E",
    city: "Seattle, WA 98102",
    totalAmount: 52500,
    paymentStatus: "paid",
  },
  {
    id: "bk_003",
    createdAt: "2026-05-04T17:45:00Z",
    status: "confirmed",
    trailer: { size: "7×12", name: "7×12 Dump Trailer", image: "/assets/7x12.png" },
    deliveryDate: "2026-05-08",
    pickupDate: "2026-05-10",
    address: "872 S Lucile St",
    city: "Seattle, WA 98108",
    totalAmount: 29000,
    paymentStatus: "paid",
  },
  {
    id: "bk_004",
    createdAt: "2026-05-05T11:00:00Z",
    status: "pending",
    trailer: { size: "8×20", name: "8×20 Dump Trailer", image: "/assets/8x20.png" },
    deliveryDate: "2026-05-12",
    pickupDate: "2026-05-15",
    address: "5401 Leary Ave NW",
    city: "Seattle, WA 98107",
    totalAmount: 87500,
    paymentStatus: "pending",
  },
];

export const DEMO_FLEET: DemoTrailer[] = [
  {
    id: "tr_001",
    name: "Big Blue",
    size: "7×16",
    status: "rented",
    dailyRate: 17500,
    image: "/assets/7x16.png",
    totalEarnings: 420000,
    totalTrips: 24,
    year: 2022,
    licensePlate: "WA-4821-T",
    nextAvailable: "2026-05-06",
  },
  {
    id: "tr_002",
    name: "Workhorse",
    size: "7×14",
    status: "available",
    dailyRate: 15000,
    image: "/assets/7x14.png",
    totalEarnings: 315000,
    totalTrips: 21,
    year: 2021,
    licensePlate: "WA-7734-T",
  },
  {
    id: "tr_003",
    name: "Heavy Duty",
    size: "8×20",
    status: "maintenance",
    dailyRate: 29000,
    image: "/assets/8x20.png",
    totalEarnings: 580000,
    totalTrips: 20,
    year: 2023,
    licensePlate: "WA-2291-T",
    nextAvailable: "2026-05-09",
  },
];

export const DEMO_JOBS: DemoJob[] = [
  {
    id: "job_001",
    status: "assigned",
    customerName: "Marcus Webb",
    address: "4822 Fremont Ave N",
    city: "Seattle, WA 98103",
    trailerSize: "7×14",
    scheduledTime: "09:00 AM",
    earnings: 8500,
    tip: 0,
    distanceMiles: 6.2,
    notes: "Ring doorbell twice. Dog in yard.",
    photos: [],
    signatureObtained: false,
  },
  {
    id: "job_002",
    status: "assigned",
    customerName: "Linda Osei",
    address: "1101 N 100th St",
    city: "Seattle, WA 98133",
    trailerSize: "7×16",
    scheduledTime: "02:00 PM",
    earnings: 9500,
    tip: 0,
    distanceMiles: 9.8,
    photos: [],
    signatureObtained: false,
  },
];

export const DEMO_JOB_HISTORY: DemoJob[] = [
  {
    id: "job_h01",
    status: "completed",
    customerName: "Priya Sharma",
    address: "720 Terry Ave N",
    city: "Seattle, WA 98109",
    trailerSize: "7×12",
    scheduledTime: "10:00 AM",
    earnings: 7500,
    tip: 1000,
    distanceMiles: 4.5,
    photos: [],
    signatureObtained: true,
  },
  {
    id: "job_h02",
    status: "completed",
    customerName: "Ben Nakamura",
    address: "2121 N Northgate Way",
    city: "Seattle, WA 98133",
    trailerSize: "7×16",
    scheduledTime: "08:30 AM",
    earnings: 9500,
    tip: 2000,
    distanceMiles: 11.2,
    photos: [],
    signatureObtained: true,
  },
  {
    id: "job_h03",
    status: "completed",
    customerName: "Sara Johansson",
    address: "3801 Stone Way N",
    city: "Seattle, WA 98103",
    trailerSize: "8×20",
    scheduledTime: "01:00 PM",
    earnings: 13000,
    tip: 2500,
    distanceMiles: 7.8,
    photos: [],
    signatureObtained: true,
  },
];

export const DEMO_EARNINGS: DemoEarning[] = [
  { period: "Jan 2026", gross: 380000, net: 323000, trips: 22 },
  { period: "Feb 2026", gross: 345000, net: 293250, trips: 20 },
  { period: "Mar 2026", gross: 420000, net: 357000, trips: 24 },
  { period: "Apr 2026", gross: 395000, net: 335750, trips: 23 },
  { period: "May 2026", gross: 152000, net: 129200, trips: 9 },
];

export const DEMO_OWNER_EARNINGS: DemoEarning[] = [
  { period: "Jan 2026", gross: 210000, net: 178500, trips: 12 },
  { period: "Feb 2026", gross: 195000, net: 165750, trips: 11 },
  { period: "Mar 2026", gross: 245000, net: 208250, trips: 14 },
  { period: "Apr 2026", gross: 220000, net: 187000, trips: 13 },
  { period: "May 2026", gross: 87500, net: 74375, trips: 5 },
];

export const DEMO_USERS: DemoUser[] = [
  {
    id: "u_001",
    name: "Marcus Webb",
    email: "marcus@example.com",
    role: "customer",
    approvalStatus: "approved",
    createdAt: "2026-02-10",
    phone: "+1 (206) 555-0101",
    totalBookings: 5,
  },
  {
    id: "u_002",
    name: "Lisa Park",
    email: "lisa@example.com",
    role: "owner",
    approvalStatus: "pending",
    createdAt: "2026-05-01",
    phone: "+1 (206) 555-0102",
    totalEarnings: 0,
  },
  {
    id: "u_003",
    name: "Jordan Ellis",
    email: "jordan@example.com",
    role: "driver",
    approvalStatus: "pending",
    createdAt: "2026-05-03",
    phone: "+1 (206) 555-0103",
  },
  {
    id: "u_004",
    name: "Priya Sharma",
    email: "priya@example.com",
    role: "customer",
    approvalStatus: "approved",
    createdAt: "2026-03-15",
    totalBookings: 3,
  },
  {
    id: "u_005",
    name: "Ben Nakamura",
    email: "ben@example.com",
    role: "driver",
    approvalStatus: "approved",
    createdAt: "2026-01-20",
    totalEarnings: 185000,
  },
  {
    id: "u_006",
    name: "Sara Johansson",
    email: "sara@example.com",
    role: "owner",
    approvalStatus: "approved",
    createdAt: "2026-01-05",
    totalEarnings: 957500,
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function formatCentsDecimal(cents: number): string {
  return `$${(cents / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    active: "bg-green-50 text-green-700 border-green-200",
    completed: "bg-gray-100 text-gray-600 border-gray-200",
    cancelled: "bg-red-50 text-red-600 border-red-200",
    available: "bg-green-50 text-green-700 border-green-200",
    rented: "bg-blue-50 text-blue-700 border-blue-200",
    maintenance: "bg-amber-50 text-amber-700 border-amber-200",
    assigned: "bg-blue-50 text-blue-700 border-blue-200",
    en_route: "bg-brand-orange/10 text-brand-dark-orange border-brand-orange/20",
    delivered: "bg-purple-50 text-purple-700 border-purple-200",
    paid: "bg-green-50 text-green-700 border-green-200",
    refunded: "bg-gray-100 text-gray-600 border-gray-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-600 border-red-200",
    driver: "bg-purple-50 text-purple-700 border-purple-200",
    owner: "bg-blue-50 text-blue-700 border-blue-200",
    customer: "bg-gray-100 text-gray-600 border-gray-200",
    admin: "bg-brand-orange/10 text-brand-dark-orange border-brand-orange/20",
  };
  return map[status] ?? "bg-gray-100 text-gray-600 border-gray-200";
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    active: "Active",
    completed: "Completed",
    cancelled: "Cancelled",
    available: "Available",
    rented: "Rented",
    maintenance: "Maintenance",
    assigned: "Assigned",
    en_route: "En Route",
    delivered: "Delivered",
    paid: "Paid",
    refunded: "Refunded",
    approved: "Approved",
    rejected: "Rejected",
    driver: "Driver",
    owner: "Owner",
    customer: "Customer",
    admin: "Admin",
  };
  return map[status] ?? status;
}
