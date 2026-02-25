import pcComponentsData from '@/data/pc-components.json';
import { CartBuild, CartItem } from '@/context/CartContext';

type StoreLink = { store: string; url: string };

export type CheckoutItem = {
    name: string;
    category: string;
    price: number;
    purchaseLinks: StoreLink[];
};

export function getCheckoutItems(
    builds: CartBuild[],
    items: CartItem[]
): CheckoutItem[] {
    const seen = new Set<string>();
    const result: CheckoutItem[] = [];

    // Collect from builds
    for (const build of builds) {
        for (const comp of build.components) {
            if (seen.has(comp.name)) continue;
            seen.add(comp.name);

            const links = findPurchaseLinks(comp.name, comp.category);
            result.push({
                name: comp.name,
                category: comp.category,
                price: comp.price,
                purchaseLinks: links,
            });
        }
    }

    // Collect from individual items
    for (const item of items) {
        if (seen.has(item.name)) continue;
        seen.add(item.name);

        const links = findPurchaseLinks(item.name, item.category);
        result.push({
            name: item.name,
            category: item.category,
            price: item.price,
            purchaseLinks: links,
        });
    }

    return result;
}

function findPurchaseLinks(name: string, category: string): StoreLink[] {
    const categories = pcComponentsData.categories as Record<string, { name: string; purchaseLinks: StoreLink[] }[]>;
    const categoryItems = categories[category];
    if (!categoryItems) return [];

    const found = categoryItems.find((item) => item.name === name);
    return found?.purchaseLinks || [];
}
