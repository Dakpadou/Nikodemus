import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const ManageCategory = () => {
    const [data, setData] = useState([]); // constante data (tableau vide)
    const navigate = useNavigate(); // Hook pour naviguer entre les pages

    useEffect(() => {
        axios.get('http://localhost:3000/category') // recuperation sur BDD
            .then(res => {
                setData(res.data); // màj de data avec les données de l'api
                console.log(res.data);
            })
            .catch(err => {         // gestion d'erreur
                console.log(err, 'Erreur lors de la récupération des données');
            });
    }, []); // le tableau vide représente des param optionnels


    // Fonction pour supprimer 1 catégorie
    const handleDelete = (id) => {
        console.log('suppression en cours');
        console.log(id);

        axios.delete(`http://localhost:3000/category/delete/${id}`)


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
                <h2>Liste des catégories</h2>

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Présentation</th>
                            <th>Actions</th>
                        </tr>
                    </thead>


                    <tbody>
                        {data.map((categorydata) => (
                            <tr key={category.id}>
                                <td>{category.id}</td>
                                <td>{category.name}</td>
                                <td>{category.presentation}</td>                          
                                <td>
                                    <button onClick={() => handleDelete(category.id)} >Supprimer</button>
                                    <button onClick={() => handleEdit(category.id)}>Éditer</button>
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

export default ManageCategory;
