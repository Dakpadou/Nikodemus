import React, { useState, useEffect } from "react";
import axios from "axios";

const Category = () => {
    const [data, setData] = useState([]); // constante data (tableau vide)
    useEffect(() => {
        axios.get('http://localhost:3000/category') // recuperation sur BDD
            .then(res => {
                setData(res.data); // màj de data avec les données de l'api
                console.log(res.data);
            })
            .catch(err => {         // gestion d'erreur
                console.log(err, 'Erreur lors de la récupération des données');
            });
    }, []); 


return (
    <>
        <div>
        {data.map((categorydata) => (
            <article key={categorydata.id}>
            <p> {categorydata.Titre}</p>
            <p> {categorydata.presentation}</p>
            </article>
        ))}
            
        </div>
    </>
);
};

export default Category;