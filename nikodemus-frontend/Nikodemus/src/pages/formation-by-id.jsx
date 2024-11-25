import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useAuth } from "../hooks/useAuth";

const FormationById = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { user, loading } = useAuth(); // Vérifie l'utilisateur connecté
  const [formation, setFormation] = useState(null);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [alreadyPurchased, setAlreadyPurchased] = useState(false); // État pour savoir si la formation est achetée
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${apiUrl}/formation/${id}`)
      .then((res) => {
        setFormation(res.data);
      })
      .catch((err) => {
        setError("Une erreur s'est produite lors du chargement des données.");
        console.error(err);
      });
  }, [id]);

  useEffect(() => {
    if (!loading && user) {
      axios
        .get(`${apiUrl}/user/ordersbyuser/${user.id}`) // Route pour vérifier les commandes
        .then((res) => {
          console.log(res.data.data);
          if (res.data.data.includes(parseInt(id))) {
            setAlreadyPurchased(true); // Si l'ID de la formation est dans les commandes, elle est déjà achetée
          }
        })
        .catch((err) => {
          console.error("Erreur lors de la vérification des commandes :", err);
        });
    }
  }, [loading, user, id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemIndex = cart.findIndex((item) => item.id === formation.data.id);

    if (itemIndex === -1) {
      cart.push({
        id: formation.data.id,
        title: formation.data.Titre,
        price: formation.data.prix,
        image: formation.data.image,
      });
      setCartMessage("Formation ajoutée au panier !");
    } else {
      setCartMessage("Cette formation est déjà dans le panier.");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!formation) {
    return <p>Chargement des données...</p>;
  }

  return (
    <Container fluid className="mt-5">
      <Helmet>
        <meta charSet="utf-8" />
        <title>{formation.data?.Titre || "Titre par défaut"}</title>
        <meta
          name="description"
          content={formation.data?.presentation || "Description par défaut"}
        />
        <link rel="canonical" href={`http://mysite.com/formation/${id}`} />
      </Helmet>
      <Row className="justify-content-center">
        <Col lg={10} md={12}>
          <Card>
            <Card.Img
              variant="top"
              src={`${apiUrl}/uploads/${formation.data.image}`}
              alt={formation.data.Titre}
            />
            <Card.Body>
              <Card.Title>{formation.data.Titre}</Card.Title>
              <div className="content" style={{ marginBottom: "20px" }}>
                <div
                  dangerouslySetInnerHTML={{ __html: formation.data.presentation }}
                />
              </div>
              <p>
                <strong>Prix :</strong> {formation.data.prix} €
              </p>
              {!alreadyPurchased ? ( // Cache le bouton si la formation est déjà achetée
                <Button variant="success" onClick={addToCart} className="mr-2">
                  <i className="fas fa-shopping-cart" style={{ marginRight: "8px" }}></i>
                  Ajouter au Panier
                </Button>
              ) : (
                <p className="text-success">Vous avez déjà acheté cette formation.</p>
              )}
              {cartMessage && <p>{cartMessage}</p>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FormationById;
