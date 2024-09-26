import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";





const AddFormation = () => {
    const [data, setData] = useState({
        titre: "",
        presentation: "",
        image: "",
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
        const formData = new FormData();
        formData.append("titre", data.titre);
        formData.append("presentation", data.presentation);
        formData.append("image", data.image);
        formData.append("prix", data.prix);

        axios.post("http://localhost:3000/formation/add", formData)
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    };


    return (
        <>
            <h1>ajout formation</h1>
            <form onSubmit={handleSubmit}>
                <label>Titre</label>
                <input type="text" name="titre" value={data.titre} onChange={handleChange} />
                <label>Presentation</label>
                <input type="text" name="presentation" value={data.presentation} onChange={handleChange} />
                <label>Image</label>
                <input type="file"  accept="image,jpg,png" name="image" value={data.image} onChange={handleChange} />
                <label>Prix</label>
                <input type="text" name="prix" value={data.prix} onChange={handleChange} />
                <button type="submit">Ajouter</button>

            </form>

        </>
    )
};

export default AddFormation;