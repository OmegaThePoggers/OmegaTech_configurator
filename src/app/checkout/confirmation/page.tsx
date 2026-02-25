'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Home, Receipt } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getOrders, SavedOrder } from '@/lib/orders';
import { useCart } from '@/context/CartContext';

import { Suspense } from 'react';

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const paymentId = searchParams.get('paymentId');
    const { clearCart } = useCart();

    const [order, setOrder] = useState<SavedOrder | null>(null);

    useEffect(() => {
        // Find the order that was just placed
        if (orderId) {
            const orders = getOrders();
            const found = orders.find(o => o.razorpayOrderId === orderId);
            if (found) {
                setOrder(found);
                // Auto clear cart since they just bought everything
                clearCart();
            }
        }
    }, [orderId, clearCart]);

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-20 flex justify-center">
                <div className="animate-pulse bg-zinc-900 rounded-xl h-96 w-full max-w-lg"></div>
            </div>
        );
    }

    const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl flex-grow flex flex-col items-center">

            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>

            <h1 className="text-3xl font-bold mb-2 text-center text-zinc-100">Payment Successful</h1>
            <p className="text-zinc-400 text-center mb-10">
                Thank you for your purchase. Your order has been confirmed.
            </p>

            <Card className="w-full bg-zinc-900 border-zinc-800 shadow-xl">
                <CardContent className="p-6 md:p-8">
                    {/* Order Meta */}
                    <div className="grid grid-cols-2 gap-4 pb-6 border-b border-zinc-800/60 mb-6 text-sm">
                        <div>
                            <span className="block text-zinc-500 mb-1">Date</span>
                            <span className="font-medium text-zinc-200">{date}</span>
                        </div>
                        <div>
                            <span className="block text-zinc-500 mb-1">Order No.</span>
                            <span className="font-mono font-medium text-zinc-200 text-xs break-all">{order.id}</span>
                        </div>
                        <div className="col-span-2">
                            <span className="block text-zinc-500 mb-1">Payment ID</span>
                            <span className="font-mono font-medium text-zinc-400 text-xs tracking-wider">{paymentId}</span>
                        </div>
                    </div>

                    {/* Receipt Items */}
                    <div className="space-y-4 mb-6">
                        <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                            <Receipt className="w-4 h-4" /> Order Summary
                        </h3>
                        <div className="bg-zinc-950/50 rounded-lg p-4 space-y-3">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-start gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-zinc-200">{item.name}</p>
                                        <p className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 mt-0.5">{item.category}</p>
                                    </div>
                                    <span className="text-sm font-mono text-zinc-400">
                                        ₹{item.price.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center pt-4 border-t border-zinc-800/60">
                        <span className="text-lg font-medium text-zinc-100">Total Paid</span>
                        <span className="text-2xl font-bold font-mono text-emerald-400">
                            ₹{order.totalAmount.toLocaleString('en-IN')}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full mt-10">
                <Button asChild variant="outline" className="flex-1 bg-transparent border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                    <Link href="/build">
                        Build Another PC
                    </Link>
                </Button>
                <Button asChild className="flex-1 bg-zinc-100 text-zinc-900 hover:bg-zinc-300">
                    <Link href="/">
                        <Home className="w-4 h-4 mr-2" />
                        Return Home
                    </Link>
                </Button>
            </div>

        </div>
    );
}

export default function ConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-20 flex justify-center">
                <div className="animate-pulse bg-zinc-900 rounded-xl h-96 w-full max-w-lg"></div>
            </div>
        }>
            <ConfirmationContent />
        </Suspense>
    );
}
