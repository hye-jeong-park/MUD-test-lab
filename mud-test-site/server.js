const http = require("http");
const fs = require("fs");
const path = require("path");

const SITE_DIR = path.join(__dirname, "site");
const PORT = 18080;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".zip":  "application/zip",
  ".ico":  "image/x-icon",
  ".js":   "text/javascript",
  ".css":  "text/css",
};

const server = http.createServer((req, res) => {
  if (req.method === "POST") {
    let body = [];
    req.on("data", chunk => body.push(chunk));
    req.on("end", () => {
      res.writeHead(204);
      res.end();
    });
    return;
  }

  let urlPath = req.url.split("?")[0];
  if (urlPath === "/") urlPath = "/index.html";

  const filePath = path.join(SITE_DIR, urlPath);

  if (!filePath.startsWith(SITE_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`MUD test site running: http://localhost:${PORT}`);
});
