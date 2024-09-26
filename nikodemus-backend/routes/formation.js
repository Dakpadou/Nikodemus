const express = require('express');
const app = express();
const mysql = require('mysql2');
const router = express.Router();
const config = require('../config'); // import de la connection a la bdd
const bodyParser = require('body-parser'); //parser des data



//  route page formation
router.get('/koala', async (req, res) => {
    try {
        const [rows, fields] = await config.query('SELECT id, Titre, presentation, image, prix FROM FORMATION'); //table formation
        res.json(rows);
    } catch (error) {
        console.error(error)
        res.status(500).send('Erreur interne du serveur');

    }
}
);

// route page ajout formation

router.use(bodyParser.json());

router.post('/add', async (req, res) => {
    const { Titre, presentation, image, prix } = req.body;
    
    if (Titre && presentation && image && prix) {
        res.json({ message: 'Données valides', success: true, data: { Titre, presentation, image, prix } });
    }
    else {
        res.status(400).json({ message: 'Données manquantes', success: false });
    }
    console.log(req.body);
    }
    
);



module.exports = router;

