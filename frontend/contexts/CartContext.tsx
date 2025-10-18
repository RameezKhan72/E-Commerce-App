import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import { API_URL } from '../constants/config';

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    total: number;
    loading: boolean;
    addToCart: (product: Product, quantity?: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => void;
}

export const CartContext = createContext<CartContextType>({
    items: [], total: 0, loading: true,
    addToCart: async () => {}, removeFromCart: async () => {}, updateQuantity: async () => {}, clearCart: () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        const fetchCart = async () => {
            if (token) {
                try {
                    setLoading(true);
                    const response = await axios.get(`${API_URL}/cart`);
                    setItems(response.data.items || []);
                } catch (error) {
                    // Let the interceptor handle the 401 error
                    console.error("Failed to fetch cart");
                } finally {
                    setLoading(false);
                }
            } else {
                setItems([]);
                setLoading(false);
            }
        };
        fetchCart();
    }, [token]);

    useEffect(() => {
        const newTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        setTotal(newTotal);
    }, [items]);

    const addToCart = async (product: Product, quantity = 1) => {
        try {
            const response = await axios.post(`${API_URL}/cart`, { productId: product._id, quantity });
            setItems(response.data.items);
        } catch (error) {
            console.error("Failed to add to cart:", error);
        }
    };

    const removeFromCart = async (productId: string) => {
        try {
            const response = await axios.delete(`${API_URL}/cart/${productId}`);
            setItems(response.data.items);
        } catch (error) {
            console.error("Failed to remove from cart:", error);
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        try {
            const response = await axios.put(`${API_URL}/cart/${productId}`, { quantity });
            setItems(response.data.items);
        } catch (error) {
            console.error("Failed to update cart quantity:", error);
        }
    };

    const clearCart = () => {
        setItems([]);
    };

    return (
        <CartContext.Provider value={{ items, total, loading, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

