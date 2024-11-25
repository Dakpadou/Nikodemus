const express = require('express');
const app = express();
const mysql = require('mysql2');
const router = express.Router();
const config = require('../config'); // import de la connection a la bdd
const bodyParser = require('body-parser'); //parser des data


//  route page toutes categories
router.get('/', async (req, res) => {
    try {
        const [rows, fields] = await config.query('SELECT id, name, presentation, image  FROM CATEGORY'); //table category
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
            const [result] = await config.execute(sql, [name, presentation]);
            const newCategoryId = result.insertId;

            // Récupérer la nouvelle catégorie pour le tableau
            const [rows] = await config.execute('SELECT * FROM category WHERE id = ?', [newCategoryId]);

            if (rows.length > 0) {
                console.log('Categorie ajoutée avec succès:', rows[0]);
                return res.status(201).json(rows[0]); // Retourner la nouvelle catégorie
            } else {
                return res.status(500).json({
                    message: 'Erreur lors de la récupération de la nouvelle catégorie',
                    success: false,
                });
            }
        } catch (err) {
            console.error('Erreur lors de l\'insertion:', err);
            return res.status(500).json({
                message: 'Erreur interne du serveur',
                success: false,
            });
        }
    } else {
        return res.status(400).json({
            message: 'Données manquantes',
            success: false,
        });
    }
});


// Route modifier les categories

router.put('/update/:id', async (req, res) => {
    const id = req.params.id; 
    const { name, presentation, image } = req.body; 

    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Valid category ID is required" });
    }

    if (!name || !presentation || !image) {
        return res.status(400).json({ error: "All fields (name, presentation, image) are required" });
    }

    try {
        const query = `UPDATE CATEGORY SET name = ?, presentation = ?, image = ? WHERE id = ?`;
        const values = [name, presentation, image, id];
        const [result] = await config.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Category not found" });
        }

        res.json({ message: "Category updated successfully" });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Error updating category" });
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

