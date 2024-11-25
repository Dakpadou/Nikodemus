import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap"; // Import de React Bootstrap

const Basket = () => {
  const [cartItems, setCartItems] = useState([]);

  // Fonction pour récupérer les articles du panier depuis localStorage
  const getCartItems = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  };

  // Fonction pour supprimer un article du panier
  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    getCartItems(); // Rechargement des articles après suppression
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Fonction pour vider le panier
  const clearCart = () => {
    localStorage.removeItem("cart");
    getCartItems(); // Rechargement des articles après vidage
    window.dispatchEvent(new Event("cartUpdated"));

  };

  // Calcul du total du panier
  const calculateTotal = () => {
    // On additionne uniquement le prix de chaque formation
    const total = cartItems.reduce((acc, item) => {
      // Si le prix est valide, on l'ajoute au total
      if (item.price) {
        return acc + item.price;
      }
      return acc; // Si prix invalide, on l'ignore
    }, 0);
    return total.toFixed(2); // On retourne le total formaté
  };

  // Récupérer les articles du panier à chaque montage du composant
  useEffect(() => {
    getCartItems();
  }, []); // Ce useEffect se déclenche une seule fois au montage

  return (
    <Container>
      <h2 className="my-4">Votre Panier</h2>

      {cartItems.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <Row>
          {/* Liste des produits */}
          <Col md={8}>
            <Row>
              {cartItems.map((item) => (
                <Col key={item.id} sm={12} md={6} lg={4}>
                  <Card className="mb-4">
                    {/* Utilisation de l'URL locale pour l'image */}
                    <Card.Img variant="top" src={`http://localhost:3000/uploads/${item.image}`} alt={item.name} />
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>
                        Prix: {item.price} € <br />
                      </Card.Text>
                      <Button 
                        variant="danger" 
                        onClick={() => removeItem(item.id)} 
                        className="mr-2"
                      >
                        <i className="fa fa-trash-alt"></i> Supprimer
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>

          {/* Commande et Panier */}
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <h4>Total: {calculateTotal()} €</h4>
                <div className="d-flex justify-content-between mt-4">
                  <Button variant="outline-danger" onClick={clearCart}>
                    Vider le panier
                  </Button>
                  <Link to="/checkout">
                    <Button variant="success">Passer à la commande</Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Basket;
