const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const url = require("url");
const path = require("path");
const fs = require("fs");

// Load env vars
dotenv.config();

// Database Config
const connectDB = require("./src/config/db");

// Connect DB
connectDB();

const handleAuthRoutes = require("./src/routes/authRoutes");
const handleEventRoutes = require("./src/routes/eventRoutes");
const handleUserRoutes = require("./src/routes/userRoutes");

const PORT = process.env.PORT || 5000;

const enhanceResponse = (res) => {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
    return res;
  };
  return res;
};

const enhanceRequest = (req) => {
  const parsedUrl = url.parse(req.url, true);
  req.path = parsedUrl.pathname;
  req.query = parsedUrl.query;

  req.header = (name) => req.headers[name.toLowerCase()];
};

const handleCors = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-auth-token",
  );

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
};

// Body Parser Helper (for JSON)
const parseJsonBody = (req) => {
  return new Promise((resolve, reject) => {
    if (req.method === "POST" || req.method === "PUT") {
      const contentType = req.headers["content-type"];
      if (contentType && contentType.includes("application/json")) {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            req.body = body ? JSON.parse(body) : {};
            resolve();
          } catch (e) {
            reject(e);
          }
        });
        req.on("error", (err) => reject(err));
      } else {
        resolve();
      }
    } else {
      resolve();
    }
  });
};

const serveStatic = (req, res) => {
  if (req.url.startsWith("/uploads/")) {
    const filePath = path.join(__dirname, req.url);

    if (!filePath.startsWith(path.join(__dirname, "uploads"))) {
      res.statusCode = 403;
      res.end("Forbidden");
      return true;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end("File not found");
      } else {
        // Determine content type
        const ext = path.extname(filePath).toLowerCase();
        let contentType = "application/octet-stream";
        if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
        else if (ext === ".png") contentType = "image/png";
        else if (ext === ".gif") contentType = "image/gif";
        else if (ext === ".svg") contentType = "image/svg+xml";

        res.setHeader("Content-Type", contentType);
        res.end(data);
      }
    });
    return true;
  }
  return false;
};

const server = http.createServer(async (req, res) => {
  enhanceResponse(res);
  enhanceRequest(req);

  console.log(`${req.method} ${req.url}`);

  if (handleCors(req, res)) return;

  if (serveStatic(req, res)) return;

  try {
    await parseJsonBody(req);
    if (req.method === "POST") console.log("Parsed Body:", req.body); // DEBUG
  } catch (e) {
    return res.status(400).json({ message: "Invalid JSON" });
  }

  if (await handleAuthRoutes(req, res)) return;
  if (await handleEventRoutes(req, res)) return;
  if (await handleUserRoutes(req, res)) return;

  res.status(404).json({ message: "Route not found" });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
