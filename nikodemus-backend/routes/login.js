const express = require('express');
const app = express();
const mysql = require('mysql2');
const router = express.Router();
const config = require('../config'); // import de la connexion à la BDD
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

// route login
router.post('/', async (req, res) => {
    const { email, password } = req.body;
    console.log('Requête reçue avec :', { email, password });

    try {
        // Crypter le mot de passe reçu pour comparaison
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Mot de passe reçu (haché pour test) :', hashedPassword);

        // Requête SQL pour récupérer l'utilisateur
        const sql = 'SELECT id, username, email, password, role FROM USER WHERE email = ?';
        const [rows] = await config.execute(sql, [email]);

        if (rows.length > 0) {
            const user = rows[0];
            console.log('Utilisateur trouvé :', user);

            // Comparaison du mot de passe reçu avec celui en base
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log('Mot de passe valide :', isPasswordValid);

            if (isPasswordValid) {
                const token = jwt.sign(
                    { id: user.id, role: user.role },
                    '6e6XRsVRQGFed7SaGs4sWoD2x3VonNCn7LLxoR1d1M_uU_UGt9WtwNbut7futfFh',
                    { expiresIn: '24h' }
                );

                res.cookie('authToken', token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000,
                });

                return res.status(200).json({
                    message: 'Connexion réussie',
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                    },
                });
            } else {
                console.error('Mot de passe incorrect');
                return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            }
        } else {
            console.error('Utilisateur introuvable');
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
    } catch (error) {
        console.error('Erreur lors de la connexion', error);
        return res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});


module.exports = router;
