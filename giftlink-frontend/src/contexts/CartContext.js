import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Load cart from localStorage on initial render
        const savedCart = localStorage.getItem('giftlink-cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('giftlink-cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (gift) => {
        setCartItems((prevItems) => {
            // Check if item already exists in cart
            const existingItem = prevItems.find(item => item.id === gift.id);

            if (existingItem) {
                // Increase quantity if item exists
                return prevItems.map(item =>
                    item.id === gift.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Add new item with quantity 1
                return [...prevItems, { ...gift, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (giftId) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== giftId));
    };

    const updateQuantity = (giftId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(giftId);
            return;
        }

        setCartItems((prevItems) =>
            prevItems.map(item =>
                item.id === giftId
                    ? { ...item, quantity: quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
