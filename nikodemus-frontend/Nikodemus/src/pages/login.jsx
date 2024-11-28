import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Form, Button, Container, Alert } from "react-bootstrap";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { setUser } = useAuth(); // Utilisation du contexte pour mettre à jour l'utilisateur

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
                email,
                password,
            }, { withCredentials: true });

            if (response.data && response.data.user) {
                setUser(response.data.user); // Met à jour le contexte utilisateur
                setMessage("Connexion réussie !");
                navigate("/"); // Redirige après connexion
            } else {
                setMessage("Aucune donnée utilisateur reçue.");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            setMessage(
                error.response?.data?.message || "Une erreur est survenue lors de la connexion."
            );
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
            </div>
        </Container>
    );
};

export default Login;
