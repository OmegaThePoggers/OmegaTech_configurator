'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check } from 'lucide-react';
import pcComponentsData from '@/data/pc-components.json';
import { useCart } from '@/context/CartContext';

// Types
type ComponentStoreLink = { store: string; url: string };
type ComponentItem = {
    name: string;
    price: number;
    purchaseLinks: ComponentStoreLink[];
    category: string;
};

// Flatten all categories into a single array of items tagged with category
const allComponents: ComponentItem[] = Object.entries(pcComponentsData.categories).flatMap(
    ([category, items]) =>
        (items as Omit<ComponentItem, 'category'>[]).map((item) => ({
            ...item,
            category,
        }))
);

// Extract unique brands from component names
function extractBrand(name: string): string {
    const brandMap: Record<string, string> = {
        Intel: 'Intel',
        AMD: 'AMD',
        NVIDIA: 'NVIDIA',
        Corsair: 'Corsair',
        'G.Skill': 'G.Skill',
        Kingston: 'Kingston',
        Crucial: 'Crucial',
        Team: 'Team',
        Samsung: 'Samsung',
        WD: 'WD',
        Seagate: 'Seagate',
        'Cooler Master': 'Cooler Master',
        EVGA: 'EVGA',
        Seasonic: 'Seasonic',
        BeQuiet: 'BeQuiet',
        NZXT: 'NZXT',
        'Lian Li': 'Lian Li',
        Fractal: 'Fractal',
    };
    for (const [key, brand] of Object.entries(brandMap)) {
        if (name.includes(key)) return brand;
    }
    return 'Other';
}

const allBrands = [...new Set(allComponents.map((c) => extractBrand(c.name)))].sort();
const allCategories = Object.keys(pcComponentsData.categories);

type SortOrder = 'price-asc' | 'price-desc' | 'name-asc';

export default function ComponentsPage() {
    const { addItem, isInCart } = useCart();

    // Filter state
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
        new Set(allCategories)
    );
    const [selectedBrand, setSelectedBrand] = useState<string>('all');
    const [priceMin, setPriceMin] = useState<number>(0);
    const [priceMax, setPriceMax] = useState<number>(100000);
    const [sortOrder, setSortOrder] = useState<SortOrder>('price-asc');

    // Toggle category
    const toggleCategory = (cat: string) => {
        setSelectedCategories((prev) => {
            const next = new Set(prev);
            if (next.has(cat)) {
                next.delete(cat);
            } else {
                next.add(cat);
            }
            return next;
        });
    };

    // Filtered and sorted components
    const filteredComponents = useMemo(() => {
        return allComponents
            .filter((item) => selectedCategories.has(item.category))
            .filter((item) => selectedBrand === 'all' || extractBrand(item.name) === selectedBrand)
            .filter((item) => item.price >= priceMin && item.price <= priceMax)
            .sort((a, b) => {
                switch (sortOrder) {
                    case 'price-asc':
                        return a.price - b.price;
                    case 'price-desc':
                        return b.price - a.price;
                    case 'name-asc':
                        return a.name.localeCompare(b.name);
                    default:
                        return 0;
                }
            });
    }, [selectedCategories, selectedBrand, priceMin, priceMax, sortOrder]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl flex-grow">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">Browse Components</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filter Sidebar */}
                <aside className="w-full lg:w-1/4 space-y-6">
                    <Card className="bg-zinc-900 border-zinc-800 sticky top-24">
                        <CardContent className="p-5 space-y-6">
                            {/* Category Filter */}
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                                    Category
                                </h3>
                                <div className="space-y-2">
                                    {allCategories.map((cat) => (
                                        <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.has(cat)}
                                                onChange={() => toggleCategory(cat)}
                                                className="rounded border-zinc-600 bg-zinc-800 text-zinc-300 focus:ring-zinc-600 w-4 h-4"
                                            />
                                            <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                                {cat}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Brand Filter */}
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                                    Brand
                                </h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="brand"
                                            checked={selectedBrand === 'all'}
                                            onChange={() => setSelectedBrand('all')}
                                            className="border-zinc-600 bg-zinc-800 text-zinc-300 focus:ring-zinc-600 w-4 h-4"
                                        />
                                        <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                            All Brands
                                        </span>
                                    </label>
                                    {allBrands.map((brand) => (
                                        <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="brand"
                                                checked={selectedBrand === brand}
                                                onChange={() => setSelectedBrand(brand)}
                                                className="border-zinc-600 bg-zinc-800 text-zinc-300 focus:ring-zinc-600 w-4 h-4"
                                            />
                                            <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                                {brand}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                                    Price Range
                                </h3>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={priceMin}
                                        onChange={(e) => setPriceMin(Number(e.target.value))}
                                        placeholder="Min"
                                        className="w-full h-9 px-2 text-sm bg-zinc-950 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:border-zinc-500"
                                    />
                                    <span className="text-zinc-500 text-sm">—</span>
                                    <input
                                        type="number"
                                        value={priceMax}
                                        onChange={(e) => setPriceMax(Number(e.target.value))}
                                        placeholder="Max"
                                        className="w-full h-9 px-2 text-sm bg-zinc-950 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:border-zinc-500"
                                    />
                                </div>
                            </div>

                            {/* Sort */}
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                                    Sort By
                                </h3>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                                    className="w-full h-9 px-2 text-sm bg-zinc-950 border border-zinc-700 rounded-md text-zinc-200 focus:outline-none focus:border-zinc-500"
                                >
                                    <option value="price-asc">Price: Low → High</option>
                                    <option value="price-desc">Price: High → Low</option>
                                    <option value="name-asc">Name: A → Z</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>
                </aside>

                {/* Component Grid */}
                <main className="w-full lg:w-3/4">
                    <p className="text-sm text-zinc-500 mb-4">
                        Showing {filteredComponents.length} of {allComponents.length} components
                    </p>

                    {filteredComponents.length === 0 ? (
                        <div className="flex items-center justify-center h-64 border border-dashed border-zinc-800 rounded-xl">
                            <p className="text-zinc-500">No components match your filters.</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredComponents.map((item) => (
                                <Card
                                    key={`${item.category}-${item.name}`}
                                    className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col"
                                >
                                    <CardContent className="p-5 flex flex-col flex-grow">
                                        <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">
                                            {item.category}
                                        </span>
                                        <h3 className="text-base font-semibold text-zinc-100 mb-1 flex-grow">
                                            {item.name}
                                        </h3>
                                        <p className="text-lg font-bold font-mono text-zinc-300 mb-4">
                                            ₹{item.price.toLocaleString('en-IN')}
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={`w-full border-zinc-700 ${isInCart(item.name) ? 'bg-emerald-950/30 border-emerald-800 text-emerald-400' : 'hover:bg-zinc-800 text-zinc-300'}`}
                                            onClick={() => addItem({ name: item.name, price: item.price, category: item.category })}
                                        >
                                            {isInCart(item.name) ? (
                                                <><Check className="w-4 h-4 mr-2" />In Cart ✓</>
                                            ) : (
                                                <><ShoppingCart className="w-4 h-4 mr-2" />Add to Cart</>
                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
