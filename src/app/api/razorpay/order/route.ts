import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
    try {
        const { amount, bookingId } = await request.json();
        const razorpay = new Razorpay({
            key_id: process.env.RP_KEY_ID as string,
            key_secret: process.env.RP_KEY_SECRET as string,
        });

        const options = {
            amount: amount * 100, // Convert to paise
            currency: "INR",
            receipt: bookingId,
        };

        const order = await razorpay.orders.create(options);
        return NextResponse.json(order);
    } catch (err: unknown) {
        console.error("Razorpay order creation error:", err);
        return NextResponse.json({ error: (err as Error).message }, { status: 500 });
    }
}
