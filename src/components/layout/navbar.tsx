'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function Navbar() {
    const { totalItems } = useCart();

    return (
        <nav className="sticky top-0 z-50 w-full glass-panel">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <Link href="/" className="text-xl font-bold tracking-tighter text-zinc-50">
                        OmegaTech
                    </Link>
                    <div className="hidden md:flex space-x-4">
                        <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors">
                            Home
                        </Link>
                        <Link href="/build" className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors">
                            Build PC
                        </Link>
                        <Link href="/components" className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors">
                            Components
                        </Link>
                        <Link href="/configs" className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors">
                            Saved Configs
                        </Link>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <Link href="/contact" className="hidden md:block text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors">
                        Contact
                    </Link>
                    <Link href="/cart" className="relative text-zinc-400 hover:text-zinc-50 transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-zinc-100 text-zinc-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                    <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white" asChild>
                        <Link href="/build">Start Building</Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
}
