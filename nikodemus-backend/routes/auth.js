const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const router = express.Router();

// Middleware pour analyser les cookies
router.use(cookieParser());

// Route pour déconnexion
router.post('/logout', (req, res) => {
    res.clearCookie('authToken', { path: '/' }); // Supprimer le cookie authToken
    res.status(200).json({ message: 'Déconnexion réussie' });
});

// Route pour obtenir l'utilisateur authentifié
router.get('/me', (req, res) => {
    const token = req.cookies.authToken; // Récupère le token depuis les cookies

    if (!token) {
        return res.status(401).json({ message: "Non authentifié" });
    }

    try {
        const decoded = jwt.verify(token, '6e6XRsVRQGFed7SaGs4sWoD2x3VonNCn7LLxoR1d1M_uU_UGt9WtwNbut7futfFh');
        res.status(200).json({
            user: {
                id: decoded.id,
                username: decoded.username, // Assure-toi que ces informations sont présentes dans ton JWT
                role: decoded.role,
            }
        });
    } catch (error) {
        res.status(401).json({ message: "Token invalide" });
    }
});

// Route de vérification de l'authentification
router.get('/check-auth', (req, res) => {
    const token = req.cookies.authToken; // Vérifie le cookie authToken

    if (!token) {
        return res.status(401).json({ message: "Non authentifié" });
    }

    try {
        const decoded = jwt.verify(token, '6e6XRsVRQGFed7SaGs4sWoD2x3VonNCn7LLxoR1d1M_uU_UGt9WtwNbut7futfFh');
        res.status(200).json({ user: decoded });
    } catch (error) {
        res.status(401).json({ message: "Token invalide" });
    }
});

module.exports = router;