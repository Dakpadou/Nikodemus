const express = require('express');
const app = express();
const mysql = require('mysql2');
const router = express.Router();
const config = require('../config'); // Connexion à la BDD
const bodyParser = require('body-parser');
app.use(express.json());
require('dotenv').config();

const paypal = require('@paypal/checkout-server-sdk');

// Configurer PayPal
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

async function createPaypalOrder(totalPrice) {
  const request = new paypal.orders.OrdersCreateRequest();
  request.preferredPaymentSource("paypal");
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'EUR',
          value: totalPrice
        }
      }
    ]
  });

  const order = await client().execute(request);
  return order.result;
}

router.post('/', async (req, res) => {
  
  const { userId, cartItems, totalPrice } = req.body;
  console.log('Requête reçue pour /checkout :', req.body);

  const formationIds = cartItems.map(item => item.formation_id);
  const queryFormationCheck = 'SELECT id FROM formation WHERE id IN (?)';

  try {
    const [formations] = await config.query(queryFormationCheck, [formationIds]);

    if (formations.length !== formationIds.length) {
      return res.status(400).json({ message: 'Certaines formations n\'existent pas' });
    }

    const queryOrder = 'INSERT INTO orders (order_user, total_price, order_date) VALUES (?, ?, NOW())';
    const [result] = await config.query(queryOrder, [userId, totalPrice]);

    if (!result || !result.insertId) {
      return res.status(500).json({ message: 'Échec de la création de la commande.' });
    }

    const orderId = result.insertId;

    const orderDetails = cartItems.map(item => [userId, orderId, item.formation_id]);
    const queryOrderDetails = 'INSERT INTO user_order (user_id, order_id, formation_id) VALUES ?';
    await config.query(queryOrderDetails, [orderDetails]);
    console.log(orderId, "reussi" ,)
    return res.status(200).json({ message: 'Commande créée avec succès.', orderId });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

async function verifyPaypalPayment(orderId) {
  const request = new paypal.orders.OrdersGetRequest(orderId);

  try {
    const order = await client().execute(request);
    return order.result;
  } catch (error) {
    throw error;
  }
}

// Route pour confirmer le paiement de la commande
router.post('/confirm-order', async (req, res) => {
  const { orderId, paymentDetails, userId } = req.body;

  if (!orderId || !paymentDetails || !paymentDetails.id) {
    return res.status(400).json({ message: "Informations manquantes" });
  }

  try {
    // Vérifier le paiement via PayPal
    const paymentVerification = await verifyPaypalPayment(paymentDetails.id);

    if (paymentVerification.status === 'COMPLETED') {
      // Mise à jour de la commande en utilisant paypal_order_id
      const updateOrderQuery = 'UPDATE orders SET status = ? WHERE paypal_order_id = ?';
      await config.query(updateOrderQuery, ['paid', orderId]);

      // Insérer un enregistrement dans la table payments
      const insertPaymentQuery = `
        INSERT INTO payments (pay_date, order_id, user_id, total_price, pay_type)
        VALUES (NOW(), (SELECT id FROM orders WHERE paypal_order_id = ?), ?, ?, ?)
      `;
      await config.query(insertPaymentQuery, [
        orderId, // Utiliser paypal_order_id pour trouver l'ID interne
        userId, // ID de l'utilisateur
        paymentDetails.purchase_units[0].amount.value, // Montant total
        'PayPal' // Type de paiement
      ]);

      return res.status(200).json({ message: 'Commande confirmée avec succès' });
    } else {
      return res.status(400).json({ message: 'Le paiement a échoué' });
    }
  } catch (error) {
    console.error('Erreur lors de la confirmation du paiement :', error.message);
    return res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});


module.exports = router;