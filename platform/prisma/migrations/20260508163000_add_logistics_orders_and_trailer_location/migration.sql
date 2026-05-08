-- CreateEnum
CREATE TYPE "TrailerLocationType" AS ENUM ('DEPOT', 'CUSTOMER_SITE', 'DISPOSAL_SITE', 'IN_TRANSIT', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "LogisticsOrderType" AS ENUM ('PICKUP', 'DISPOSAL', 'DROPOFF', 'REPOSITION');

-- CreateEnum
CREATE TYPE "LogisticsOrderStatus" AS ENUM ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "trailers"
ADD COLUMN "currentLocationType" "TrailerLocationType" NOT NULL DEFAULT 'DEPOT',
ADD COLUMN "currentLocationLabel" TEXT,
ADD COLUMN "currentLocationRefId" TEXT,
ADD COLUMN "currentLocationAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "logistics_orders" (
    "id" TEXT NOT NULL,
    "trailerId" TEXT NOT NULL,
    "bookingId" TEXT,
    "driverId" TEXT,
    "type" "LogisticsOrderType" NOT NULL,
    "status" "LogisticsOrderStatus" NOT NULL DEFAULT 'PENDING',
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "fromLocationType" "TrailerLocationType" NOT NULL DEFAULT 'UNKNOWN',
    "fromLocationLabel" TEXT,
    "toLocationType" "TrailerLocationType" NOT NULL,
    "toLocationLabel" TEXT NOT NULL,
    "wasteDropLocation" TEXT,
    "nextStopLocation" TEXT,
    "autoPlanned" BOOLEAN NOT NULL DEFAULT true,
    "requiresPickupTeam" BOOLEAN NOT NULL DEFAULT false,
    "scheduledAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "logistics_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "trailers_currentLocationType_idx" ON "trailers"("currentLocationType");

-- CreateIndex
CREATE INDEX "logistics_orders_trailerId_status_scheduledAt_idx" ON "logistics_orders"("trailerId", "status", "scheduledAt");

-- CreateIndex
CREATE INDEX "logistics_orders_bookingId_sequence_idx" ON "logistics_orders"("bookingId", "sequence");

-- CreateIndex
CREATE INDEX "logistics_orders_driverId_status_idx" ON "logistics_orders"("driverId", "status");

-- AddForeignKey
ALTER TABLE "logistics_orders" ADD CONSTRAINT "logistics_orders_trailerId_fkey" FOREIGN KEY ("trailerId") REFERENCES "trailers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistics_orders" ADD CONSTRAINT "logistics_orders_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logistics_orders" ADD CONSTRAINT "logistics_orders_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "driver_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
