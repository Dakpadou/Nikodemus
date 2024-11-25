const express = require('express');
const app = express();
const mysql = require('mysql2');
const router = express.Router();
const config = require('../config'); // Import de la connexion à la BDD
const bodyParser = require('body-parser'); // Parser des données
const multer = require('multer'); // Multer pour l'upload des fichiers
const path = require('path'); // Import de "path"

// Configuration de Multer pour gérer les uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.resolve(__dirname, '../uploads'); // Dossier de destination
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase(); // Récupère l'extension
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Taille max : 5 Mo
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/; // Types autorisés
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extname && mimeType) {
            return cb(null, true); // Fichier autorisé
        } else {
            cb(new Error('Format de fichier non autorisé')); // Fichier rejeté
        }
    }
});


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

router.get('/cat/:id/formations', async (req, res) => {
    const categoryId = req.params.id;

    const sql = `
        SELECT f.id, f.Titre, f.presentation, f.image, f.prix 
        FROM formacat fc
        JOIN formation f ON fc.formation_id = f.id
        WHERE fc.category_id = ?
    `;

    try {
        const [rows] = await config.execute(sql, [categoryId]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Aucune formation trouvée pour cette catégorie.",
                success: false,
            });
        }

        res.status(200).json({ data: rows, success: true });
    } catch (error) {
        console.error("Erreur lors de la récupération des formations :", error);
        res.status(500).json({ message: "Erreur serveur", success: false });
    }
});


router.post('/formation/assign-categories/:formationId', async (req, res) => {
    const formationId = req.params.formationId;
    const { categories } = req.body;

    if (!categories || !Array.isArray(categories)) {
        return res.status(400).json({ message: "Données invalides : 'categories' doit être un tableau." });
    }

    try {
        // Supprimer les catégories existantes pour la formation
        await config.query("DELETE FROM formacat WHERE formation_id = ?", [formationId]);

        // Insérer les nouvelles catégories
        for (const categoryId of categories) {
            await config.query("INSERT INTO formacat (formation_id, category_id) VALUES (?, ?)", [formationId, categoryId]);
        }

        res.status(200).json({ message: "Catégories assignées avec succès." });
    } catch (error) {
        console.error("Erreur lors de l'assignation des catégories :", error);
        res.status(500).json({ message: "Erreur interne du serveur." });
    }
});

router.get('/formation/categories/:formationId', async (req, res) => {
    const formationId = req.params.formationId;

    const sql = `
        SELECT c.id AS category_id, c.name AS category_name
        FROM formacat fc
        JOIN category c ON fc.category_id = c.id
        WHERE fc.formation_id = ?
    `;

    try {
        const [rows] = await config.execute(sql, [formationId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Aucune catégorie assignée.", success: false });
        }
        res.status(200).json({ data: rows, success: true });
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories assignées :", error);
        res.status(500).json({ message: "Erreur serveur", success: false });
    }
});

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

router.put('/update/:id', upload.single('image'), async (req, res) => {
    const { name, presentation } = req.body;
    const image = req.file ? req.file.filename : null; // Ajoutez l'image seulement si elle existe
    
    if (!name || !presentation) {
        return res.status(400).json({ error: "All fields (name, presentation) are required" });
    }

    try {
        const sql = `
            UPDATE CATEGORY 
            SET name = ?, presentation = ?${image ? ', image = ?' : ''} 
            WHERE id = ?
        `;
        const params = image ? [name, presentation, image, req.params.id] : [name, presentation, req.params.id];

        await config.query(sql, params);

        return res.status(200).json({ message: "Category updated successfully" });
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        res.status(500).json({ error: "Erreur serveur" });
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

