import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import './Menu.css';
import {
  Card,
  CardBody,
  CardText,
  CardTitle,
  Button,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap';

import { menus } from './menuData';
import Lottie from 'lottie-react'; // Import Lottie
import WalletAnimation from '../utils/animations/Wallet.json'; // Assuming your animation file path

const DESKTOP_MEDIA_QUERY = '(min-width: 993px)';
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const stripePromise = STRIPE_PUBLISHABLE_KEY
  ? loadStripe(STRIPE_PUBLISHABLE_KEY)
  : null;

function Menu() {
  const location = useLocation();
  const paymentStatus = new URLSearchParams(location.search).get('payment');
  const getIsDesktop = () =>
    typeof window !== 'undefined' &&
    window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
  // 1️⃣ Initialize cart from localStorage (once on mount)
  const [cart, setCart] = useState(() => {
    try {
      const stored = window.localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Failed to parse cart from localStorage:', err);
      return [];
    }
  });

  // 2️⃣ Sync cart to localStorage on every change
  useEffect(() => {
    try {
      window.localStorage.setItem('cart', JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  }, [cart]);

  // New state to control animation visibility
  const [showCheckoutAnimation, setShowCheckoutAnimation] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => getIsDesktop());
  const [isCartExpanded, setIsCartExpanded] = useState(() => !getIsDesktop());

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

    const handleMediaChange = event => {
      setIsDesktop(event.matches);
      setIsCartExpanded(!event.matches);
    };

    setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const targetId = decodeURIComponent(location.hash.slice(1));
    const targetElement = document.getElementById(targetId);

    if (!targetElement) {
      return;
    }

    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }, [location.hash]);

  useEffect(() => {
    if (paymentStatus === 'success') {
      setCart([]);
      window.localStorage.removeItem('cart');
    }
  }, [paymentStatus]);

  const addToCart = item => {
    setCart(prev => [...prev, item]);
  };

  const removeFromCart = index => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const handleGoToCheckout = () => {
    setShowCheckoutAnimation(true); // Show animation
    // Play animation for 1 second, then redirect to Stripe Checkout
    setTimeout(async () => {
      try {
        if (!stripePromise) {
          throw new Error('Stripe is not configured. Add REACT_APP_STRIPE_PUBLISHABLE_KEY in your .env file.');
        }

        const stripe = await stripePromise;

        if (!stripe) {
          throw new Error('Stripe is not configured. Add REACT_APP_STRIPE_PUBLISHABLE_KEY in your .env file.');
        }

        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: Math.round(total * 100),
            cart
          })
        });

        if (!response.ok) {
          let message = 'Failed to create Stripe Checkout session.';
          try {
            const errorBody = await response.json();
            if (errorBody?.error) {
              message = errorBody.error;
            }
          } catch (parseErr) {
            console.error('Unable to parse checkout error response:', parseErr);
          }
          throw new Error(message);
        }

        const data = await response.json();

        if (!data?.sessionId) {
          throw new Error('Stripe session ID was not returned by the server.');
        }

        const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });

        if (result.error) {
          throw new Error(result.error.message);
        }
      } catch (err) {
        console.error(err);
        alert(err.message || 'Unable to redirect to Stripe Checkout.');
        setShowCheckoutAnimation(false);
      }
    }, 1000); // 1000 milliseconds = 1 second
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className={`menu-page d-flex ${isDesktop ? 'desktop-cart-mode' : ''}`}>
      {/* ===== MENU LIST ===== */}
      <div className="menu-list flex-grow-1">
        {paymentStatus === 'success' && (
          <div className="container mt-5 mb-3">
            <div className="alert alert-success" role="alert">
              Payment Sucessfull
            </div>
          </div>
        )}
        {paymentStatus === 'cancel' && (
          <div className="container mt-5 mb-3">
            <div className="alert alert-warning" role="alert">
              Payment was canceled.
            </div>
          </div>
        )}
        <header className="mt-5 text-center">
          <h1 className='mb-0 text-white fw-bold'>Menu</h1>
        </header>

        {Object.entries(menus).map(([section, { items, img }]) => (
          <section key={section} className={`${section.toLowerCase()} my-5`}>
            <div className="container">
              <h2 className="text-center fs-1 mb-4 text-success text-uppercase">
                {section}
              </h2>

              <div className="row flex-column-reverse flex-lg-row align-items-center">
                <div className="col-lg-6 d-flex justify-content-center">
                  <img
                    src={img}
                    className="img-fluid w-75 mt-4 mt-lg-0"
                    alt={section}
                  />
                </div>

                <div className="col-lg-6 d-flex flex-column justify-content-around">
                  {items.map(item => (
                    <Card id={`${section.toLowerCase()}-${item.id}`}
                      key={item.id}
                      className={`border-0 ${
                        section === 'Lunch' || section === 'Dessert'
                          ? 'bg-dark text-light'
                          : ''
                      } mb-3`}
                    >
                      <CardBody>
                        <CardTitle className="fs-3">{item.name}</CardTitle>
                        <CardText className="fs-5">
                          {item.description}
                        </CardText>

                        <div className="d-flex justify-content-between align-items-center">
                          <CardText className="fs-3 fw-bold text-success">
                            ${item.price}
                          </CardText>
                          <Button
                            className="btn-add"
                            variant="success"
                            size="sm"
                            onClick={() =>
                              addToCart({ ...item, section })
                            }
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ===== CART SIDEBAR ===== */}
      <aside
        id="menu-cart-sidebar"
        className={`cart-sidebar ${isDesktop && !isCartExpanded ? 'is-collapsed' : 'is-open'}`}
      >
        <h3>🛒 Your Cart</h3>

        {cart.length === 0 ? (
          <p>No items yet.</p>
        ) : (
          <>
          <ListGroup>
            {cart.map((item, idx) => (
              <ListGroupItem key={idx} className="cart-item">
                <div className="item-info">
                
                  <strong>{item.name}</strong>
                  <div className="text-muted small">{item.section}</div>
                </div>
                <div className="item-controls">
                  <span className="me-3">${item.price}</span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeFromCart(idx)}
                  >
                    Remove
                  </Button>
                </div>
              </ListGroupItem>
            ))}

            <ListGroupItem className="cart-item total-row">
              <div className="item-info"><strong>Total:</strong></div>
              <div className="item-controls"><strong>${total}</strong></div>
            </ListGroupItem>
          </ListGroup>
          
          {/* Go to Checkout Button */}
          <div className="text-center mt-3">
             <Button
               variant="primary"
               size="lg"
               onClick={handleGoToCheckout} // Use the new handler
               disabled={showCheckoutAnimation} // Disable button during animation
             >
               Go to Checkout
             </Button>
           </div>
          </>
        )}
      </aside>

      {isDesktop && (
        <Button
          className="cart-fab"
          variant="success"
          onClick={() => setIsCartExpanded(prev => !prev)}
          aria-expanded={isCartExpanded}
          aria-controls="menu-cart-sidebar"
        >
          {isCartExpanded ? 'Hide Cart' : `🛒 Cart${cart.length ? ` (${cart.length})` : ''}`}
        </Button>
      )}

      {/* Checkout Animation Overlay */}
      {showCheckoutAnimation && (
        <div className="checkout-animation-overlay">
          <Lottie
            animationData={WalletAnimation}
            loop={false} // Play once
            autoplay={true}
            style={{ width: 200, height: 200 }} // Adjust size as needed
          />
        </div>
      )}
    </div>
  );
}

export default Menu;
