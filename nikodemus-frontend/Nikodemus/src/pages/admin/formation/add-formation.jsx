import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import { Editor } from "@tinymce/tinymce-react";

const AddFormation = () => {
    const [data, setData] = useState({
        titre: "",
        presentation: "",
        content: "", // pour TinyMCE
        prix: "",
        image: null
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Fonction pour gérer les changements dans l'éditeur TinyMCE (contenu)
    const handleEditorChange = (content, editor) => {
        setData({
            ...data,
            content: content // Mettre à jour "content" pour TinyMCE
        });
    };

    // Fonction pour gérer les changements dans les autres champs (présentation, prix, etc.)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value // Mettre à jour le champ texte classique
        });
    };

    // Fonction pour gérer le changement de l'image
    const handleImageChange = (e) => {
        setData({
            ...data,
            image: e.target.files[0] // Mettre à jour l'image
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("titre", data.titre);
        formData.append("presentation", data.presentation);  // Champ texte classique
        formData.append("content", data.content); // Contenu de TinyMCE
        formData.append("prix", data.prix);
        formData.append("image", data.image); // Ajout de l'image

        // Envoi de la requête POST avec les données du formulaire
        axios.post("http://localhost:3000/formation/add", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        .then((res) => {
            setSuccess(true);
            setError("");
            setData({
                titre: "",
                presentation: "",
                content: "", // Réinitialisation du contenu TinyMCE
                prix: "",
                image: null
            });
        })
        .catch((err) => {
            setError("Une erreur est survenue lors de l'ajout de la formation.");
        });
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Header as="h3" className="text-center">Ajout de Formation</Card.Header>
                        <Card.Body>
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
                                        apiKey="6wyjw88f7551uupx6wqkslqmss5ll5qvudm9ue1acl21w4qw"
                                        value={data.content} // Utilisation de "content" pour TinyMCE
                                        onEditorChange={handleEditorChange}
                                        init={{
                                            height: 500,
                                            menubar: false,
                                            plugins: [
                                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                                            ],
                                            toolbar: 'undo redo | blocks | ' +
                                                'bold italic forecolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help',
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
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AddFormation;
