import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {urlConfig} from '../../config';
import { useCart } from '../../contexts/CartContext';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    useEffect(() => {
        // Task 1: Write async fetch operation
        // Write your code below this line
        const fetchGifts = async () => {
            try {
                const response = await fetch(`${urlConfig.backendUrl}/api/gifts`);
                if (!response.ok) {
                    throw new Error('Failed to fetch gifts');
                }
                const data = await response.json();
                setGifts(data);
            } catch (error) {
                console.error('Error fetching gifts:', error);
            }
        };

        fetchGifts();
    }, []);

    // Task 2: Navigate to details page
    const goToDetailsPage = (productId) => {
        // Write your code below this line
        navigate(`/app/product/${productId}`);
    };

    // Task 3: Format timestamp
    const formatDate = (timestamp) => {
        // Write your code below this line
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString();
    };

    const getConditionClass = (condition) => {
        return condition === "New" ? "list-group-item-success" : "list-group-item-warning";
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-5 welcome-title">Welcome to GiftLink</h1>
            <div className="row">
                {gifts.map((gift) => (
                    <div key={gift.id} className="col-md-4 mb-4">
                        <div className="card product-card">

                            {/* // Task 4: Display gift image or placeholder */}
                            {/* // Write your code below this line */}
                            {gift.image ? (
                                <img src={gift.image} className="card-img-top" alt={gift.name} />
                            ) : (
                                <div className="card-img-top bg-secondary text-white d-flex align-items-center justify-content-center" style={{height: '200px'}}>
                                    No Image Available
                                </div>
                            )}

                            <div className="card-body">

                                {/* // Task 5: Display gift name */}
                                {/* // Write your code below this line */}
                                <h5 className="card-title">{gift.name}</h5>

                                <p className={`card-text ${getConditionClass(gift.condition)}`}>
                                {gift.condition}
                                </p>

                                {/* // Task 6: Display gift category and date added */}
                                {/* // Write your code below this line */}
                                <p className="card-text">
                                    <small className="text-muted">Category: {gift.category}</small>
                                </p>
                                <p className="card-text">
                                    <small className="text-muted">Added: {formatDate(gift.date_added)}</small>
                                </p>

                                <div className="button-group">
                                    <button onClick={() => goToDetailsPage(gift.id)} className="btn btn-primary">
                                        View Details
                                    </button>
                                    <button onClick={() => { addToCart(gift); alert('Added to cart!'); }} className="btn btn-success buy-btn">
                                        <span className="btn-icon">🛒</span> Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;
