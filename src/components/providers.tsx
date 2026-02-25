'use client';

import { CartProvider } from '@/context/CartContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
    return <CartProvider>{children}</CartProvider>;
}
