import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { Editor } from "@tinymce/tinymce-react";
import { useAuth } from "../hooks/useAuth";

const AddFormationModal = ({ show, handleClose }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { user, loading } = useAuth(); // Inclut l'état `loading`
    const [data, setData] = useState({
        titre: "",
        presentation: "",
        content: "",
        prix: "",
        image: null,
        author: "" // Initialiser avec une chaîne vide
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!loading && user?.id) {
            setData((prevData) => ({
                ...prevData,
                author: user.id
            }));
        }
    }, [loading, user]);

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
        setData({
            ...data,
            image: e.target.files[0]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!data.author) {
            setError("Erreur : Impossible d'ajouter une formation sans utilisateur.");
            return;
        }

        const formData = new FormData();
        formData.append("titre", data.titre);
        formData.append("presentation", data.presentation);
        formData.append("content", data.content);
        formData.append("prix", data.prix);
        formData.append("image", data.image);
        formData.append("author", data.author);

        axios.post(`${apiUrl}/formation/add`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        .then(() => {
            setSuccess(true);
            setError("");
            setData({
                titre: "",
                presentation: "",
                content: "",
                prix: "",
                image: null,
                author: user?.id || ""
            });
        })
        .catch((err) => {
            setError("Une erreur est survenue lors de l'ajout de la formation.");
            console.error(err);
        });
    };

    return (
        <Modal size="xl" show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Ajouter une Formation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {success && (
                    <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
                        Formation ajoutée avec succès !
                    </Alert>
                )}
                {error && (
                    <Alert variant="danger" onClose={() => setError("")} dismissible>
                        {error}
                    </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="titre" className="mb-3">
                        <Form.Label>Titre</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez le titre"
                            name="titre"
                            value={data.titre}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="presentation" className="mb-3">
                        <Form.Label>Présentation</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Entrez une présentation"
                            name="presentation"
                            value={data.presentation}
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

                    <Form.Group controlId="prix" className="mb-3">
                        <Form.Label>Prix</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Entrez le prix"
                            name="prix"
                            value={data.prix}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="image" className="mb-3">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        Ajouter la Formation
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddFormationModal;
