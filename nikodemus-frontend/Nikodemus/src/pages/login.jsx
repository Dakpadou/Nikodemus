// Write your code here
import React, { useState } from "react";
import axios from "axios";


const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const apiUrl = import.meta.env.VITE_API_URL;


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(apiUrl);

        console.log(email, password);

        const data = {
            email,
            password,
        };
//`${apiUrl}/login`
        const response = axios.post(`http://localhost:3000/login/`, data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(data);


    }


    return (
        <>
            <div>
                <h2>Se connecter</h2>

                <form onSubmit={handleSubmit}>

                    <label>Email</label>
                    <input type="text" name="titre" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label>Mot de passe</label>
                    <input type="text" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Connexion</button>

                </form>

            </div>
        </>
    );
}

export default Login;