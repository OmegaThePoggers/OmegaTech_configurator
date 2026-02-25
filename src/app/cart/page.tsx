'use client';

import { useCart } from '@/context/CartContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart, X } from 'lucide-react';

export default function CartPage() {
    const { items, removeItem, clearCart, totalPrice, totalItems } = useCart();

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 max-w-4xl flex-grow flex flex-col items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <ShoppingCart className="w-8 h-8 text-zinc-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
                    <p className="text-zinc-500 text-sm">Browse components and add items to get started.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl flex-grow">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    Shopping Cart <span className="text-zinc-500 text-xl font-normal">({totalItems} items)</span>
                </h1>
                <Button variant="outline" size="sm" className="border-zinc-700 text-rose-500 hover:text-rose-400 hover:bg-zinc-800" onClick={clearCart}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                </Button>
            </div>

            <div className="space-y-3 mb-8">
                {items.map((item) => (
                    <Card key={item.name} className="bg-zinc-900/50 border-zinc-800">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex-grow">
                                <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">{item.category}</span>
                                <h3 className="text-base font-medium text-zinc-100">{item.name}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-sm font-mono text-zinc-300">₹{item.price.toLocaleString('en-IN')}</span>
                                    <span className="text-xs text-zinc-500">× {item.quantity}</span>
                                    <span className="text-sm font-bold font-mono text-zinc-100">= ₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-rose-400" onClick={() => removeItem(item.name)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-medium">Total:</span>
                        <span className="text-3xl font-bold font-mono">₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
