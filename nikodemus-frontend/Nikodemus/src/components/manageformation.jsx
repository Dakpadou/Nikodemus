import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageFormation = () => {
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
    }, []); // fin du useEffect, le tableau vide représente des param optionnels


    // Fonction pour supprimer 1 formation
    const handleDelete = (id) => {
        console.log('ca supprime la');
        console.log(id);

        axios.delete(`http://localhost:3000/formation/delete/${id}`)
    
        
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            });

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
                            <th>Présentation</th>
                            <th>Prix</th>
                            <th>Actions</th>
                            </tr>
                        </thead>
                        
                    
                        <tbody>
                        {data.map((formationdata) => (
                            <tr key={formationdata.id}>
                                <td>{formationdata.id}</td>
                                <td>{formationdata.Titre}</td>
                                <td>{formationdata.presentation}</td>
                                <td>{formationdata.prix}</td>
                                <td>
                                    <button onClick={() => handleDelete(formationdata.id)} >Supprimer</button>
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

