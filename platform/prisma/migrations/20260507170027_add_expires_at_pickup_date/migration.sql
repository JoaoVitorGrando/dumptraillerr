-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "pickupDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "bookings_trailerId_serviceDate_status_idx" ON "bookings"("trailerId", "serviceDate", "status");

-- CreateIndex
CREATE INDEX "trailer_availability_trailerId_blockedFrom_blockedUntil_idx" ON "trailer_availability"("trailerId", "blockedFrom", "blockedUntil");
