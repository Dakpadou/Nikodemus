import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Spinner, Alert, Button } from "react-bootstrap";
import axios from "axios";
import { Helmet } from "react-helmet";

const CategoryById = () => {
    const { id } = useParams(); // Récupérer l'ID de la catégorie depuis l'URL
    const apiUrl = import.meta.env.VITE_API_URL;
    const [formations, setFormations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(`${apiUrl}/category/cat/${id}/formations`)
            .then((res) => {
                setFormations(res.data.data);
                setError(null);
            })
            .catch((err) => {
                console.error("Erreur lors du chargement des formations :", err);
                setError("Erreur lors du chargement des formations.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="text-center my-4">
                <Spinner animation="border" variant="primary" />
                <p>Chargement des formations...</p>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (formations.length === 0) {
        return <Alert variant="info">Aucune formation trouvée pour cette catégorie.</Alert>;
    }

    return (
        <Container className="mt-4">
            <Helmet>
        <meta charSet="utf-8" />
        <title>NikoDemus</title>
        <meta
          name="description"
          content="Catégorie"
        />
        <link rel="canonical" href={`http://localhost:5173/category/${id}`} />
      </Helmet>
            <h1 className="text-center mb-4">Nos Formations</h1>
            <Row>
                {formations.map((formation) => (
                    <Col key={formation.id} md={4} className="mb-4">
                        <Card>
                            <Card.Img
                                variant="top"
                                src={`${apiUrl}/uploads/${formation.image}`}
                                alt={formation.Titre}
                                style={{ height: "200px", objectFit: "cover" }}
                            />
                            <Card.Body>
                                <Card.Title>{formation.Titre}</Card.Title>
                                <Card.Text>{formation.presentation}</Card.Text>
                                <Card.Text>
                                    <strong>Prix :</strong> {formation.prix} €
                                </Card.Text>
                                <Button href={`/formation/${formation.id}`} variant="primary">
                                    Voir les détails
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default CategoryById;