import { NextResponse } from "next/server";
import Payments from "@/app/lib/models/Payments";

export async function POST(request) {
    const formData = await request.formData(); // ✅ Get form data instead of JSON

    const razorpay_order_id = formData.get("razorpay_order_id");

    const searchParams = request.nextUrl.searchParams; // Get query params object
    const userid = searchParams.get("userid"); // Extract userid
    const username = searchParams.get("username"); // Extract userid

    const payment = await Payments.findOneAndUpdate({ orderId: razorpay_order_id }, { success: true }, { new: true })

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/api/successfulPayment?userid=${userid}&username=${username}`)
}