import React, { useState } from "react";
import { Button, Form, Container , Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Remplacer useHistory par useNavigate

const InscriptionUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate(); // Utilisé pour la redirection après inscription réussie

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation simple
    if (!username || !password || !email) {
      setError("Tous les champs doivent être remplis");
      return;
    }

    const userData = {
      username,
      password,
      email
    };

    // Appel API pour envoyer les données d'inscription au backend
    fetch(`${apiUrl}/sub/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Redirige vers la page de connexion après une inscription réussie
          navigate("/login"); // Remplace history.push par navigate
        } else {
          setError(data.message || "Erreur lors de l'inscription");
        }
      })
      .catch((err) => {
        setError("Une erreur est survenue");
        console.log(err);
      });
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="form-container p-4 rounded shadow-sm bg-light w-100" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4">Inscription</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label>Nom d'utilisateur</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez votre nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            S'inscrire
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default InscriptionUser;