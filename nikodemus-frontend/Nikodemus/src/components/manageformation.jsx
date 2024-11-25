import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Table, Button, Container, Row, Col, Alert } from "react-bootstrap";

const ManageFormation = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [data, setData] = useState([]); // constante data (tableau vide)
    const [error, setError] = useState(""); // Gestion des erreurs
    const [success, setSuccess] = useState(""); // Gestion des succès
    const navigate = useNavigate(); // Hook pour naviguer entre les pages

    useEffect(() => {
        axios.get(`${apiUrl}/formation`) // Récupération depuis la BDD
            .then(res => {
                setData(res.data); // Mise à jour de data avec les données de l'API
            })
            .catch(err => { // Gestion des erreurs
                console.error("Erreur lors de la récupération des données :", err);
                setError("Erreur lors de la récupération des données.");
            });
    }, []); // Le tableau vide indique que le hook s'exécute au montage

    // Fonction pour supprimer une formation
    const handleDelete = (id) => {
        axios.delete(`${apiUrl}/formation/delete/${id}`)
            .then(res => {
                setSuccess("Formation supprimée avec succès.");
                setData(data.filter(formation => formation.id !== id)); // Mise à jour des données localement
            })
            .catch(err => {
                console.error("Erreur lors de la suppression :", err);
                setError("Erreur lors de la suppression de la formation.");
            });
    };

    // Fonction pour rediriger vers le formulaire d'édition
    const handleEdit = (id) => {
        navigate(`/update/${id}`); // Redirection vers la page d'édition avec l'ID
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <h2 className="text-center">Liste des Formations</h2>

                    {/* Messages de succès ou d'erreur */}
                    {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}
                    {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}

                    <Table striped bordered hover className="mt-3">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Titre</th>
                                <th>Prix</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((formationdata) => (
                                <tr key={formationdata.id}>
                                    <td>{formationdata.id}</td>
                                    <td>{formationdata.Titre}</td>
                                    <td>{formationdata.prix} €</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(formationdata.id)}
                                            className="me-2"
                                        >
                                            Supprimer
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleEdit(formationdata.id)}
                                        >
                                            Éditer
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default ManageFormation;
