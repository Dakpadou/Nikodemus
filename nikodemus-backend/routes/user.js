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

router.get('/ordersbyuser/:id', async (req, res) => {
    const userId = req.params.id;
    console.log(req.params.id);
    const sql = `
        SELECT formation_id 
        FROM user_order 
        WHERE user_id = ? AND order_id IS NOT NULL`; // Vérifie les commandes valides (avec un ID de commande)

    try {
        const [rows] = await config.execute(sql, [userId]);
        res.status(200).json({ data: rows.map((row) => row.formation_id) }); // Retourne un tableau d'IDs de formations
    } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.get('/content/:formationId/:userId', async (req, res) => {
    const { formationId, userId } = req.params;

    const sqlCheck = `
        SELECT COUNT(*) AS hasAccess
        FROM user_order 
        WHERE user_id = ? AND formation_id = ? AND order_id IS NOT NULL
    `;

    const sqlContent = `
        SELECT Titre, presentation, prix, content , image 
        FROM formation 
        WHERE id = ?
    `;

    try {
        // Vérifie si l'utilisateur a accès à la formation
        const [checkResult] = await config.execute(sqlCheck, [userId, formationId]);
        if (checkResult[0].hasAccess === 0) {
            return res.status(403).json({ message: "Accès refusé : vous n'avez pas acheté cette formation." });
        }

        // Récupère le contenu complet de la formation
        const [contentResult] = await config.execute(sqlContent, [formationId]);
        if (contentResult.length === 0) {
            return res.status(404).json({ message: "Formation non trouvée." });
        }

        res.status(200).json({ data: contentResult[0] });
    } catch (error) {
        console.error("Erreur lors de la récupération du contenu :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


module.exports = router;
