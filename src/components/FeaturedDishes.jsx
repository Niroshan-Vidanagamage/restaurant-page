import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { allDishes } from '../pages/menuData';
import './FeaturedDishes.css';

export function FeaturedDishes() {
  // Duplicate the dishes to create a seamless loop effect
  const duplicatedDishes = [...allDishes, ...allDishes];

  return (
    <div className="featured-dishes-section">
      <h2 className="text-center fs-1 mb-5 text-uppercase fw-bold text-white">Featured Dishes</h2>
      <div className="scrolling-wrapper">
        <div className="scrolling-content">
          {duplicatedDishes.map((dish, index) => (
            <Link to={`/menu#${dish.uniqueId}`} key={`${dish.uniqueId}-${index}`} className="dish-link">
              <Card className="dish-card bg-dark text-light">
                <Card.Img variant="top" src={dish.img} className="dish-card-img" />
                <Card.Body className="text-center">
                  <Card.Title className="fs-5">{dish.name}</Card.Title>
                  <Card.Text className="text-success fw-bold">
                    £{dish.price}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}