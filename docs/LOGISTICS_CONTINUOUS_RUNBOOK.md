# Continuous Trailer Logistics Runbook

## Objective
Keep trailers circulating between customers whenever possible, while tracking:
- current trailer location,
- active logistics order,
- next destination decision (next customer vs depot).

## Feature flags
- `CONTINUOUS_LOGISTICS_ENABLED=true` enables automatic logistics planning.
- `DEFAULT_DEPOT_LABEL` defines the fallback depot address used by planning/backfill.

## Deployment steps
1. Deploy migration that adds:
   - trailer location fields,
   - `logistics_orders` table,
   - logistics enums.
2. Run Prisma generate in the deployment pipeline.
3. Set environment variables:
   - `CONTINUOUS_LOGISTICS_ENABLED=true`
   - `DEFAULT_DEPOT_LABEL=<real depot address>`
4. Run one-time backfill:
   - `npm run logistics:backfill`
5. Validate live data in admin/owner dashboards.

## Operational flow
1. Booking becomes `CONFIRMED`.
2. System seeds initial orders:
   - `PICKUP` (origin -> customer)
   - `DISPOSAL` (customer -> disposal facility)
3. Driver executes orders in job flow.
4. On `DISPOSAL` completion:
   - if another confirmed booking exists for same trailer, create `DROPOFF` to next customer,
   - else create `REPOSITION` to depot.

## Validation checklist
- Create booking and confirm payment -> verify `PICKUP` and `DISPOSAL` created.
- Claim booking as driver -> verify pending logistics orders become `ASSIGNED`.
- Start and complete order from driver job UI -> verify trailer location updates.
- Complete `DISPOSAL` -> verify auto-created `DROPOFF` or `REPOSITION`.
- Open owner dashboard -> verify location and logistics queue visible.
- Open admin dashboard -> verify dispatch queue and in-transit count.

## Rollback strategy
1. Set `CONTINUOUS_LOGISTICS_ENABLED=false`.
2. New bookings stop auto-seeding logistics orders.
3. Existing orders remain queryable for audit but are no longer auto-generated.
4. Re-enable once issue is fixed.
