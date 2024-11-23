const express = require('express');
const app = express();
const mysql = require('mysql2');
const router = express.Router();
const config = require('../config'); // import de la connexion à la BDD
const jwt = require('jsonwebtoken');


// route login
router.post('/', async (req, res) => {
    const { email, password } = req.body;
    try {
        const sql = 'SELECT id, username, email, role FROM USER WHERE email = ? AND password = ?';
        const [rows] = await config.execute(sql, [email, password]);

        if (rows.length > 0) {
            const token = jwt.sign(
                { id: rows[0].id, role: rows[0].role }, // Inclure l'ID et le rôle dans le token
                '6e6XRsVRQGFed7SaGs4sWoD2x3VonNCn7LLxoR1d1M_uU_UGt9WtwNbut7futfFh', // Secret
                { expiresIn: '24h' }
            );

            res.cookie('authToken', token, {
                httpOnly: true, // cookie est accessible uniquement par le serveur
                maxAge: 24 * 60 * 60 * 1000, // Expiration 24h
            });

            res.status(200).json({
                message: 'Utilisateur trouvé',
                user: rows[0],
            });
        } else {
            res.status(401).json({
                message: 'Email ou mot de passe incorrect',
            });
        }
    } catch (error) {
        console.error('Erreur lors de la connexion', error);
        res.status(500).json({
            message: 'Erreur interne du serveur',
        });
    }
});

module.exports = router;
