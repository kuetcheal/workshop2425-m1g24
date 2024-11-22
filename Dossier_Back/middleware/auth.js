// middleware/auth.js
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.patientId) {
        return next(); // L'utilisateur est connecté, passe à la route suivante
    }
    return res.status(401).json({ message: 'Vous devez être connecté pour accéder à cette ressource' });
};

module.exports = { isAuthenticated };
