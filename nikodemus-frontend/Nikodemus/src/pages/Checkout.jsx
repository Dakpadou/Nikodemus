import React, { useState, useEffect } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

const Checkout = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCartItems = cart.map(item => ({
      formation_id: item.id,
      price: item.price,
      quantity: item.quantity || 1,
    }));
    setCartItems(updatedCartItems);
    const total = updatedCartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
    setTotalPrice(total.toFixed(2));
  }, []);

  const createOrder = async (data, actions) => {
    try {
      console.log('Utilisateur connecté :', user);

      const response = await fetch('http://localhost:3000/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          cartItems: cartItems,
          totalPrice: parseFloat(totalPrice),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur reçue du backend :', errorData);
        throw new Error('Erreur lors de la création de la commande sur le backend.');
      }

      const data = await response.json();
      console.log('Commande créée dans le backend avec succès, ID :', data.orderId);

      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: totalPrice,
            },
          },
        ],
      });
    } catch (error) {
      console.error('Erreur lors de la création de la commande :', error);
      setErrorMessage('Il y a eu un problème avec la création de votre commande.');
      throw error;
    }
  };

  const onApprove = async (data, actions) => {
    try {
      const details = await actions.order.capture();
      console.log('Détails du paiement capturé :', details);

      const response = await fetch('http://localhost:3000/checkout/confirm-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: data.orderID,
          paymentDetails: details,
          userId: user?.id,
        }),
      });

      if (response.ok) {
        console.log('Paiement confirmé par le backend.');
        localStorage.removeItem('cart');
        alert('Commande réussie !');
        window.location.href = '/order-confirmation';
      } else {
        console.error('Erreur lors de la confirmation du paiement sur le backend.');
        alert('Problème lors de la confirmation du paiement.');
      }
    } catch (error) {
      console.error('Erreur lors du paiement :', error);
      alert('Erreur avec le paiement.');
    }
  };

  return (
    <PayPalScriptProvider options={{ 'client-id': 'AZKEjApjFNaXcJcky27oFxUCocSWyqidmMP5Vo35pUidV4DenNDi_Kic6K-yRPKvzIj_kHzbf13FGc7L' }}> {/*client ID a passer en .env*/}
      <Container>
        <h2>Finaliser votre commande</h2>
        {cartItems.length === 0 ? (
          <p>Votre panier est vide.</p>
        ) : (
          <Row>
            <Col md={8}>
              <h4>Votre panier</h4>
              {cartItems.map((item, index) => (
                <p key={index}>{item.formation_id} - {item.price} € (Quantité: {item.quantity})</p>
              ))}
              <h4>Total: {totalPrice} €</h4>
            </Col>
            <Col md={4}>
              <Form>
                <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
              </Form>
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            </Col>
          </Row>
        )}
      </Container>
    </PayPalScriptProvider>
  );
};

export default Checkout;