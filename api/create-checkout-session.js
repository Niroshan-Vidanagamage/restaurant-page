const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return res.status(500).json({
        error: 'Stripe server is not configured. Add STRIPE_SECRET_KEY in Vercel environment variables.'
      });
    }

    const stripe = new Stripe(stripeSecretKey);
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const amount = Number(payload?.amount);
    const cart = Array.isArray(payload?.cart) ? payload.cart : [];

    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({
        error: 'Invalid amount. It must be a positive integer in cents.'
      });
    }

    const fallbackOrigin = process.env.CLIENT_URL || 'http://localhost:3000';
    const origin = (req.headers.origin || fallbackOrigin).replace(/\/+$/, '');

    const lineItems = cart.length
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
      success_url: `${origin}/menu?payment=success`,
      cancel_url: `${origin}/menu?payment=cancel`
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    return res.status(500).json({
      error: error.message || 'Unable to create checkout session.'
    });
  }
};
