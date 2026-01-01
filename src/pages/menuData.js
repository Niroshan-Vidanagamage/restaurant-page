import BreakfastImg from '../utils/img/breakfast.jpg';
import LunchImg from '../utils/img/lunch.jpg';
import DinnerImg from '../utils/img/dinner.jpg';
import DessertImg from '../utils/img/dessert.jpg';

export const menus = {
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

export const allDishes = Object.entries(menus).flatMap(([section, { items, img }]) => 
  items.map(item => ({
    ...item,
    section,
    img,
    uniqueId: `${section.toLowerCase()}-${item.id}`
  }))
);

