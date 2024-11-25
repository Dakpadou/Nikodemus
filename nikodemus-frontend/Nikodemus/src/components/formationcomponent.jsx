import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Formation = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [data, setData] = useState([]); // constante data (tableau vide)

    useEffect(() => {
        axios.get(`${apiUrl}/formation`) // récupération des formations depuis l'API
            .then(res => {
                setData(res.data); // mise à jour de data avec les données de l'API
                console.log(res.data , 'all format');
            })
            .catch(err => { // gestion d'erreur
                console.log(err, 'Erreur lors de la récupération des données');
            });
    }, []); // useEffect sans dépendance, donc s'exécute une seule fois

    return (
        <Container className="mt-5">
            <Row>
                {data.map((formationdata) => (
                    <Col key={formationdata.id} md={4} className="mb-4">
                        <Card>
                        <Card.Img variant="top" src={`${apiUrl}/uploads/${formationdata.image}`} alt={formationdata.Titre} />
                            <Card.Body>
                                <Card.Title>{formationdata.Titre}</Card.Title>
                                <Card.Text>
                                    {formationdata.presentation.substring(0, 100)}... {/* Affiche un extrait */}
                                </Card.Text>
                                <Link to={`/formation/${formationdata.id}`}>
                                    <Button variant="primary">Voir la formation</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Formation;
