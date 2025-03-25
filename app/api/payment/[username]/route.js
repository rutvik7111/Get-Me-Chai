import { NextResponse } from "next/server"
import mongoose from "mongoose"
import Payments from "@/app/lib/models/Payments"

await mongoose.connect(process.env.MONGODB_URI)

export async function GET(request, { params }) {
    const { username } = await params
    const payments = await Payments.find({ to_user: username, success: true })
    if (!payments) {
        return NextResponse.json([])
    }
    return NextResponse.json(payments)
}