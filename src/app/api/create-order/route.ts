import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(request: Request) {
    try {
        const { amount, currency = 'INR', receipt, notes } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        const order = await razorpay.orders.create({
            amount: amount * 100, // Razorpay expects paise
            currency,
            receipt: receipt || `order_${Date.now()}`,
            notes: notes || {},
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
    }
}
