const express = require('express');
const app = express();
const mysql = require('mysql2');
const router = express.Router();
const config = require('../config'); // import de la connexion à la BDD
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// route login

// Route d'inscription
router.post('/user', async (req, res) => {
    const { username, email, password } = req.body;
    console.log('Mot de passe saisi :', password);
    console.log('Mot de passe saisi :', email);
    if (!username || !email || !password) {
        return res.status(400).json({
            message: 'Tous les champs sont requis'
        });
    }

    try {
        // Vérification si l'email existe déjà
        const sqlCheck = 'SELECT * FROM USER WHERE email = ?';
        const [existingUser] = await config.execute(sqlCheck, [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({
                message: 'Cet email est déjà utilisé'
            });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10); // Hachage avec un coût de 10
        console.log('Mot de passe haché :', hashedPassword);
        // Insertion de l'utilisateur dans la base de données
        const sqlInsert = 'INSERT INTO USER (username, email, password, role, create_time) VALUES (?, ?, ?, ?, NOW())';
        const [result] = await config.execute(sqlInsert, [username, email, hashedPassword, 3]); // Role 3 par défaut

        // Génération d'un token JWT pour l'utilisateur nouvellement créé
        const token = jwt.sign(
            { id: result.insertId, role: 3 }, // ID de l'utilisateur et rôle 3
            '6e6XRsVRQGFed7SaGs4sWoD2x3VonNCn7LLxoR1d1M_uU_UGt9WtwNbut7futfFh', // Secret key
            { expiresIn: '24h' }
        );

        // Envoyer le token en tant que cookie
        res.cookie('authToken', token, {
            httpOnly: true, // Sécurise l'accès au cookie
            maxAge: 24 * 60 * 60 * 1000, // 24h
        });

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: {
                id: result.insertId,
                username,
                email,
                role: 3,
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription', error);
        res.status(500).json({
            message: 'Erreur interne du serveur',
        });
    }
});

router.post('/admin', async (req, res) => {
    const { username, email, password } = req.body;
    console.log('Mot de passe saisi :', password);
    console.log('Mot de passe saisi :', email);
    if (!username || !email || !password) {
        return res.status(400).json({
            message: 'Tous les champs sont requis'
        });
    }

    try {
        // Vérification si l'email existe déjà
        const sqlCheck = 'SELECT * FROM USER WHERE email = ?';
        const [existingUser] = await config.execute(sqlCheck, [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({
                message: 'Cet email est déjà utilisé'
            });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10); // Hachage avec un coût de 10
        console.log('Mot de passe haché :', hashedPassword);
        // Insertion de l'utilisateur dans la base de données
        const sqlInsert = 'INSERT INTO USER (username, email, password, role, create_time) VALUES (?, ?, ?, ?, NOW())';
        const [result] = await config.execute(sqlInsert, [username, email, hashedPassword, 1]); // Role 3 par défaut

        // Génération d'un token JWT pour l'utilisateur nouvellement créé
        const token = jwt.sign(
            { id: result.insertId, role: 1 }, // ID de l'utilisateur et rôle 3
            '6e6XRsVRQGFed7SaGs4sWoD2x3VonNCn7LLxoR1d1M_uU_UGt9WtwNbut7futfFh', // Secret key
            { expiresIn: '24h' }
        );

        // Envoyer le token en tant que cookie
        res.cookie('authToken', token, {
            httpOnly: true, // Sécurise l'accès au cookie
            maxAge: 24 * 60 * 60 * 1000, // 24h
        });

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: {
                id: result.insertId,
                username,
                email,
                role: 3,
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription', error);
        res.status(500).json({
            message: 'Erreur interne du serveur',
        });
    }
});

router.post('/trainer', async (req, res) => {
    const { username, email, password } = req.body;
    console.log('Mot de passe saisi :', password);
    console.log('Mot de passe saisi :', email);
    if (!username || !email || !password) {
        return res.status(400).json({
            message: 'Tous les champs sont requis'
        });
    }

    try {
        // Vérification si l'email existe déjà
        const sqlCheck = 'SELECT * FROM USER WHERE email = ?';
        const [existingUser] = await config.execute(sqlCheck, [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({
                message: 'Cet email est déjà utilisé'
            });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10); // Hachage avec un coût de 10
        console.log('Mot de passe haché :', hashedPassword);
        // Insertion de l'utilisateur dans la base de données
        const sqlInsert = 'INSERT INTO USER (username, email, password, role, create_time) VALUES (?, ?, ?, ?, NOW())';
        const [result] = await config.execute(sqlInsert, [username, email, hashedPassword, 2]); // Role 3 par défaut

        // Génération d'un token JWT pour l'utilisateur nouvellement créé
        const token = jwt.sign(
            { id: result.insertId, role: 2 }, // ID de l'utilisateur et rôle 3
            '6e6XRsVRQGFed7SaGs4sWoD2x3VonNCn7LLxoR1d1M_uU_UGt9WtwNbut7futfFh', // Secret key
            { expiresIn: '24h' }
        );

        // Envoyer le token en tant que cookie
        res.cookie('authToken', token, {
            httpOnly: true, // Sécurise l'accès au cookie
            maxAge: 24 * 60 * 60 * 1000, // 24h
        });

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: {
                id: result.insertId,
                username,
                email,
                role: 3,
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription', error);
        res.status(500).json({
            message: 'Erreur interne du serveur',
        });
    }
});

module.exports = router;