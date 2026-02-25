import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
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
                    <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white" asChild>
                        <Link href="/build">Start Building</Link>
                    </Button>
                </div>
            </div>
        </nav>
    );
}
