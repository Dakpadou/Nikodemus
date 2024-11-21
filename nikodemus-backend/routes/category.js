const express = require('express');
const app = express();
const mysql = require('mysql2');
const router = express.Router();
const config = require('../config'); // import de la connection a la bdd
const bodyParser = require('body-parser'); //parser des data


//  route page toutes categories
router.get('/', async (req, res) => {
    try {
        const [rows, fields] = await config.query('SELECT name, presentation, image  FROM CATEGORY'); //table category
        res.json(rows);
    }
    catch (error) {
        console.error(error)
        res.status(500).send('Erreur interne du serveur');

    }
}
);

// Route  récupérer les catégories (id + name uniquement)
router.get('/shortcategory', async (req, res) => {
    const sql = 'SELECT id, name FROM CATEGORY';

    try {
        const [result] = await config.execute(sql);
        return res.status(200).json(result);
    } catch (err) {
        console.error("Erreur lors de la récupération des catégories :", err);
        return res.status(500).json({ message: "Erreur interne du serveur" });
    }
});



// route page category par id

router.get('/:id', async (req, res) => {

    const categoryId = req.params.id;
    const sql = 'SELECT id, name, presentation FROM CATEGORY WHERE id=?'; // constante de stockage de la requête

    try {
               const [rows, fields] = await config.query(sql, [categoryId]); // execution de la requete sql

        if (rows.length === 0) {
            return res.status(404).json({
                message:'catégorie non trouvée', success: false
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

// route ajout categorie

router.use(bodyParser.json());

router.post('/add', async (req, res) => {
    const { name, presentation } = req.body;
    const sql = 'INSERT INTO category (name, presentation) VALUES (?, ?)';

    if (Object.keys(req.body).length !== 0) {
        console.log('Données reçues:', req.body);

        try {
            // Exécution de la requête avec une promesse
            const [result] = await config.execute(sql, [name, presentation]);

            // Log après succès de l'insertion
            console.log('categorie ajoutée avec succès:', result);

            // Réponse statut 201 après succès de l'insertion
            return res.status(201).json({
                message: 'categorie ajoutée avec succès',
                success: true,
                data: { name, presentation }
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

// Route modifier les categories

router.put('/update/:id', async (req, res) => {
    const categoryId = req.params.id;
    const { name, presentation } = req.body;

    const sql = 'UPDATE category SET name = ?, presentation = ? WHERE id = ?';

    try {
        const [result] = await config.execute(sql, [name, presentation, categoryId]);
        console.log('categorie màj avec succès', result);

        return res.status(200).json({
            message: 'categorie màj avec succès',
            success: true,
            data: { name, presentation }
        });
    } catch (err) {
        console.error('Erreur lors de la màj', err);
        return res.status(500).json({
            message: 'Erreur interne du serveur',
            success: false
        });
    }
});

// route supprimer une catégorie

router.delete('/delete/:id', async (req, res) => {
    const categoryId = req.params.id;
    const sql2 = 'DELETE FROM FORMACAT WHERE category_id=?'
    const sql = 'DELETE FROM category WHERE id = ?';
    

    //exécution de la requete suppression avec promesse
    try {
        
        const [result2] = await config.execute(sql2, [categoryId]);
        console.log('Catégorie supprimée pour les formations');

        if (result2.affectedRows === 0) {
            console.log ('La catégorie n\'a pas de formation');           
        }
        
        const [result] = await config.execute(sql, [categoryId]);
        console.log('catégorie supprimée');

        // gestion en cas d'item non trouvé
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: 'catégorie non trouvée',
                success: false
            });
        }
        // réponse 201 avec statut succès
        return res.status(201).json({
            message: 'catégorie supprimée',
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


module.exports = router;

