const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const routeur = express.Router();

 
// Route pour "/about"
app.get('/about', (req, res) => {
    res.send('À propos de nous : Ce site est un exemple simple d\'application Express.js.');
});

module.exports = routeur;