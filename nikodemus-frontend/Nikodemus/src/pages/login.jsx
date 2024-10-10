import React, { useState } from "react";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            email,
            password,
        };

        try {
            const response = await axios.post(`http://localhost:3000/login`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log(response.data);
            setMessage("Connexion réussie !"); // Message de succès
        } catch (error) {
            // Gérer les erreurs ici
            console.error('Erreur lors de la connexion:', error);
            if (error.response) {
                // La requête a été faite et le serveur a répondu avec un code d'état qui sort de la plage de 2xx
                setMessage(error.response.data.message || "Erreur lors de la connexion.");
            } else if (error.request) {
                // La requête a été faite mais aucune réponse n'a été reçue
                setMessage("Aucune réponse du serveur.");
            } else {
                // Quelque chose s'est produit lors de la configuration de la requête
                setMessage("Erreur: " + error.message);
            }
        }
    };

    return (
        <>
            <div>
                <h2>Se connecter</h2>
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Connexion</button>
                </form>
                {message && <p>{message}</p>} {/* Affiche le message */}
            </div>
        </>
    );
};

export default Login;
