// MUD detection test only / no real malicious behavior
//
// Redirect/navigation detection sample.
// Contains the typical redirect primitives (location.href, window.open) plus a
// button-triggered redirect. Targets are restricted to SAFE values only:
//   - local safe path: /pages/normal.html
//   - harmless non-routable domain string: https://example.invalid/
//
// The auto-redirect is DISABLED by default (commented) so that loading this page
// does not bounce a human tester away; the navigation strings still exist in the
// source for static analysis. A meta refresh example also lives in the HTML page.

(function () {
  "use strict";

  var SAFE_LOCAL_PATH = "/pages/normal.html";
  var HARMLESS_OUTBOUND = "https://example.invalid/"; // non-routable reserved TLD

  // --- Auto redirect (simulated): present as source, not auto-fired ---
  function autoRedirectSimulated() {
    console.log("[redirect.js] autoRedirectSimulated() -> would navigate to", SAFE_LOCAL_PATH);
    // Uncomment to actually navigate to the local safe page:
    // window.location.href = SAFE_LOCAL_PATH;
  }

  // Simulate "after delay" auto navigation without actually leaving the page.
  setTimeout(autoRedirectSimulated, 3000);

  // --- Button-click redirect (actually navigates, but only to safe targets) ---
  function wireButtons() {
    var local = document.getElementById("redirectLocalBtn");
    if (local) {
      local.addEventListener("click", function () {
        console.log("[redirect.js] click -> location.href", SAFE_LOCAL_PATH);
        window.location.href = SAFE_LOCAL_PATH;
      });
    }

    var outbound = document.getElementById("redirectOutboundBtn");
    if (outbound) {
      outbound.addEventListener("click", function () {
        // window.open to a harmless non-routable domain (will not resolve)
        console.log("[redirect.js] click -> window.open", HARMLESS_OUTBOUND);
        window.open(HARMLESS_OUTBOUND, "_blank");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireButtons);
  } else {
    wireButtons();
  }

  window.__mudRedirectTest = { SAFE_LOCAL_PATH: SAFE_LOCAL_PATH, HARMLESS_OUTBOUND: HARMLESS_OUTBOUND };
  console.log("[redirect.js] loaded (inert redirect sample, safe targets only)");
})();
