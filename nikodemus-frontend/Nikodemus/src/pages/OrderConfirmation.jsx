import React, { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Pour la navigation

const OrderConfirmation = () => {
  const [orderId, setOrderId] = useState(null);
  const navigate = useNavigate();

  // Récupérer l'ID de la commande après redirection depuis PayPal
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdFromUrl = urlParams.get("orderId");
    setOrderId(orderIdFromUrl);

    if (!orderIdFromUrl) {
      // Si aucune commande n'est trouvée, rediriger vers l'accueil ou le panier
      navigate("/panier");
    }
  }, [navigate]);

  return (
    <Container className="text-center">
      <h2>Merci pour votre commande !</h2>
      <p>Votre commande a bien été passée.</p>
      {orderId && <p>Votre numéro de commande est : <strong>{orderId}</strong></p>}
      <Button onClick={() => navigate("/")} variant="success">Retour à l'accueil</Button>
    </Container>
  );
};

export default OrderConfirmation;
