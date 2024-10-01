import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Pour récupérer l'ID depuis l'URL

const FormationById = () => {
    const [formation, setFormation] = useState(null); // Initialisation à 'null' pour indiquer un chargement en cours
    const { id } = useParams(); // Extraction de l'ID depuis les paramètres d'URL

    useEffect(() => {
        // Appel API pour récupérer la formation avec l'ID
        axios.get(`http://localhost:3000/formation/${id}`)
            .then(res => {
                setFormation(res.data); // Mise à jour des données
                console.log(res.data); // Affichage dans la console pour vérification
            })
            .catch(err => {
                console.error(err, 'Erreur lors de la récupération des données');
            });
    }, [id]); // L'effet s'exécute à chaque changement de 'id'

    if (!formation) {
        return <p>Chargement des données...</p>; // Afficher un message pendant le chargement
    }

    return (
        <div>
            <article>
                <h2>{formation.data.Titre}</h2>
                <p><strong>Présentation:</strong> {formation.data.presentation}</p>
                <p><strong>Prix:</strong> {formation.data.prix} €</p>
            </article>
        </div>
    );
};

export default FormationById;