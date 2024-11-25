import React, { useState } from "react";
import { Modal, Button, Alert, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SubAdminModal = ({ show, handleClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' ou 'danger'
  const apiUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password || !email) {
      setMessage("Tous les champs doivent être remplis");
      setMessageType("danger");
      return;
    }

    const userData = { username, password, email };

    fetch(`${apiUrl}/sub/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Réponse de l'API :", data); // Ajout de logs pour déboguer

        // Vérifiez si l'utilisateur a été créé avec succès
        if (data.user && data.message === "Utilisateur créé avec succès") {
          setMessage("Inscription réussie !");
          setMessageType("success");

          // Nettoyer les champs après une inscription réussie
          setUsername("");
          setPassword("");
          setEmail("");

          // Fermer la modal après un délai
          setTimeout(() => {
            setMessage(""); // Réinitialiser le message
            handleClose();
          }, 2000);
        } else {
          // Échec
          setMessage(data.message || "Erreur lors de l'inscription");
          setMessageType("danger");
        }
      })
      .catch((err) => {
        // Erreur réseau ou autre
        setMessage("Une erreur est survenue");
        setMessageType("danger");
        console.error(err);
      });
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Inscription d'un formateur</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && <Alert variant={messageType}>{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label>Nom d'utilisateur</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez le nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              type="password"
              placeholder="Entrez le mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Entrez l'email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            S'inscrire
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SubAdminModal;
