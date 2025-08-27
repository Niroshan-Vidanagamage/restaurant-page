
import  { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import axios from 'axios';
import logo from '../utils/img/about-img.jpg';

const stripePromise = loadStripe('pk_test_51RjicF4TAaMvBQzbysmHcKYUStJSELV8wwbEBz0Wjy2lN8i4tOQCodjA398H3gwbGWUENvDvuyzgZsMQUiTbpuZq00Z7NGRaf1'); // Use your Stripe Publishable Key

function PaymentForm() {
  const { state } = useLocation();
  const navigate    = useNavigate();
  const stripe      = useStripe();
  const elements    = useElements();
  const [amount, setAmount]     = useState(null);
  const [loading, setLoading]   = useState(false);

  // Once on mount, grab amount or redirect
  useEffect(() => {
    if (!state?.amount) {
      // no amount → go back
      navigate('/menu', { replace: true });
    } else {
      setAmount(state.amount);
    }
  }, [state, navigate]);

  // While we decide, show nothing or a spinner
  if (amount === null) {
    return <p>Loading...</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        '/api/create-payment-intent',
        { amount }
      );
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        alert('Payment successful!');
        window.localStorage.removeItem('cart');
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error(err);
      alert('Payment failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <form onSubmit={handleSubmit}>
      <h2>Pay ${(amount / 100).toFixed(2)}</h2>
      <CardElement options={{ hidePostalCode: true }} />
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing…' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
    </form>
  );
}

export default function PaymentPage() {
  return (
    <div className ='payment-page'>
        <div className="payment-logo">
            <img src={logo} className="img-fluid w-75 mt-4 mt-lg-0" alt="Restaurant Logo" />
        </div>
        <Elements stripe={stripePromise}>
        <PaymentForm />
        </Elements>
    </div>
  );
}