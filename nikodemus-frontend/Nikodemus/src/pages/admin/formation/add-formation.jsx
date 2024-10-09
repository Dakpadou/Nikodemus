import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ManageFormation from "../../../components/manageformation";






const AddFormation = () => {
    const [data, setData] = useState({
        titre: "",
        presentation: "",

        prix: ""
    });

    const handleChange = (e) => {
        const value = e.target.value;
        setData({
            ...data,
            [e.target.name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();


        axios.post("http://localhost:3000/formation/add", data, {
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    };


    return (
        <>
            <h2>ajout formation</h2>
            <form onSubmit={handleSubmit}>
                <label>Titre</label>
                <input type="text" name="titre" value={data.titre} onChange={handleChange} />
                <label>Presentation</label>
                <input type="text" name="presentation" value={data.presentation} onChange={handleChange} />

                <label>Prix</label>
                <input type="text" name="prix" value={data.prix} onChange={handleChange} />
                <button type="submit">Ajouter</button>

            </form>

            <ManageFormation />


        </>
    )
};

export default AddFormation;