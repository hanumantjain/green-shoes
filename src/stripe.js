// const stripe = Stripe('pk_test_your_publishable_key'); // Replace with your Publishable Key
const config = require('../config');
const stripe = require('stripe')(config.secretKey);
const elements = stripe.elements();

const cardElement = elements.create('card');
cardElement.mount('#card-element'); // Mount card input to your DOM element

const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  });

  if (error) {
    console.error('Error creating payment method:', error);
  } else {
    console.log('Payment method created:', paymentMethod);
    // Send paymentMethod.id to your backend for further processing
  }
});
