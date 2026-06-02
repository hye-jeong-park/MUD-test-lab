// MUD detection test only / no real malicious behavior
//
// Simulated exfiltration / mock beacon.
// This file is structured to LOOK like data exfiltration (gather form values,
// POST them out) so that outbound/PII-transfer detection has a target.
//
// SAFETY:
//   - The fetch target is restricted to the LOCAL mock endpoint: /api/mock-collect
//   - No external/cross-origin host is ever contacted.
//   - The local endpoint stores nothing and forwards nothing.

(function () {
  "use strict";

  // local-only endpoint — never a real external collector
  var LOCAL_ONLY_ENDPOINT = "/api/mock-collect";

  // simulated exfiltration: collect visible field values and "beacon" them locally
  function simulatedExfiltrate() {
    var data = {};
    document.querySelectorAll("input").forEach(function (el) {
      data[el.name || el.id || "field"] = el.value;
    });

    console.log("[exfiltration-like.js] simulated exfiltration -> LOCAL endpoint only:", LOCAL_ONLY_ENDPOINT);

    // mock beacon: goes to the local mock endpoint, never to an external server
    return fetch(LOCAL_ONLY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ simulated: true, fields: Object.keys(data) })
    }).then(function () {
      console.log("[exfiltration-like.js] mock beacon complete (no external transfer)");
    }).catch(function () { /* no-op */ });
  }

  window.__mudExfilTest = { simulatedExfiltrate: simulatedExfiltrate, endpoint: LOCAL_ONLY_ENDPOINT };
  console.log("[exfiltration-like.js] loaded (inert exfiltration-shaped sample, local-only)");
})();
