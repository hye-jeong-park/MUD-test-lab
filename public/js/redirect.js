// MUD detection test only / no real malicious behavior
//
// Redirect/navigation detection sample.
// Contains the typical redirect primitives (location.href, window.open) plus a
// button-triggered redirect. Targets are restricted to SAFE values only:
//   - local safe path: /pages/normal.html
//   - harmless non-routable domain string: https://example.invalid/
//
// The auto-redirect is ENABLED: loading this page auto-navigates to the local safe
// path after a short delay so dynamic analyzers can observe the redirect. A meta
// refresh example also lives in the HTML page.

(function () {
  "use strict";

  var SAFE_LOCAL_PATH = "/pages/normal.html";
  var HARMLESS_OUTBOUND = "https://example.invalid/"; // non-routable reserved TLD

  // --- Auto redirect: fires automatically on page load (after a short delay) ---
  function autoRedirectSimulated() {
    console.log("[redirect.js] autoRedirectSimulated() -> navigating to", SAFE_LOCAL_PATH);
    // Auto-fired navigation to the local safe page (enabled for dynamic detection):
    window.location.href = SAFE_LOCAL_PATH;
  }

  // Auto-navigate immediately on load so the short headless analysis window
  // (no settle wait) can observe the redirect navigation.
  autoRedirectSimulated();

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
