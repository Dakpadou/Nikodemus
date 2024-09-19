const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');

//notif de démarrage sur console
app.listen(port, () => {
    console.log(`Serveur Express démarré sur http://localhost:${port}`);
})

// connexion à la bdd
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'nikodemus'
});

// Root 
app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/about', (req, res) => {
    res.send('about')
});

// Route pour "/about"
app.get('/about', (req, res) => {
    res.send('À propos de nous : Ce site est un exemple simple d\'application Express.js.');
});

//  route page formation
app.get('/formation', (req, res) => {
    const query = 'SELECT Titre, presentation, image, prix  FROM FORMATION;';
    connection.query(query, (err, results) => {
        if (err) {
            console.log('erreur lors de léxécution de la requête', err);
            res.status(500).send('Erreur interne du serveur');
            return;
        }
        res.json(results);
    });

});

//  route page catégorie
app.get('/categories', (req, res) => {

    const query = 'SELECT name, presentation, image FROM CATEGORY';
    connection.query(query, (err, results) => {
        if (err) {
            console.log('erreur lors de léxécution de la requête', err);
            res.status(500).send('Erreur interne du serveur');
            return;
        }
        res.json(results);
    });
});


// fonction test de connexion a la bdd
async function tryConnection() {
    try {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'nikodemus'
        });
        console.log('connected');
        //   console.log(connection);
    } catch (error) {
        console.log('try again');
    }

};
tryConnection();


  
