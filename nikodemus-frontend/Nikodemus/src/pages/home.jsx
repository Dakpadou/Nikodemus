import React from "react";
import { Carousel, Container, Row, Col, Card, Button } from "react-bootstrap"; // Import de Bootstrap
import { Link } from "react-router-dom"; // Import de Link pour la navigation
import {Helmet} from "react-helmet";


const Home = () => {
    return (
        <div>
         <Helmet>
                <meta charSet="utf-8" />
                <title>Accueil</title>
                <meta name="description" content="page Home de nikodemus" />
                <link rel="canonical" href="http://mysite.com/example" />
            </Helmet>
            {/* Slider */}
            <Carousel>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://via.placeholder.com/1200x400?text=Slide+1"
                        alt="First slide"
                    />
                    <Carousel.Caption>
                        <h3>Formation 1</h3>
                        <p>Explorez notre formation en développement web.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://via.placeholder.com/1200x400?text=Slide+2"
                        alt="Second slide"
                    />
                    <Carousel.Caption>
                        <h3>Formation 2</h3>
                        <p>Apprenez à gérer des projets avec React et Node.js.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://via.placeholder.com/1200x400?text=Slide+3"
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                        <h3>Formation 3</h3>
                        <p>Devenez expert en développement mobile avec Flutter.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>

            {/* Blocs rapides avec des liens vers des formations */}
            <Container className="mt-5">
                <Row>
                    {/* Bloc 1 */}
                    <Col md={4}>
                        <Card>
                            <Card.Img variant="top" src="https://via.placeholder.com/300x200?text=Bloc+1" />
                            <Card.Body>
                                <Card.Title>Développement Web</Card.Title>
                                <Card.Text>
                                    Apprenez à créer des sites web avec HTML, CSS, et JavaScript.
                                </Card.Text>
                                <Link to="/formation/1"> {/* Lien vers la page de formation 1 */}
                                    <Button variant="primary">Voir la formation</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Bloc 2 */}
                    <Col md={4}>
                        <Card>
                            <Card.Img variant="top" src="https://via.placeholder.com/300x200?text=Bloc+2" />
                            <Card.Body>
                                <Card.Title>React et Node.js</Card.Title>
                                <Card.Text>
                                    Formation complète sur React.js pour le front-end et Node.js pour le back-end.
                                </Card.Text>
                                <Link to="/formation/2"> {/* Lien vers la page de formation 2 */}
                                    <Button variant="primary">Voir la formation</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Bloc 3 */}
                    <Col md={4}>
                        <Card>
                            <Card.Img variant="top" src="https://via.placeholder.com/300x200?text=Bloc+3" />
                            <Card.Body>
                                <Card.Title>Développement Mobile</Card.Title>
                                <Card.Text>
                                    Devenez un expert en développement d'applications mobiles avec Flutter.
                                </Card.Text>
                                <Link to="/formation/3"> {/* Lien vers la page de formation 3 */}
                                    <Button variant="primary">Voir la formation</Button>
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Home;
