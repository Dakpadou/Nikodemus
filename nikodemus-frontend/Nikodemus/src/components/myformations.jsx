import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

const UserFormations = ({ userId }) => {
  // Récupération du contexte utilisateur via le hook useAuth
  const { user } = useAuth();

 // États pour gérer les données, le chargement et les erreurs
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL de l'API (à adapter selon votre environnement)
  const apiUrl = import.meta.env.VITE_API_URL;

  // Effet pour récupérer les données des formations
  useEffect(() => {
    const fetchFormations = async () => {
      try {
         // Requête pour récupérer les formations
        const response = await axios.get(`${apiUrl}/user/myformation/${user.id}`);
        setFormations(response.data.data); // Assurez-vous que la structure correspond à vos données
      } catch (err) {
        setError('Erreur lors du chargement des formations.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFormations();
    }
  }, [user, apiUrl]); // Ajoutez les dépendances nécessaires

  // Rendu du composant
  return (
    <Container>
      <h1 className="my-4">Mes Formations</h1>
      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Chargement des formations...</p>
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && formations.length === 0 && (
        <Alert variant="info">Aucune formation trouvée.</Alert>
      )}
      {!loading && !error && formations.length > 0 && (
        <Row>
          {formations.map((formation) => (
            <Col key={formation.id} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{formation.title}</Card.Title>
                  <Card.Text>{formation.description}</Card.Text>
                  <Card.Text>
                    <strong>Date :</strong> {formation.date}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default UserFormations;
