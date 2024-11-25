import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // Hook pour naviguer entre les pages
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            email,
            password,
        };

        try {
            const response = await axios.post(`${apiUrl}/login`, data, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true, // envoi du cookie de session
            });
            console.log(response.data);
            setMessage("Connexion réussie !");
            
            // Redirige vers la page d'accueil après 2 secondes
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
            if (error.response) {
                setMessage(error.response.data.message || "Erreur lors de la connexion.");
            } else if (error.request) {
                setMessage("Aucune réponse du serveur.");
            } else {
                setMessage("Erreur: " + error.message);
            }
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            <div style={{ width: "100%", maxWidth: "400px" }}>
                <h2 className="text-center mb-4">Se connecter</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Entrez votre email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Mot de passe</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Entrez votre mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">
                        Connexion
                    </Button>
                </Form>
                {message && <Alert className="mt-3" variant="info">{message}</Alert>}

                <Link to='/register-user'>Créer un compte</Link>
            </div>
        </Container>
    );
};

export default Login;
