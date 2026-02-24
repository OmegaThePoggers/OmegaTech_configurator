import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t border-zinc-800 bg-zinc-950 py-6 mt-auto">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                <p className="text-sm text-zinc-500">
                    &copy; {new Date().getFullYear()} OmegaTech Configurator. All rights reserved.
                </p>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <Link href="/about" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                        About Us
                    </Link>
                    <Link href="/contact" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                        Contact
                    </Link>
                </div>
            </div>
        </footer>
    );
}
