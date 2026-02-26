import React, { useState } from "react";
import { Card, CardBody, CardText, CardFooter, CardTitle } from 'react-bootstrap';
import './Reviews.css';
import Person1 from '../utils/img/person1.jpg';
import Person2 from '../utils/img/person2.jpg';
import Person3 from '../utils/img/person3.jpg';
import Person4 from '../utils/img/person4.jpg';
import Person5 from '../utils/img/person1.jpg';
import Person6 from '../utils/img/person2.jpg';

const allReviews = [
    { img: Person1, name: "John Mike", text: "Lorem ipsum dolor sit amet consectetur adipisicing elit..." },
    { img: Person2, name: "Maria Cruz", text: "Dolores, mollitia?" },
    { img: Person3, name: "Anna Gold", text: "Quam dolor itaque reprehenderit minus tempore..." },
    { img: Person4, name: "Nick Burn", text: "Rerum et voluptate minus error suscipit officiis..." },
    { img: Person5, name: "Ella Ford", text: "Some more feedback here..." },
    { img: Person6, name: "Liam Smith", text: "Another nice comment..." }
];

export function Reviews() {
    const [page, setPage] = useState(0);
    const perPage = 4;
    const maxPage = Math.ceil(allReviews.length / perPage) - 1;

    const currentReviews = allReviews.slice(page * perPage, (page + 1) * perPage);

    return (
        <div className="reviews-section container">
            <h2 className="text-center mb-4 text-uppercase fw-bold fs-1">Reviews</h2>

            <div className="row g-4">
                {currentReviews.map((review, idx) => (
                    <div className="col-lg-6" key={idx}>
                        <Card className="h-100 shadow">
                            <CardBody>
                                <div className="p-4">
                                    <CardText>{review.text}</CardText>
                                </div>
                            </CardBody>
                            <CardFooter className="d-flex align-items-center">
                                <img src={review.img} className="img-fluid rounded-circle mx-3 shadow" alt={review.name} width={60} height={60} />
                                <CardTitle className="text-success mb-0">{review.name}</CardTitle>
                            </CardFooter>
                        </Card>
                    </div>
                ))}
            </div>

            <div className="d-flex justify-content-center gap-3 mt-4">
                
                <div className="d-flex justify-content-center mt-3">
                    {Array.from({ length: maxPage + 1 }).map((_, idx) => (
                        <span
                            key={idx}
                            onClick={() => setPage(idx)}
                            style={{
                                cursor: 'pointer',
                                fontSize: '1.5rem',
                                margin: '0 6px',
                                color: page === idx ? '#28a745' : '#ccc'
                            }}
                        >
                            {page === idx ? '●' : '○'}
                        </span>
                    ))}
                </div>
                
            </div>
        </div>
    );
}