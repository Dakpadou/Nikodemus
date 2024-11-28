import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";

const EditFormationModal = ({ show, handleClose, formationId, refreshData }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [data, setData] = useState({
        Titre: "",
        presentation: "",
        prix: "",
        content: "",
        image: null,
        imagePreview: "" // Chemin de l'image actuelle
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        
        if (formationId) {
            axios.get(`${apiUrl}/formation/getfull/${formationId}`)
                .then((res) => {
                    const formation = res.data.data || {};
                    setData({
                        Titre: formation.Titre || "",
                        presentation: formation.presentation || "",
                        prix: formation.prix || "",
                        content: formation.content || "",
                        image: null,
                        imagePreview: `${apiUrl}/uploads/${formation.image}` // URL de l'image actuelle
                    });
                })
                .catch((err) => {
                    console.error("Erreur lors du chargement de la formation :", err);
                    setError("Erreur lors du chargement de la formation.");
                });
        }
    }, [formationId, apiUrl]);

    const handleEditorChange = (content) => {
        setData({
            ...data,
            content
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData({
            ...data,
            image: file
        });

        // Mise à jour de l'aperçu de l'image
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setData((prevData) => ({
                    ...prevData,
                    imagePreview: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const payload = {
            titre: data.Titre || "",
            presentation: data.presentation || "",
            prix: data.prix || "",
            content: data.content || "",
            currentImage: data.imagePreview ? data.imagePreview.split('/uploads/')[1] : null
        };
    
        // Si une nouvelle image est sélectionnée, utilisez FormData
        if (data.image) {
            const formData = new FormData();
            formData.append("titre", payload.titre);
            formData.append("presentation", payload.presentation);
            formData.append("prix", payload.prix);
            formData.append("content", payload.content);
            formData.append("image", data.image);
    
            axios.put(`${apiUrl}/formation/update/${formationId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
                .then((res) => {
                    console.log("Réponse du serveur :", res.data);
                    setSuccess("Formation mise à jour avec succès.");
                    setError("");
                    refreshData();
                    handleClose();
                })
                .catch((err) => {
                    console.error("Erreur lors de la mise à jour de la formation :", err);
                    setError("Erreur lors de la mise à jour.");
                });
        } else {
            // Si aucune nouvelle image, envoyez un JSON classique
            axios.put(`${apiUrl}/formation/update/${formationId}`, payload, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((res) => {
                    console.log("Réponse du serveur :", res.data);
                    setSuccess("Formation mise à jour avec succès.");
                    setError("");
                    refreshData();
                    handleClose();
                })
                .catch((err) => {
                    console.error("Erreur lors de la mise à jour de la formation :", err);
                    setError("Erreur lors de la mise à jour.");
                });
        }
    };
    
    

    return (
        <Modal size="xl"show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Modifier une Formation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {success && <Alert variant="success">{success}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="Titre" className="mb-3">
                        <Form.Label>Titre</Form.Label>
                        <Form.Control
                            type="text"
                            name="Titre"
                            value={data.Titre}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="presentation" className="mb-3">
                        <Form.Label>Présentation</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="presentation"
                            value={data.presentation}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="prix" className="mb-3">
                        <Form.Label>Prix</Form.Label>
                        <Form.Control
                            type="number"
                            name="prix"
                            value={data.prix}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="content" className="mb-3">
                        <Form.Label>Contenu</Form.Label>
                        <Editor
                            apiKey={import.meta.env.VITE_TINY_API_KEY}
                            value={data.content}
                            onEditorChange={handleEditorChange}
                            init={{
                                height: 300,
                                menubar: false,
                                plugins: [
                                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                    'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                                ],
                                toolbar: 'undo redo | blocks | bold italic forecolor | ' +
                                    'alignleft aligncenter alignright alignjustify | link image media table mergetags | ' +
                                    'bullist numlist outdent indent | removeformat | help',
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="image" className="mb-3">
                        <Form.Label>Image</Form.Label>
                        <div className="mb-3">
                            {data.imagePreview && (
                                <img src={data.imagePreview} alt="Aperçu" style={{ width: "100%", maxHeight: "200px" }} />
                            )}
                        </div>
                        <Form.Control
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        Mettre à jour
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditFormationModal;
