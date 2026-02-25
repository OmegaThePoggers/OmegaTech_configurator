'use client';

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

export type CartItem = {
    name: string;
    price: number;
    category: string;
    quantity: number;
};

export type CartBuild = {
    id: string;
    components: Omit<CartItem, 'quantity'>[];
    totalPrice: number;
    addedAt: number;
};

type CartContextType = {
    items: CartItem[];
    builds: CartBuild[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (name: string) => void;
    addBuild: (components: Omit<CartItem, 'quantity'>[]) => void;
    removeBuild: (id: string) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isInCart: (name: string) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [builds, setBuilds] = useState<CartBuild[]>([]);

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

    const addBuild = (components: Omit<CartItem, 'quantity'>[]) => {
        const build: CartBuild = {
            id: `build-${Date.now()}`,
            components,
            totalPrice: components.reduce((sum, c) => sum + c.price, 0),
            addedAt: Date.now(),
        };
        setBuilds((prev) => [...prev, build]);
    };

    const removeBuild = (id: string) => {
        setBuilds((prev) => prev.filter((b) => b.id !== id));
    };

    const clearCart = () => {
        setItems([]);
        setBuilds([]);
    };

    const isInCart = (name: string) => {
        return items.some((i) => i.name === name);
    };

    const totalItems = useMemo(
        () => items.reduce((a, i) => a + i.quantity, 0) + builds.length,
        [items, builds]
    );

    const totalPrice = useMemo(
        () =>
            items.reduce((a, i) => a + i.price * i.quantity, 0) +
            builds.reduce((a, b) => a + b.totalPrice, 0),
        [items, builds]
    );

    return (
        <CartContext.Provider
            value={{ items, builds, addItem, removeItem, addBuild, removeBuild, clearCart, totalItems, totalPrice, isInCart }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
}
