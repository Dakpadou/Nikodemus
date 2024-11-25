import React from 'react';
import { Carousel, Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/home.css'; // Ajoutez un fichier CSS pour les styles personnalisés

const Home = () => {
  return (
    <div>
      <header className="bg-primary text-white text-center py-5">
        <h1>Bienvenue sur notre plateforme de formation</h1>
        <p>Découvrez des formations adaptées à vos besoins et développez vos compétences dès aujourd'hui !</p>
      </header>

      <Container className="my-5">
        {/* Carrousel */}
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="../src/assets/webdev.webp"
              alt="Formation Développement Web"
            />
            <Carousel.Caption className="custom-caption">
              <h3>Formation Développement Web</h3>
              <p>Maîtrisez les technologies modernes du web.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="../src/assets/data.webp"
              alt="Formation Data Science"
            />
            <Carousel.Caption className="custom-caption">
              <h3>Formation Data Science</h3>
              <p>Analysez et interprétez les données comme un pro.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="../src/assets/marketing.webp"
              alt="Formation Marketing Digital"
            />
            <Carousel.Caption className="custom-caption">
              <h3>Formation Marketing Digital</h3>
              <p>Boostez votre visibilité et vos ventes en ligne.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
<div style={{ textAlign: 'center', marginTop: '20px' }}>
    <a href="/formations-par-categorie" style={{
        display: 'inline-block',
        padding: '10px 20px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '5px',
        textDecoration: 'none',
        cursor: 'pointer'
    }}>
        Découvrir nos formations
    </a>
</div>


        {/* Catégories populaires */}
        <section className="my-5">
          <h2 className="text-center mb-4">Catégories Populaires</h2>
          <Row>
            <Col md={4}>
              <Card>
                <Card.Img variant="top" src="../src/assets/webdev.webp" />
                <Card.Body>
                  <Card.Title>Développement Web</Card.Title>
                  <Card.Text>Explorez nos formations pour devenir un expert du web.</Card.Text>
                  <Button as={Link} to="/formations/developpement-web" variant="primary">Voir les formations</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Img variant="top" src="../src/assets/data.webp" />
                <Card.Body>
                  <Card.Title>Data Science</Card.Title>
                  <Card.Text>Apprenez à maîtriser les outils et techniques de data science.</Card.Text>
                  <Button as={Link} to="/formations/data-science" variant="primary">Voir les formations</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Img variant="top" src="../src/assets/marketing.webp" />
                <Card.Body>
                  <Card.Title>Marketing Digital</Card.Title>
                  <Card.Text>Découvrez les stratégies pour réussir en ligne.</Card.Text>
                  <Button as={Link} to="/formations/marketing-digital" variant="primary">Voir les formations</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
};

export default Home;
