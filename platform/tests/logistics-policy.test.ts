import assert from "node:assert/strict";
import {
  decidePostDisposalRoute,
  parseTransportProvider,
  shouldRequirePickupTeam,
} from "../src/lib/logisticsPolicy.ts";

function run() {
  assert.equal(parseTransportProvider("[logistics] provider=OWNER"), "OWNER");
  assert.equal(
    parseTransportProvider("[logistics] provider=DRIVER_MARKETPLACE"),
    "DRIVER_MARKETPLACE"
  );
  assert.equal(parseTransportProvider("no provider metadata"), "DRIVER_MARKETPLACE");

  assert.equal(shouldRequirePickupTeam("DRIVER_MARKETPLACE"), true);
  assert.equal(shouldRequirePickupTeam("OWNER"), false);

  assert.equal(decidePostDisposalRoute(true), "DROPOFF");
  assert.equal(decidePostDisposalRoute(false), "REPOSITION");

  console.log("logistics-policy.test: OK");
}

run();
