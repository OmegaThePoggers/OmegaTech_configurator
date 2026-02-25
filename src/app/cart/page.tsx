'use client';

import { useCart } from '@/context/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingCart, X, Monitor, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
    const { items, builds, removeItem, removeBuild, clearCart, totalPrice, totalItems } = useCart();

    const hasBuilds = builds.length > 0;
    const hasItems = items.length > 0;
    const isEmpty = !hasBuilds && !hasItems;

    if (isEmpty) {
        return (
            <div className="container mx-auto px-4 py-20 max-w-4xl flex-grow flex flex-col items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <ShoppingCart className="w-8 h-8 text-zinc-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
                    <p className="text-zinc-500 text-sm">Browse components or build a PC to get started.</p>
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

            {/* PC Builds Section */}
            {hasBuilds && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Monitor className="w-5 h-5 text-zinc-400" />
                        <h2 className="text-xl font-semibold">PC Builds</h2>
                        <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{builds.length}</span>
                    </div>

                    <div className="space-y-4">
                        {builds.map((build, index) => (
                            <Card key={build.id} className="bg-zinc-900/50 border-zinc-800">
                                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-base font-medium text-zinc-200">
                                        Custom Build #{index + 1}
                                        <span className="ml-2 text-sm text-zinc-500 font-normal">
                                            ({build.components.length} components)
                                        </span>
                                    </CardTitle>
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-bold font-mono text-zinc-100">
                                            ₹{build.totalPrice.toLocaleString('en-IN')}
                                        </span>
                                        <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-rose-400" onClick={() => removeBuild(build.id)}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {build.components.map((comp) => (
                                            <div key={comp.name} className="flex flex-col p-2 bg-zinc-950/50 rounded-md border border-zinc-800/50">
                                                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">{comp.category}</span>
                                                <span className="text-xs text-zinc-300 truncate" title={comp.name}>{comp.name}</span>
                                                <span className="text-xs font-mono text-zinc-500">₹{comp.price.toLocaleString('en-IN')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Individual Components Section */}
            {hasItems && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <ShoppingCart className="w-5 h-5 text-zinc-400" />
                        <h2 className="text-xl font-semibold">Individual Components</h2>
                        <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{items.length}</span>
                    </div>

                    <div className="space-y-3">
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
                </div>
            )}

            {/* Total */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-medium">Total:</span>
                        <span className="text-3xl font-bold font-mono">₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Checkout Button */}
            <Button asChild className="w-full mt-4 bg-zinc-100 text-zinc-900 hover:bg-zinc-300 font-semibold text-base h-12">
                <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
            </Button>
        </div>
    );
}
