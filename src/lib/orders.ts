export type OrderItem = {
    name: string;
    category: string;
    price: number;
};

export type SavedOrder = {
    id: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'completed';
    createdAt: string;
};

const ORDERS_STORAGE_KEY = 'omegatech_orders';

export function getOrders(): SavedOrder[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (!stored) return [];
        return JSON.parse(stored);
    } catch (error) {
        console.error('Failed to parse saved orders:', error);
        return [];
    }
}

export function saveOrder(order: Omit<SavedOrder, 'createdAt'>): SavedOrder {
    const orders = getOrders();
    const newOrder: SavedOrder = {
        ...order,
        createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder); // Add to beginning (newest first)

    try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
        return newOrder;
    } catch (error) {
        console.error('Failed to save order:', error);
        return newOrder;
    }
}
