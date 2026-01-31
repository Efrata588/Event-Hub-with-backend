const authController = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware');

const handleAuthRoutes = async (req, res) => {
    const { method, path: url } = req;

    // /api/auth/register
    if (url === '/api/auth/register' && method === 'POST') {
        upload.single('profilePicture')(req, res, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            authController.register(req, res);
        });
        return true;
    }

    // /api/auth/login
    if (url === '/api/auth/login' && method === 'POST') {
        authController.login(req, res);
        return true;
    }

    return false;
};

module.exports = handleAuthRoutes;
