import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import './Cart.css';

function Cart() {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

    const handleQuantityChange = (giftId, newQuantity) => {
        const quantity = parseInt(newQuantity);
        if (quantity > 0) {
            updateQuantity(giftId, quantity);
        }
    };

    const handleCheckout = () => {
        alert('Checkout functionality would be implemented here!');
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-5 cart-title">Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Add some items to get started!</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/app')}
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-image">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} />
                                    ) : (
                                        <div className="no-image">No Image</div>
                                    )}
                                </div>
                                <div className="cart-item-details">
                                    <h4>{item.name}</h4>
                                    <p className="cart-item-category">{item.category}</p>
                                    <p className="cart-item-condition">
                                        <span className={`badge ${item.condition === 'New' ? 'bg-success' : 'bg-warning'}`}>
                                            {item.condition}
                                        </span>
                                    </p>
                                </div>
                                <div className="cart-item-quantity">
                                    <label>Quantity:</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                        className="quantity-input"
                                    />
                                </div>
                                <div className="cart-item-actions">
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <div className="cart-summary-content">
                            <h3>Cart Summary</h3>
                            <div className="cart-summary-row">
                                <span>Total Items:</span>
                                <span className="cart-summary-value">
                                    {cartItems.reduce((total, item) => total + item.quantity, 0)}
                                </span>
                            </div>
                        </div>
                        <div className="cart-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate('/app')}
                            >
                                Continue Shopping
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={clearCart}
                            >
                                Clear Cart
                            </button>
                            <button
                                className="btn btn-success btn-checkout"
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;