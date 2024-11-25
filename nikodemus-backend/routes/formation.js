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
    const sql = 'SELECT id, Titre, presentation, prix, image FROM FORMATION WHERE id=?';

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

router.get('/getfull/:id', async (req, res) => {

    const formationId = req.params.id;
    const sql = 'SELECT id, Titre, presentation, prix, image , content FROM FORMATION WHERE id=?';

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

// recuper les formation by trainer
router.get('/trainer/:id', async (req, res) => {
    const userId = req.params.id;

    const sql = 'SELECT id, Titre, presentation, prix, image , content FROM formation WHERE author = ?';

    try {
        const [rows] = await config.query(sql, [userId]);

        if (rows.length === 0) {
            return res.status(404).json({
                message: 'Aucune formation trouvée pour cet utilisateur.',
                success: false
            });
        }

        return res.status(200).json({
            data: rows,
            success: true
        });
    } catch (err) {
        console.error('Erreur lors de la récupération des formations :', err);
        return res.status(500).json({
            message: 'Erreur interne du serveur',
            success: false
        });
    }
});

// route page afficher formation dans leur catégorie
router.get('/incategory/:id', async (req, res) => {
    const categoryId = req.params.id;  
    const sql = `SELECT f.id, f.Titre, f.presentation, f.image, f.prix, c.name as category_name
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
    const { titre, presentation, prix, content, author } = req.body; // Ajout de `author`
    console.log(req.body);

    const sqlFormation = 'INSERT INTO formation (titre, presentation, prix, image, content, author) VALUES (?, ?, ?, ?, ?, ?)';
    const sqlFormacat = 'INSERT INTO formacat (formation_id, category_id) VALUES (?, ?)';

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

        // Insère les données dans la table formation
        const image = `resized-${originalFile}`;
        const [resultFormation] = await config.execute(sqlFormation, [titre, presentation, prix, image, content, author]);

        // Récupère l'ID de la formation insérée
        const formationId = resultFormation.insertId;

        // Insère les données dans la table formacat
        const categoryId = 1; // Catégorie par défaut
        await config.execute(sqlFormacat, [formationId, categoryId]);

        // Réponse de succès
        return res.status(201).json({
            message: 'Formation ajoutée avec succès avec image redimensionnée',
            success: true,
            data: { titre, presentation, prix, image, content, author, formationId, categoryId }
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

router.put('/update/:id', upload.single('image'), async (req, res) => {
    const { titre, presentation, prix, content, currentImage } = req.body;
    const formationId = req.params.id;

    try {
        // Si une nouvelle image est envoyée, utilisez-la ; sinon, conservez l'image actuelle
        const image = req.file ? req.file.filename : currentImage;

        // Mise à jour des données dans la base de données
        const sql = `
            UPDATE formation 
            SET titre = ?, presentation = ?, prix = ?, content = ?, image = ? 
            WHERE id = ?`;
        const result = await config.execute(sql, [
            titre || null,
            presentation || null,
            prix || null,
            content || null,
            image,
            formationId
        ]);

        return res.status(200).json({
            success: true,
            message: "Formation mise à jour avec succès.",
            data: { titre, presentation, prix, content, image }
        });
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        return res.status(500).json({
            success: false,
            message: "Erreur interne du serveur."
        });
    }
});






module.exports = router;

