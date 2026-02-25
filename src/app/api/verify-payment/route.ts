import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = await request.json();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json({ verified: false, error: 'Missing payment details' }, { status: 400 });
        }

        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(body)
            .digest('hex');

        const isValid = expectedSignature === razorpay_signature;

        if (isValid) {
            return NextResponse.json({
                verified: true,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
            });
        } else {
            return NextResponse.json(
                { verified: false, error: 'Invalid signature' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error verifying Payment:', error);
        return NextResponse.json({ verified: false, error: 'Verification failed' }, { status: 500 });
    }
}
