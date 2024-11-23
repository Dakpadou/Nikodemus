const express = require('express');
const app = express();
const mysql = require('mysql2');
const router = express.Router();
const config = require('../config'); // import de la connection a la bdd
const bodyParser = require('body-parser'); //parser des data
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');




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


// route page afficher formation dans leur catégorie
router.get('/incategory/:id', async (req, res) => {
    const categoryId = req.params.id;  
    const sql = `SELECT f.id, f.Titre, f.presentation, f.prix, c.name as category_name
                 FROM FORMATION f
                JOIN formacat fc ON f.id = fc.formation_id
                JOIN CATEGORY c ON fc.category_id = c.id
                WHERE c.id = ?`;

    try {
        const [rows, fields] = await config.query(sql, [categoryId]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Erreur interne du serveur');
    }
});

// gestion de l'ajout d'images aux formations
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
    limits: { fileSize: 5 * 1024 * 1024 }, // Taille max 5 Mo
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


// route page ajout formation

router.post('/add', upload.single('image'), async (req, res) => {
    const { titre, presentation, prix } = req.body;
    const sql = 'INSERT INTO formation (titre, presentation, prix, image) VALUES (?, ?, ?, ?)';

    try {
        // Vérifie si un fichier est présent et récupère son nom avec extension
        const originalFile = req.file ? req.file.filename : null;

        if (!originalFile) {
            return res.status(400).json({
                message: 'Aucune image fournie',
                success: false
            });
        }

        const uploadPath = path.resolve(__dirname, '../uploads'); // Chemin du dossier uploads
        const originalPath = path.join(uploadPath, originalFile); // Chemin complet de l'image originale
        const resizedPath = path.join(uploadPath, `resized-${originalFile}`); // Chemin de l'image redimensionnée

        // Redimensionnement avec Sharp (800x600)
        await sharp(originalPath)
            .resize(800, 600, { fit: 'cover' }) // Taille : 800x600 pixels
            .toFile(resizedPath); // Sauvegarde de l'image redimensionnée

        // Insère les données dans la base avec le nom du fichier redimensionné
        const image = `resized-${originalFile}`;
        const [result] = await config.execute(sql, [titre, presentation, prix, image]);

        // Réponse de succès
        return res.status(201).json({
            message: 'Formation ajoutée avec succès avec image redimensionnée',
            success: true,
            data: { titre, presentation, prix, image }
        });
    } catch (err) {
        console.error('Erreur lors de l\'insertion:', err);

        // En cas d'erreur, retourne une réponse appropriée
        return res.status(500).json({
            message: 'Erreur interne du serveur',
            success: false
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

