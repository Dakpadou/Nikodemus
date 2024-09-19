const express = require('express');
const app = express();
const mysql = require('mysql2');
const router = express.Router();
const config = require('../config'); // import de la connection a la bdd


//  route page formation
router.get('/', async (req, res) => {
    try {
        const [rows, fields] = await config.query('SELECT Titre, presentation, image, prix  FROM FORMATION'); //table formation
        res.json(rows);
    } catch (error) {
        console.error(error)
        res.status(500).send('Erreur interne du serveur');

    }
}
);


module.exports = router;

