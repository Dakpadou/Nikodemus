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
        return res.status(500).send('Erreur interne du serveur');

    }
}
);


// route page formation par id

router.get('/:id', async (req, res) => {

    const formationId = req.params.id;
    const sql = 'SELECT id, Titre, presentation, prix FROM FORMATION WHERE id=?';

    try {
        const [rows, fields] = await config.query(sql, [formationId]); // execution de la requete sql

        if (rows.length === 0) {
            return res.status(404).json({
                message: 'Formation non trouvée', success: false
            });
        }

        return res.status(200).json({
            data: rows[0], success: true
        });
        console.log(rows);


    } catch (error) {
        console.error(error)
        return res.status(500).send('Erreur interne du serveur');

    }
}
);

// route page afficher formation par catégorie

router.get('/incategory/:id', async (req, res) => {
    
    const categoryId = req.params.id;
    const sql = 'SELECT FORMATION.id, titre, presentation, prix, image FROM formation JOIN FORMACAT ON FORMACAT.formation_id = FORMATION.id WHERE formacat.category_id = ?';

    try {
        const [rows, fields] = await config.query(sql, [categoryId]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: 'Aucune formation trouvée pour cette catégorie', success: false
            });
        }

        return res.status(200).json({
            data: rows, success: true
        });
    
    } catch (error) {
        console.error(error)
        return res.status(500).send('Erreur interne du serveur');
    }
});






// route page ajout formation

router.post('/add', async (req, res) => {
    const { titre, presentation, prix } = req.body; 
    const sqlFormation = 'INSERT INTO formation (titre, presentation, prix) VALUES (?, ?, ?)';
    const sqlFormacat = 'INSERT INTO formacat (formation_id) VALUES (?)';

    // Vérifie que les données nécessaires sont présentes
    if (!titre || !presentation || !prix ) {
        return res.status(400).json({
            message: 'Données manquantes (titre, présentation, prix)',
            success: false,
        });
    }

    try {
        // Utilisation d'une transaction
        const connection = await config.getConnection();
        await connection.beginTransaction();

        // Insère la formation dans la table `formation`
        const [formationResult] = await connection.execute(sqlFormation, [titre, presentation, prix]);
        const formationId = formationResult.insertId; // Récupère l'ID de la formation ajoutée

        // Insère dans la table de jointure `formacat`
        await connection.execute(sqlFormacat, [formationId]);

        // Validation de la transaction
        await connection.commit();
        connection.release();

        return res.status(201).json({
            message: 'Formation et association à la catégorie ajoutées avec succès',
            success: true,
            data: {
                titre,
                presentation,
                prix,
                
            },
        });
    } catch (err) {
        console.error('Erreur lors de l\'insertion:', err);

        // // Annule la transaction en cas d'erreur
        // if (connection) {
        //     await connection.rollback();
        //     connection.release();
        // }

        return res.status(500).json({
            message: 'Erreur interne du serveur',
            success: false,
        });
    }
});

// route delete pour formation

router.delete('/delete/:id', async (req, res) => {
    const formationId = req.params.id;
    const sql2 = 'DELETE FROM FORMACAT WHERE formation_id=?'
    const sql = 'DELETE FROM formation WHERE id = ?';


    //exécution de la requete suppression avec promesse
    try {

        const [result2] = await config.execute(sql2, [formationId]);
        console.log('Formation supprimée de la catégorie');

        if (result2.affectedRows === 0) {
            console.log('La formation n\'a pas de catégorie');
        }

        const [result] = await config.execute(sql, [formationId]);
        console.log('Formation supprimée');

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

});

// Route modifier les formations

router.put('/update/:id', async (req, res) => {
    const formationId = req.params.id;
    const { titre, presentation, prix } = req.body;

    const sql = 'UPDATE formation SET titre = ?, presentation = ?, prix = ? WHERE id = ?';

    try {
        const [result] = await config.execute(sql, [titre, presentation, prix, formationId]);
        console.log('Formation màj avec succès', result);

        return res.status(200).json({
            message: 'Formation màj avec succès',
            success: true,
            data: { titre, presentation, prix }
        });
    } catch (err) {
        console.error('Erreur lors de la màj', err);
        return res.status(500).json({
            message: 'Erreur interne du serveur',
            success: false
        });
    }
});





module.exports = router;

