import React, { useState, useEffect } from "react";
import axios from "axios";

const Formation = () => {
    const [data, setData] = useState([]); // constante data (tableau vide)
    useEffect(() => {
        axios.get('http://localhost:3000/formation') // recuperation sur BDD
            .then(res => {
                setData(res.data); // màj de data avec les données de l'api
                console.log(res.data);
            })
            .catch(err => {         // gestion d'erreur
                console.log(err, 'Erreur lors de la récupération des données');
            });
    }, []); // fin du useEffect, le tableau représente des param optionnels


return (
    <>
        <div>
                    {data.map((formationdata) => (
            <article key={formationdata.id}>
            <p> {formationdata.Titre}</p>
            <p> {formationdata.presentation}</p>
            </article>
        ))}
            
        </div>
    </>
);
};

export default Formation;