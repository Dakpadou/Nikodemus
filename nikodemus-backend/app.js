const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const cors = require('cors');




//import des routes
const formationRoute = require('./routes/formation');
const categoryRoute = require('./routes/category');
const loginRoute = require('./routes/login');
const path = require('path');
const authRoute = require('./routes/auth');
const sub = require('./routes/subscribe');
const Checkout = require('./routes/checkout');
const UserRoute = require('./routes/user');
const admin = require('./routes/admin');







//lire les photos pour le front
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// lire du json 
app.use(express.json());





// accepter cross origin avec CORS

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));




//appel des routes
app.use('/formation', formationRoute);
app.use('/category', categoryRoute);
app.use('/login', loginRoute);
app.use('/auth', authRoute);
app.use('/sub', sub);
app.use('/checkout', Checkout);
app.use('/user', UserRoute);
app.use('/admin', admin);









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