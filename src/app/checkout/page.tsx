'use client';

import { useCart } from '@/context/CartContext';
import { getCheckoutItems, CheckoutItem } from '@/lib/checkout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, ShoppingBag, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { saveOrder } from '@/lib/orders';

declare global {
    interface Window {
        Razorpay: any;
    }
}

const STORE_STYLES: Record<string, string> = {
    'Amazon': 'bg-amber-600 hover:bg-amber-700 text-white',
    'Flipkart': 'bg-blue-600 hover:bg-blue-700 text-white',
    'MD Computers': 'bg-emerald-600 hover:bg-emerald-700 text-white',
};

export default function CheckoutPage() {
    const { builds, items, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

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

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            // 1. Create order
            const res = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: totalPrice }),
            });
            const { orderId } = await res.json();

            // 2. Open Razorpay modal
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: totalPrice * 100,
                currency: 'INR',
                name: 'OmegaTech',
                description: 'PC Components Purchase',
                order_id: orderId,
                handler: async (response: any) => {
                    // 3. Verify payment
                    const verifyRes = await fetch('/api/verify-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(response),
                    });
                    const data = await verifyRes.json();

                    if (data.verified) {
                        // 4. Save order to localStorage
                        saveOrder({
                            id: `OT-${Date.now()}`,
                            razorpayOrderId: orderId,
                            razorpayPaymentId: response.razorpay_payment_id,
                            items: checkoutItems.map(i => ({
                                name: i.name,
                                category: i.category,
                                price: i.price
                            })),
                            totalAmount: totalPrice,
                            status: 'completed'
                        });

                        // 5. Let user manually clear cart on confirmation, just redirect
                        router.push(`/checkout/confirmation?orderId=${orderId}&paymentId=${response.razorpay_payment_id}`);
                    } else {
                        alert('Payment verification failed');
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: 'Guest User',
                    email: 'guest@example.com',
                    contact: '9999999999',
                },
                theme: {
                    color: '#18181b', // zinc-950
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl flex-grow">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

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

            <div className="mt-12 flex flex-col items-center">
                <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center shadow-xl shadow-black/20">
                    <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-zinc-100 mb-2">Buy Directly from OmegaTech</h3>
                    <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                        Prefer to get everything in one place? Buy your entire build directly through us via Razorpay secure checkout.
                    </p>
                    <Button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition-colors"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            `Pay ₹${totalPrice.toLocaleString('en-IN')} with Razorpay`
                        )}
                    </Button>
                    <p className="text-xs text-zinc-600 mt-4 flex items-center justify-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Test Mode Enabled (No real charges)
                    </p>
                </div>
            </div>
        </div>
    );
}
