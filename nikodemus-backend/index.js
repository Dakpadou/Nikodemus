const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');

//const des routes
const formationRoute = require('./routes/formation');
const categoryRoute = require('./routes/category');

// accepter cross origin 

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});


//appel des routes
app.use('/formation', formationRoute);
app.use('/category', categoryRoute);






//notif de démarrage sur console
app.listen(port, () => {
    console.log(`Serveur Express démarré sur http://localhost:${port}`);
})




app.get('/about', (req, res) => {
    res.send('about')
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