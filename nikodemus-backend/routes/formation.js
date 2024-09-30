const express = require('express');
const app = express();
const mysql = require('mysql2');
const router = express.Router();
const config = require('../config'); // import de la connection a la bdd
const bodyParser = require('body-parser'); //parser des data



//  route page formation
router.get('/', async (req, res) => {
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
    const { titre, presentation, prix } = req.body;
    const sql = 'INSERT INTO formation (titre, presentation, prix) VALUES (?, ?, ?)';

    if (Object.keys(req.body).length !== 0) {
        console.log('Données reçues:', req.body);

        try {
            // Exécution de la requête avec une promesse
            const [result] = await config.execute(sql, [titre, presentation, prix]);

            // Log après succès de l'insertion
            console.log('Formation ajoutée avec succès:', result);

            // Réponse statut 201 après succès de l'insertion
            return res.status(201).json({
                message: 'Formation ajoutée avec succès',
                success: true,
                data: { titre, presentation, prix }
            });

        } catch (err) {
            // Log de l'erreur en cas de problème avec la requête
            console.error('Erreur lors de l\'insertion:', err);
            return res.status(500).json({
                message: 'Erreur interne du serveur',
                success: false
            });
        }

    } else {
        // Si les données sont manquantes
        return res.status(400).json({
            message: 'Données manquantes',
            success: false
        });
    }
});


// route delete pour formation

router.delete('/delete/:id', async (req, res) => {
    const formationId = req.params.id;
    const sql = 'DELETE FROM formation WHERE id = ?';

    //exécution de la requete suppression avec promesse
    try {
        const [result] = await config.execute(sql, [formationId]);
        console.log('Formation supprimée', result);
        
        // gestion en cas d'item non trouvé
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'Formation non trouvée',
                success: false
            });
        }
        // réponse 201 avec statut succès
        return res.status(201).json({
            message: 'Formation supprimée',
            success: true
        });
    }
    catch (err) {

        // log d'erreur et réponse avec statut
        console.error('Erreur a la suppression', err);
        return res.status(500).json({
            message: 'Erreur interne serveur',
            success: false
        });
    };

})



module.exports = router;

