// MUD detection test only / no real malicious behavior
//
// Local mock collection endpoint handler.
// Submitted values are NEVER stored to disk and NEVER forwarded to any
// external server. They are written to the server console (stdout) only,
// so that detection tooling has an inert "outbound-like" target to observe.

function mockCollect(req, res) {
  // Log a redacted summary only — we do not persist or forward anything.
  const fields = req.body && typeof req.body === "object" ? Object.keys(req.body) : [];
  console.log(
    "[mock-collect] received test submission (NOT stored, NOT forwarded). fields:",
    fields.join(", ") || "(none)"
  );

  res.status(200).json({
    status: "ok",
    note: "mock endpoint - data not stored, not forwarded (MUD detection test only)"
  });
}

module.exports = mockCollect;
