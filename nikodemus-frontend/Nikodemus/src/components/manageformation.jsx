import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const ManageFormation = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [data, setData] = useState([]); // constante data (tableau vide)
    const navigate = useNavigate(); // Hook pour naviguer entre les pages

    useEffect(() => {
        axios.get(`${apiUrl}/formation`) // recuperation sur BDD
            .then(res => {
                setData(res.data); // màj de data avec les données de l'api
                console.log(res.data);
            })
            .catch(err => {         // gestion d'erreur
                console.log(err, 'Erreur lors de la récupération des données');
            });
    }, []); // fin du useEffect, le tableau vide représente des param optionnels


    // Fonction pour supprimer 1 formation
    const handleDelete = (id) => {
        console.log('ca supprime la');
        console.log(id);

        axios.delete(`${apiUrl}/formation/delete/${id}`)


            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            });

    };


    // Fonction pour rediriger vers le formulaire d'édition

    const handleEdit = (id) => {
        navigate(`/update/${id}`); // Redirection vers la page d'édition avec l'ID
    };


    return (
        <>
            <div>
                <h2>Liste des formations</h2>

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Titre</th>
                            <th>Prix</th>
                            <th>Actions</th>
                        </tr>
                    </thead>


                    <tbody>
                        {data.map((formationdata) => (
                            <tr key={formationdata.id}>
                                <td>{formationdata.id}</td>
                                <td>{formationdata.Titre}</td>

                                <td>{formationdata.prix}</td>
                                <td>
                                    <button onClick={() => handleDelete(formationdata.id)} >Supprimer</button>
                                    <button onClick={() => handleEdit(formationdata.id)}>
                                        Éditer
                                    </button>
                                </td>
                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>
        </>
    )
        ;
};

export default ManageFormation;

