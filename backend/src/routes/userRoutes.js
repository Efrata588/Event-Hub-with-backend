const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

const handleUserRoutes = async (req, res) => {
  const { method, path: url } = req;

  // GET /api/users/profile (protected)
  if (url === "/api/users/profile" && method === "GET") {
    authMiddleware(req, res, () => {
      userController.getProfile(req, res);
    });
    return true;
  }

  // GET /api/users/organizer/:id
  if (url.startsWith("/api/users/organizer/") && method === "GET") {
    const parts = url.split("/");
    const id = parts[parts.length - 1];
    req.params = { id };
    userController.getOrganizerProfile(req, res);
    return true;
  }

  // POST /api/users/follow/:organizerId (protected)
  if (url.startsWith("/api/users/follow/") && method === "POST") {
    const parts = url.split("/");
    const organizerId = parts[parts.length - 1];
    req.params = { organizerId };
    authMiddleware(req, res, () => {
      userController.toggleFollow(req, res);
    });
    return true;
  }

  // POST /api/users/save/:eventId (protected)
  if (url.startsWith("/api/users/save/") && method === "POST") {
    const parts = url.split("/");
    const eventId = parts[parts.length - 1];
    req.params = { eventId };
    authMiddleware(req, res, () => {
      userController.toggleSaveEvent(req, res);
    });
    return true;
  }

  // POST /api/users/participate/:eventId (protected)
  if (url.startsWith("/api/users/participate/") && method === "POST") {
    const parts = url.split("/");
    const eventId = parts[parts.length - 1];
    req.params = { eventId };
    authMiddleware(req, res, () => {
      userController.toggleParticipate(req, res);
    });
    return true;
  }

  return false;
};

module.exports = handleUserRoutes;
