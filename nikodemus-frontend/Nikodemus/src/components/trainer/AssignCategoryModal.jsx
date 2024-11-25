import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

const AssignCategoryModal = ({ show, handleClose, formationId }) => {
    const [categories, setCategories] = useState([]); // Liste des catégories
    const [assignedCategories, setAssignedCategories] = useState([]); // Catégories assignées
    const [error, setError] = useState(""); // Message d'erreur
    const [success, setSuccess] = useState(""); // Message de succès

    const apiUrl = import.meta.env.VITE_API_URL; // URL de l'API

    // Charge les catégories et les catégories assignées
    useEffect(() => {
        if (formationId) {
            // Charge toutes les catégories
            axios.get(`${apiUrl}/category`)
                .then((res) => {
                    console.log("Catégories disponibles :", res.data);
                    setCategories(res.data); // Définit les catégories
                })
                .catch(() => setError("Erreur lors du chargement des catégories."));

            // Charge les catégories déjà assignées à la formation
            axios.get(`${apiUrl}/category/formation/categories/${formationId}`)
                .then((res) => {
                    console.log("Catégories assignées :", res.data.data);
                    setAssignedCategories(res.data.data.map((cat) => cat.category_id)); // Définit les ID des catégories assignées
                })
                .catch(() => setError("Erreur lors du chargement des catégories assignées."));
        }
    }, [formationId]);

    // Soumission du formulaire pour assigner les catégories
    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${apiUrl}/category/formation/assign-categories/${formationId}`, { categories: assignedCategories })
            .then(() => {
                setSuccess("Catégories assignées avec succès.");
                setError("");
                handleClose(); // Ferme la modale
            })
            .catch(() => setError("Erreur lors de l'assignation des catégories."));
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Assigner des Catégories</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Messages de succès ou d'erreur */}
                {success && <Alert variant="success" dismissible onClose={() => setSuccess("")}>{success}</Alert>}
                {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}

                {/* Formulaire pour assigner les catégories */}
                <Form onSubmit={handleSubmit}>
                    {categories.map((category) => (
                        <Form.Check
                            key={category.id}
                            type="checkbox"
                            label={category.name}
                            checked={assignedCategories.includes(category.id)}
                            onChange={(e) =>
                                setAssignedCategories(
                                    e.target.checked
                                        ? [...assignedCategories, category.id]
                                        : assignedCategories.filter((id) => id !== category.id)
                                )
                            }
                        />
                    ))}
                    <Button variant="primary" type="submit" className="mt-3 w-100">
                        Assigner
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AssignCategoryModal;