import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const UserFormations = ({ userId }) => {
  const { user } = useAuth();

  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await axios.get(`${apiUrl}/user/myformation/${user.id}`);
        setFormations(response.data.data); 
      } catch (err) {
        // Si une erreur HTTP est 404 et concerne les formations non trouvées
        if (err.response && err.response.status === 404) {
          setFormations([]); // Aucun résultat, mais pas une erreur critique
        } else {
          setError('Erreur lors du chargement des formations.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFormations();
    }
  }, [user, apiUrl]);

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
        <Alert variant="info">
          Aucune formation trouvée. <Link to="/">Revenir à l'accueil</Link>
        </Alert>
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
