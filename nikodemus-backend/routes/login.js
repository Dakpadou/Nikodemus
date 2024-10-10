const express = require('express');
const app = express();
const mysql = require('mysql2');
const router = express.Router();
const config = require('../config'); // import de la connection a la bdd

// route login

router.post('/', async (req, res) => {
    
    const { email, password } = req.body;
    
    console.log(email, password, req.body);

    try {
        const sql = 'SELECT username, email, role FROM USER WHERE email= ? AND password= ? ';
        const [rows] = await config.execute(sql, [email, password]);
        
        if (rows.length > 0) {
            res.status(200).json({
                message : 'Utilisateur trouvé',
                user : rows[0],
                
            });
        } else {
            res.status(401).json({
                message: 'email ou mot de passe incorrect'
            });
        }
    } catch (error) {

        console.log('erreur lors de la connexion', error);
        
        res.status(500).json({
            message: 'Erreur interne du serveur'
        });

    }

});

module.exports = router;

