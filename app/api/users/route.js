import { NextResponse } from "next/server"
import mongoose from "mongoose"
import User from "@/app/lib/models/User"

mongoose.connect(process.env.MONGODB_URI)

export async function GET(request) {
    const users = await User.find()
    return NextResponse.json(users)
}