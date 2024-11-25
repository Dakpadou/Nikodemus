import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

const Category = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [categories, setCategories] = useState([]); // Constante pour stocker les données
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [error, setError] = useState(null); // Stocker les erreurs

  useEffect(() => {
    axios
      .get(`${apiUrl}/category`) // Récupération des données depuis l'API
      .then((res) => {
        setCategories(res.data); // Mise à jour des catégories
        setError(null);
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des données :", err);
        setError("Erreur lors du chargement des catégories.");
      })
      .finally(() => setLoading(false)); // Fin du chargement
  }, []);

  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" variant="primary" />
        <p>Chargement des catégories...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Container className="mt-4">
      <Row>
        {categories.map((category) => (
          <Col key={category.id} md={4} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={`${apiUrl}/uploads/${category.image}`}
                alt={category.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{category.name}</Card.Title>
                <Card.Text>{category.presentation}</Card.Text>
                <Button as={Link} to={`/category/${category.id}`} variant="primary">
                  Voir la catégorie
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Category;
