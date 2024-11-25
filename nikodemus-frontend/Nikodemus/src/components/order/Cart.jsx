import React, { useState, useEffect } from 'react';

const Cart = ({ setCartItems, setTotalPrice }) => {
  const [cartData, setCartData] = useState([]);

  // Récupérer les articles du panier depuis localStorage
  const getCartItems = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCartItems = cart.map(item => ({
      formation_id: item.id,  // Remplace 'id' par 'formation_id'
      price: item.price,
      quantity: item.quantity || 1, // Assurer qu'on a la quantité
    }));

    setCartItems(updatedCartItems);

    const total = updatedCartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
    setTotalPrice(total.toFixed(2));
  };

  useEffect(() => {
    getCartItems();
  }, []);

  if (cartData.length === 0) {
    return <p>Votre panier est vide.</p>;
  }

  return (
    <div>
      <h4>Votre panier</h4>
      {cartData.map((item, index) => (
        <div key={index} className="mb-3">
          <p>
            {item.formation_id} - {item.price} € (Quantité: {item.quantity})
          </p>
        </div>
      ))}
      <h4>Total: {totalPrice} €</h4>
    </div>
  );
};

export default Cart;