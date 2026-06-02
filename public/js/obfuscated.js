// MUD detection test only / no real malicious behavior
//
// This file mimics the SHAPE of obfuscated/packed JavaScript (base64-like blobs,
// eval-like wrappers, string-concat construction, mangled variable names) so that
// obfuscation/QuickDetect/ML analyzers have something to react to.
//
// IMPORTANT: nothing here is actually executed as code. The "eval-like" wrapper is
// a safe no-op that only logs. No atob() output is ever run. No dynamic code runs.

(function () {
  "use strict";

  // base64-like string (decodes to harmless text, but is never decoded+executed)
  var _0xb64 = "TVVEIGRldGVjdGlvbiB0ZXN0IG9ubHkgLSBpbmVydA=="; // "MUD detection test only - inert"

  // mangled variable names + string-concat construction (classic obfuscation look)
  var _0xa1 = "co" + "ns" + "ole";
  var _0xa2 = "lo" + "g";
  var _0x3f = ["ob", "fus", "cat", "ed", "-", "sam", "ple"].join("");

  // eval-like wrapper that intentionally does NOT eval anything.
  function _packedRunner(src) {
    // A real packer would do: eval(src). We do not. We only log a label.
    console.log("[obfuscated.js] _packedRunner invoked (no-op, src NOT executed):", _0x3f);
    return src; // returned untouched, never run
  }

  // Looks like it would unpack-and-run; actually inert.
  var _payload = _0xb64;
  _packedRunner(_payload);

  // Reference window[_0xa1][_0xa2] dynamically (obfuscation-style) but only to log.
  try {
    window[_0xa1][_0xa2]("[obfuscated.js] loaded (inert obfuscation-shaped sample)");
  } catch (e) { /* no-op */ }
})();
