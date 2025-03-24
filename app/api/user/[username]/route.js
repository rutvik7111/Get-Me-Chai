import { NextResponse } from "next/server"
import mongoose from "mongoose"
import User from "@/app/lib/models/User"

mongoose.connect(process.env.MONGODB_URI)

export async function GET(request, { params }) {
    const { username } = await params

    let user = await User.findOne({ userId: username })

    if (!user) {
        return NextResponse.json({ error: 'Internal Server Error' })
    }

    return NextResponse.json(user)
}

export async function POST(request, { params }) {
    const { username } = await params
    const body = await request.json(); // Parse JSON data from request body

    let user = await User.findOneAndUpdate({ userId: username }, body, { new: true })

    return NextResponse.json(user)
}

export async function PUT(request, { params }) {
    const { username } = await params
    const body = await request.json(); // Parse JSON data from request body

    let user = await User.findOneAndUpdate({ userId: username }, body, { new: true })
    
    return NextResponse.json(user)
}
