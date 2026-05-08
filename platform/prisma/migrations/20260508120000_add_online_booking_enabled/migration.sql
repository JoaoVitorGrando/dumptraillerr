-- Add onlineBookingEnabled flag to trailers (Tier-3 feature: owner toggle online booking)
ALTER TABLE "trailers"
  ADD COLUMN "onlineBookingEnabled" BOOLEAN NOT NULL DEFAULT true;

-- Index used by:
--  * public listings  (WHERE onlineBookingEnabled = true)
--  * checkout validation
CREATE INDEX "trailers_onlineBookingEnabled_idx"
  ON "trailers"("onlineBookingEnabled");
