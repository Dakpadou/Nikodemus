const express = require('express');
const app = express();
const mysql = require('mysql2');
const router = express.Router();
const config = require('../config'); // import de la connexion à la BDD
const jwt = require('jsonwebtoken');

// route login
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    console.log(email, password, req.body);

    try {
        const sql = 'SELECT id, username, email, role FROM USER WHERE email = ? AND password = ?';
        const [rows] = await config.execute(sql, [email, password]);
        
        if (rows.length > 0) {
            res.status(200).json({
                message: 'Utilisateur trouvé',
                user: rows[0],
                token: jwt.sign(
                    { id: rows[0].id }, // Ajout de l'ID de l'utilisateur dans le token
                    '6e6XRsVRQGFed7SaGs4sWoD2x3VonNCn7LLxoR1d1M_uU_UGt9WtwNbut7futfFh',
                    { expiresIn: '24h' } // Déplacement de l'option dans le bon endroit
                )
            });
        } else {
            res.status(401).json({
                message: 'Email ou mot de passe incorrect'
            });
        }
    } catch (error) {
        console.log('Erreur lors de la connexion', error);
        
        res.status(500).json({
            message: 'Erreur interne du serveur'
        });
    }
});

module.exports = router;
