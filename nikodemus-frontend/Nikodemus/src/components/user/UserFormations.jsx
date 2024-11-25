import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';

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
                console.log(user.id);
                // Requête pour récupérer les formations
                const response = await axios.get(`${apiUrl}/user/myformation/${user.id}`);
                console.log(response.data);
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
                                {/* Afficher l'image */}
                                {formation.image && (
                                    <Card.Img
                                        variant="top"
                                        src={`http://localhost:3000/uploads/${formation.image}`}
                                        alt={formation.Titre}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <Card.Body>
                                    <Card.Title>{formation.Titre}</Card.Title>
                                    <Card.Text>{formation.presentation}</Card.Text>
                                    <Card.Text>
                                        <strong>Date :</strong> {formation.date}
                                    </Card.Text>
                                    {/* Lien vers la page de détails de la formation */}
                                    <Card.Link href={`/formation/content/${formation.id}`} className="btn btn-primary">
                                        Voir plus
                                    </Card.Link>
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