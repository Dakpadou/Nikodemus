const express = require('express');
const app = express();
const mysql = require('mysql2');
const router = express.Router();
const config = require('../config'); // import de la connection a la bdd

// route login

router.post('/', async (req, res) => {
    const { email , password } = req.body;

    console.log(email , password);
    
    
});

module.exports = router;

