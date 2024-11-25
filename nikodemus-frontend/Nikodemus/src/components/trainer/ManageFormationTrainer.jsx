import React, { useState, useEffect } from "react";
import { Table, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import EditFormationModal from "./EditFormationModal";
import AssignCategoryModal from "./AssignCategoryModal";

const ManageFormation = () => {
    const { user, loading } = useAuth(); // Récupère les données utilisateur et l'état de chargement
    const [formations, setFormations] = useState([]); // Liste des formations
    const [selectedFormationId, setSelectedFormationId] = useState(null); // ID de la formation sélectionnée
    const [showEditModal, setShowEditModal] = useState(false); // État pour afficher/masquer le modal d'édition
    const [showCategoryModal, setShowCategoryModal] = useState(false); // État pour afficher/masquer le modal de catégories
    const [success, setSuccess] = useState(""); // Message de succès
    const [error, setError] = useState(""); // Message d'erreur

    const apiUrl = import.meta.env.VITE_API_URL;

    // Récupère les formations de l'utilisateur connecté
    useEffect(() => {
        if (loading || !user) return;

        fetchFormations();
    }, [loading, user]);

    const fetchFormations = () => {
        axios.get(`${apiUrl}/formation/trainer/${user.id}`)
            .then((res) => {
                setFormations(res.data.data);
                setError("");
            })
            .catch((err) => {
                console.error("Erreur lors de la récupération des formations :", err);
                setError("Erreur lors de la récupération des formations.");
            });
    };

    // Supprime une formation
    const handleDelete = (id) => {
        axios.delete(`${apiUrl}/formation/delete/${id}`)
            .then(() => {
                setSuccess("Formation supprimée avec succès.");
                setFormations(formations.filter((formation) => formation.id !== id)); // Mise à jour des données localement
                setError("");
            })
            .catch((err) => {
                console.error("Erreur lors de la suppression :", err);
                setError("Erreur lors de la suppression de la formation.");
            });
    };

    // Ouvre le modal d'édition pour une formation spécifique
    const handleEdit = (id) => {
        setSelectedFormationId(id);
        setShowEditModal(true);
    };

    // Ouvre le modal d'assignation des catégories
    const handleAssignCategories = (id) => {
        setSelectedFormationId(id);
        setShowCategoryModal(true);
    };

    if (loading) {
        return <p>Chargement des données utilisateur...</p>;
    }

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <h2 className="text-center">Gestion des Formations</h2>

                    {/* Messages de succès ou d'erreur */}
                    {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}
                    {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}

                    {/* Tableau des formations */}
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Image</th>
                                <th>Titre</th>
                                <th>Prix</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formations.map((formation) => (
                                <tr key={formation.id}>
                                    <td>{formation.id}</td>
                                    <td>
                                        <img
                                            src={`${apiUrl}/uploads/${formation.image}`}
                                            alt={formation.Titre}
                                            style={{ width: "100px", height: "auto" }}
                                        />
                                    </td>
                                    <td>{formation.Titre}</td>
                                    <td>{formation.prix} €</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(formation.id)}
                                            className="me-2"
                                        >
                                            Supprimer
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleEdit(formation.id)}
                                            className="me-2"
                                        >
                                            Modifier
                                        </Button>
                                        <Button
                                            variant="info"
                                            size="sm"
                                            onClick={() => handleAssignCategories(formation.id)}
                                        >
                                            Catégories
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>

            {/* Modal d'édition */}
            <EditFormationModal
                show={showEditModal}
                handleClose={() => setShowEditModal(false)}
                formationId={selectedFormationId}
                refreshData={fetchFormations}
            />

            {/* Modal d'assignation des catégories */}
            <AssignCategoryModal
                show={showCategoryModal}
                handleClose={() => setShowCategoryModal(false)}
                formationId={selectedFormationId}
                refreshData={fetchFormations}
            />
        </Container>
    );
};

export default ManageFormation;