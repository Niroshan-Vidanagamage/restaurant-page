const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4242;

app.use(cors());
app.use(express.json());

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({
        error: 'Stripe server is not configured. Add STRIPE_SECRET_KEY in .env.'
      });
    }

    const { amount, cart } = req.body;

    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount. It must be a positive integer in cents.' });
    }

    const clientUrl = (process.env.CLIENT_URL || 'http://localhost:3000').replace(/\/+$/, '');

    const hasCartItems = Array.isArray(cart) && cart.length > 0;
    const lineItems = hasCartItems
      ? cart.map(item => ({
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(Number(item.price) * 100),
            product_data: {
              name: item.name || 'Menu Item',
              description: item.section || undefined
            }
          }
        }))
      : [
          {
            quantity: 1,
            price_data: {
              currency: 'usd',
              unit_amount: amount,
              product_data: {
                name: 'Restaurant Order'
              }
            }
          }
        ];

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${clientUrl}/menu?payment=success`,
      cancel_url: `${clientUrl}/menu?payment=cancel`
    });

    return res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    return res.status(500).json({ error: error.message || 'Unable to create checkout session.' });
  }
});

app.listen(PORT, () => {
  console.log(`Stripe server listening on http://localhost:${PORT}`);
});
