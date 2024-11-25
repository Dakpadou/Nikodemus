const paypal = require('@paypal/checkout-server-sdk');
require('dotenv').config();

function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

async function testPaypalConnection() {
  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'EUR',
          value: '10.00',
        },
      },
    ],
  });

  try {
    const response = await client().execute(request);
    console.log('Connexion réussie, réponse :', response.result);
  } catch (error) {
    console.error('Erreur lors de la connexion PayPal :', error.message);
    console.error('Détails de l\'erreur :', error.response);
  }
}

testPaypalConnection();