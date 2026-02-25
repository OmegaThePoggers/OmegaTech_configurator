'use client';

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

export type CartItem = {
    name: string;
    price: number;
    category: string;
    quantity: number;
};

type CartContextType = {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (name: string) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isInCart: (name: string) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (item: Omit<CartItem, 'quantity'>) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.name === item.name);
            if (existing) {
                return prev.map((i) =>
                    i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeItem = (name: string) => {
        setItems((prev) => prev.filter((i) => i.name !== name));
    };

    const clearCart = () => {
        setItems([]);
    };

    const isInCart = (name: string) => {
        return items.some((i) => i.name === name);
    };

    const totalItems = useMemo(() => items.reduce((a, i) => a + i.quantity, 0), [items]);
    const totalPrice = useMemo(() => items.reduce((a, i) => a + i.price * i.quantity, 0), [items]);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalItems, totalPrice, isInCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
}
