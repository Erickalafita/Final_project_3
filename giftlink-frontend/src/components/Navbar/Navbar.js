import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';
import { useCart } from '../../contexts/CartContext';

export default function Navbar() {
    const { isLoggedIn, userName, setIsLoggedIn, setUserName } = useAppContext();
    const { getCartTotal } = useCart();
    const navigate = useNavigate();
    const cartCount = getCartTotal();

    const handleLogout = () => {
        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('name');
        setIsLoggedIn(false);
        setUserName('');
        navigate('/app/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link className="navbar-brand" to="/">GiftLink</Link>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto">
                    {/* Task 1: Add links to Home and Gifts below*/}
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/app">Gifts</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/search">Search</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link cart-link" to="/app/cart">
                            🛒 Cart
                            {cartCount > 0 && (
                                <span className="cart-badge">{cartCount}</span>
                            )}
                        </Link>
                    </li>
                </ul>
                <ul className="navbar-nav">
                    {isLoggedIn ? (
                        <>
                            <li className="nav-item">
                                <span className="nav-link">Hi, {userName}</span>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/app/profile">Profile</Link>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link" to="/app/login">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/app/register">Register</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}
