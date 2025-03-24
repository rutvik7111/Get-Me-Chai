import { NextResponse } from "next/server"
import mongoose from "mongoose"
import RazorpaySecret from "@/app/lib/models/RazorpaySecret"

mongoose.connect(process.env.MONGODB_URI)

export async function GET(request, { params }) {
    const { username } = await params
    const { razorpaySecret: secret } = await RazorpaySecret.findOne({ userId: username })
    if (secret === "") {
        return NextResponse.json({ secret })
    }
    const protectedSecret = { secret: "*************" + secret.slice(-4,) }
    return NextResponse.json(protectedSecret)
}

export async function PUT(request, { params }) {
    const { username } = await params
    const secret = await request.json(); // Parse JSON data from request body

    if (secret.includes("*")) {
        return NextResponse.json({})
    }

    let secret_ = await RazorpaySecret.findOneAndUpdate({ userId: username }, { razorpaySecret: secret }, { new: true })

    return NextResponse.json(secret_)
}