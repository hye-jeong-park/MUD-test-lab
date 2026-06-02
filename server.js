// MUD detection test only / no real malicious behavior
//
// Express test server for MUD v6.2 malicious-URL detection validation.
// Serves inert/simulated test pages. No real malware, mining, PII theft,
// external exfiltration, or C2. All "malicious" behavior is mocked.

const express = require("express");
const path = require("path");
const mockCollect = require("./api/mock-collect");

const app = express();
const PORT = process.env.PORT || 18080;

// Body parsers (so /api/mock-collect can read submitted test values for logging)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static assets
app.use("/pages", express.static(path.join(__dirname, "pages")));
app.use("/public", express.static(path.join(__dirname, "public")));

// Local mock collection endpoint (logs only, never stores/forwards)
app.post("/api/mock-collect", mockCollect);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Root redirect to landing page
app.get("/", (req, res) => {
  res.redirect("/pages/index.html");
});

// Test page catalog (kept in sync with pages/index.html and requests/mud-test-urls.json)
const TEST_PAGES = [
  ["TC-00", "/pages/normal.html",               "normal baseline (benign)"],
  ["TC-01", "/pages/fake-login.html",           "phishing / credential input"],
  ["TC-02", "/pages/credential-harvest.html",   "PII / credential harvest"],
  ["TC-03", "/pages/brand-impersonation.html",  "brand impersonation"],
  ["TC-04", "/pages/suspicious-js.html",        "suspicious JS pattern"],
  ["TC-05", "/pages/obfuscated-js.html",        "obfuscated JS"],
  ["TC-06", "/pages/exfiltration-like.html",    "exfiltration-like behavior"],
  ["TC-07", "/pages/malicious-redirect.html",   "malicious redirect"],
  ["TC-08", "/pages/drive-by-download.html",    "drive-by download"],
];

app.listen(PORT, "0.0.0.0", () => {
  console.log("");
  console.log("  MUD detection test lab (inert / simulated — no real malicious behavior)");
  console.log(`  Running on:  http://localhost:${PORT}`);
  console.log(`  Landing:     http://localhost:${PORT}/pages/index.html`);
  console.log(`  Health:      http://localhost:${PORT}/health`);
  console.log("");
  console.log("  Test pages:");
  for (const [id, p, desc] of TEST_PAGES) {
    console.log(`    ${id}  http://localhost:${PORT}${p}  — ${desc}`);
  }
  console.log("");
  console.log("  Note: inside Docker, use http://host.docker.internal:" + PORT);
  console.log("");
});
