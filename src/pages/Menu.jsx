import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

import BreakfastImg from '../utils/img/breakfast.jpg';
import LunchImg     from '../utils/img/lunch.jpg';
import DinnerImg    from '../utils/img/dinner.jpg';
import DessertImg   from '../utils/img/dessert.jpg';

const menus = {
  Breakfast: {
    items: [
      { id: 1, name: 'English Breakfast', description: 'smoked bacon, sausage, tomato, mushrooms, black pudding, baked beans, eggs', price: 12 },
      { id: 2, name: 'Avocado Toast',     description: 'poached egg, avocado, onion, tomatoes, bread', price: 8 },
      { id: 3, name: 'Burrito',            description: 'tortilla, egg, cheese, potatoes, pork meat', price: 11 },
    ],
    img: BreakfastImg,
  },
  Lunch: {
    items: [
      { id: 1, name: 'Caesar Salad',         description: 'chicken breast, romaine lettuce, croutons, parmesan', price: 15 },
      { id: 2, name: 'Spaghetti Carbonara',   description: 'spaghetti, pancetta, garlic, eggs, parmesan, pepper', price: 14 },
      { id: 3, name: 'Pizza',                 description: 'chorizo, italian salami, tomatoes, mushrooms, olives', price: 12 },
    ],
    img: LunchImg,
  },
  Dinner: {
    items: [
      { id: 1, name: 'Spicy Beef',            description: 'spicy beef, potatoes, carrots, cheese sauce, spices', price: 17 },
      { id: 2, name: 'Spaghetti Bolognese',   description: 'onion, carrot, celery, minced meat, spaghetti, parmesan', price: 15 },
      { id: 3, name: 'Chickpea Curry',        description: 'onion, chickpea, garlic, mushrooms, tomatoes, spices', price: 12 },
    ],
    img: DinnerImg,
  },
  Dessert: {
    items: [
      { id: 1, name: 'Lemon Cake',      description: 'flour, sugar, baking powder, lemon', price: 9 },
      { id: 2, name: 'Cinnamon Rolls',  description: 'flour, salt, sugar, cinnamon, yeast, sour cream, milk', price: 11 },
      { id: 3, name: 'Vegan Pancakes',  description: 'flour, sugar, baking powder, soya milk, blueberries', price: 8 },
    ],
    img: DessertImg,
  },
};

function Menu() {
  const navigate = useNavigate();
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

  const addToCart = item => {
    setCart(prev => [...prev, item]);
  };

  const removeFromCart = index => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="menu-page d-flex">
      {/* ===== MENU LIST ===== */}
      <div className="menu-list flex-grow-1">
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
                    <Card
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
                            £{item.price}
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
      <aside className="cart-sidebar bg-light p-4">
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
                  <span className="me-3">£{item.price}</span>
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
              <div className="item-controls"><strong>£{total}</strong></div>
            </ListGroupItem>
          </ListGroup>
          
          {/* Go to Checkout Button */}
          <div className="text-center mt-3">
             <Button
               variant="primary"
               size="lg"
               onClick={() => navigate('/checkout', {state : {amount: total *100}})}
             >
               Go to Checkout
             </Button>
           </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default Menu;
