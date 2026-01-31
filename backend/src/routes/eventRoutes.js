const eventController = require("../controllers/eventController");
const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/uploadMiddleware");

// Helper for route matching
const matchRoute = (path, routePattern) => {
  const paramNames = [];
  const regexPath = routePattern.replace(/:([^/]+)/g, (_, key) => {
    paramNames.push(key);
    return "([^/]+)";
  });
  const regex = new RegExp(`^${regexPath}$`);
  const match = path.match(regex);

  if (match) {
    const params = {};
    paramNames.forEach((name, index) => {
      params[name] = match[index + 1];
    });
    return params;
  }
  return null;
};

const handleEventRoutes = async (req, res) => {
  const { method, path: urlPath } = req; // Use path (excluding query string)

  // GET /api/events
  if (urlPath === "/api/events" && method === "GET") {
    eventController.getEvents(req, res);
    return true;
  }

  // POST /api/events
  if (urlPath === "/api/events" && method === "POST") {
    authMiddleware(req, res, () => {
      upload.single("imageUrl")(req, res, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        eventController.createEvent(req, res);
      });
    });
    return true;
  }

  // GET /api/events/:id
  let params = matchRoute(urlPath, "/api/events/:id");
  if (params && method === "GET") {
    req.params = params;
    eventController.getEventById(req, res);
    return true;
  }

  // Recap Routes
  //   params = matchRoute(urlPath, "/api/events/:eventId/recap");
  //   if (params) {
  //     req.params = params;
  //     if (method === "GET") {
  //       eventController.getRecap(req, res);
  //       return true;
  //     }
  //     if (method === "POST") {
  //       authMiddleware(req, res, () => {
  //         upload.array("photos", 5)(req, res, (err) => {
  //           if (err) return res.status(500).json({ error: err.message });
  //           eventController.createRecap(req, res);
  //         });
  //       });
  //       return true;
  //     }
  //   }

  //   // Feedback Route
  //   params = matchRoute(urlPath, "/api/events/:eventId/feedback");
  //   if (params && method === "POST") {
  //     req.params = params;
  //     authMiddleware(req, res, () => {
  //       eventController.addFeedback(req, res);
  //     });
  //     return true;
  //   }

  //   return false;
};

module.exports = handleEventRoutes;
