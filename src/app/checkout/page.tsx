'use client';

import { useCart } from '@/context/CartContext';
import { getCheckoutItems, CheckoutItem } from '@/lib/checkout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

const STORE_STYLES: Record<string, string> = {
    'Amazon': 'bg-amber-600 hover:bg-amber-700 text-white',
    'Flipkart': 'bg-blue-600 hover:bg-blue-700 text-white',
    'MD Computers': 'bg-emerald-600 hover:bg-emerald-700 text-white',
};

export default function CheckoutPage() {
    const { builds, items, totalPrice } = useCart();

    const checkoutItems: CheckoutItem[] = useMemo(
        () => getCheckoutItems(builds, items),
        [builds, items]
    );

    if (checkoutItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 max-w-4xl flex-grow flex flex-col items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <ShoppingBag className="w-8 h-8 text-zinc-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Nothing to checkout</h1>
                    <p className="text-zinc-500 text-sm mb-6">Add components to your cart first.</p>
                    <Button asChild className="bg-zinc-100 text-zinc-900 hover:bg-zinc-300">
                        <Link href="/build">Start Building</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl flex-grow">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button asChild variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200">
                    <Link href="/cart">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Cart
                    </Link>
                </Button>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Price Comparison Checkout
            </h1>
            <p className="text-zinc-500 text-sm mb-8">
                Compare prices and buy each component from your preferred retailer.
            </p>

            {/* Component List */}
            <div className="space-y-3 mb-8">
                {checkoutItems.map((item) => (
                    <Card key={item.name} className="bg-zinc-900/50 border-zinc-800">
                        <CardContent className="p-5">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                {/* Component Info */}
                                <div className="flex-grow">
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">
                                        {item.category}
                                    </span>
                                    <h3 className="text-base font-medium text-zinc-100">{item.name}</h3>
                                    <span className="text-lg font-bold font-mono text-zinc-200 mt-1 block">
                                        ₹{item.price.toLocaleString('en-IN')}
                                    </span>
                                </div>

                                {/* Store Buttons */}
                                <div className="flex flex-wrap gap-2">
                                    {item.purchaseLinks.map((link) => (
                                        <a
                                            key={link.store}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${STORE_STYLES[link.store] || 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200'}`}
                                        >
                                            {link.store}
                                            <ExternalLink className="w-3 h-3 opacity-70" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Grand Total */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xl font-medium">Grand Total</span>
                            <p className="text-xs text-zinc-500 mt-0.5">
                                {checkoutItems.length} component{checkoutItems.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <span className="text-3xl font-bold font-mono">
                            ₹{totalPrice.toLocaleString('en-IN')}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Disclaimer */}
            <p className="text-[11px] text-zinc-600 text-center mt-4">
                Prices shown are approximate. Click a store button to verify current pricing on the retailer&apos;s website.
            </p>
        </div>
    );
}
