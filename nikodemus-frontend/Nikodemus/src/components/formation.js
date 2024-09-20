import React, { useState, useEffect } from "react";
import React from "react";
import axios from "axios";

const formation = () => {
    const [data, setData] = useState(null); // constante data (tableau vide)
    useEffect (() => {
        axios.get('http://localhost:3000/formation') // recuperation sur BDD
        .then(res => {
            setData(res.data); // màj de data avec les données de l'api
            console.log(data);
        })
        .catch(err => {         // gestion d'erreur
            console.log(err, 'Erreur lors de la récupération des données');
        });
    }, []); // fin du useEffect, le tableau représente des param optionnels
};

return (
    <>
    <div>
        coucou
    </div>
    </>
);

export default formation;