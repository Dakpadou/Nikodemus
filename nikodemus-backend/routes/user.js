const express = require('express');
const app = express();
const mysql = require('mysql2');
const router = express.Router();
const config = require('../config'); // import de la connection a la bdd
const bodyParser = require('body-parser'); //parser des data
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const { log } = require('console');


// route pour remonter les formations

router.get('/myformation/:id', async (req, res) => {

    const formationId = req.params.id;
    const sql = 'SELECT f.id, f.Titre, f.presentation, f.image FROM user_order uo JOIN formation f ON uo.formation_id = f.id WHERE uo.user_id = ?';

    try {
        const [rows, fields] = await config.query(sql, [formationId]); // Exécution de la requête SQL

        if (rows.length === 0) {
            return res.status(404).json({
                message: 'Aucune formation trouvée', success: false
            });
        }

        return res.status(200).json({
            data: rows, success: true // Envoi de toutes les formations
        });
    } catch (error) {
        console.error('Erreur serveur:', error);
        return res.status(500).json({
            message: 'Erreur interne du serveur', success: false
        });
    }
});


module.exports = router;
