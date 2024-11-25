// src/components/Footer.jsx
import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-dark text-white py-4 w-100">
            <Container fluid>
                <Row>
                    <Col md={4} className="text-center text-md-left">
                        <h5>Formation</h5>
                        <Nav className="flex-column">
                            <Nav.Item>
                                <Link to="/formation" className="nav-link text-white">
                                    Voir les formations
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link to="/category" className="nav-link text-white">
                                    Catégories
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Link to="/formations-par-categorie" className="nav-link text-white">
                                    Formation par catégorie
                                </Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col md={4} className="text-center">
                        <h5>Contact</h5>
                        <Nav className="flex-column">
                            <Nav.Item>
                                <Link to="/contact" className="nav-link text-white">
                                    Nous contacter
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <a href="mailto:support@formation.com" className="nav-link text-white">
                                    support@formation.com
                                </a>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col md={4} className="text-center text-md-right">
                        <h5>Suivez-nous</h5>
                        <Nav>
                            <Nav.Item>
                                <a href="https://www.facebook.com" className="nav-link text-white" target="_blank" rel="noopener noreferrer">
                                    Facebook
                                </a>
                            </Nav.Item>
                            <Nav.Item>
                                <a href="https://www.twitter.com" className="nav-link text-white" target="_blank" rel="noopener noreferrer">
                                    Twitter
                                </a>
                            </Nav.Item>
                            <Nav.Item>
                                <a href="https://www.instagram.com" className="nav-link text-white" target="_blank" rel="noopener noreferrer">
                                    Instagram
                                </a>
                            </Nav.Item>
                        </Nav>
                    </Col>
                </Row>
                <Row>
                    <Col className="text-center mt-4">
                        <p>&copy; {new Date().getFullYear()} Formation Inc. Tous droits réservés.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
