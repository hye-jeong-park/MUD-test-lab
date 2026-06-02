// MUD detection test only / no real malicious behavior
//
// This file contains suspicious-LOOKING identifiers, function names and string
// patterns that static/ML script analyzers commonly flag. NONE of them perform
// real key logging, real credential collection, or real network requests.
// Everything below is inert: no-op functions and plain strings.

(function () {
  "use strict";

  // --- Suspicious-looking string patterns (inert constants, never used as code) ---
  var suspiciousEvalPattern = "eval(atob('ZmFrZQ=='))"; // string only, never executed
  var fakeKeyLoggerDetectorString = "document.onkeypress=function(e){/* not wired up */}";
  var documentCookieMention = "document.cookie"; // mentioned as a string, not read

  // --- Mock credential collector: returns nothing real, sends nothing ---
  function collectCredentialsMock() {
    // Intentionally does NOT read any real input or send anything.
    console.log("[suspicious.js] collectCredentialsMock() called — inert, no data accessed");
    return { simulated: true };
  }

  // --- Simulated beacon: logs locally, performs NO network request ---
  function simulatedBeacon(label) {
    console.log("[suspicious.js] simulatedBeacon():", label, "(no network request performed)");
  }

  // --- Fake keylogger detector string holder (no listener attached) ---
  function fakeKeyLoggerDetector() {
    // No addEventListener('keydown', ...) is registered. This is a decoy name only.
    return fakeKeyLoggerDetectorString;
  }

  // Reference the decoy values so bundlers keep them, but do nothing risky.
  window.__mudSuspiciousTest = {
    suspiciousEvalPattern: suspiciousEvalPattern,
    documentCookieMention: documentCookieMention,
    collectCredentialsMock: collectCredentialsMock,
    simulatedBeacon: simulatedBeacon,
    fakeKeyLoggerDetector: fakeKeyLoggerDetector
  };

  simulatedBeacon("page-load");
  console.log("[suspicious.js] loaded (inert detection-trigger sample)");
})();
