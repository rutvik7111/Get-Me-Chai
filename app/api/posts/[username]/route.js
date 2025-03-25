import { NextResponse } from "next/server"
import mongoose from "mongoose"
import Post from "@/app/lib/models/Posts"

await mongoose.connect(process.env.MONGODB_URI)

export async function GET(request, { params }) {
    const { username } = await params

    let posts = await Post.find({ userId: username })

    if (!posts) {
        return NextResponse.json([])
    }

    return NextResponse.json(posts)
}

export async function POST(request, { params }) {
    const { username } = await params
    const body = await request.json(); // Parse JSON data from request body

    let post = await Post.create(body)
    let posts = await Post.find({ userId: username })

    return NextResponse.json(posts)
}

export async function PUT(request, { params }) {
    const { username } = await params
    const post = await request.json(); // Parse JSON data from request body

    let post_ = await Post.findOneAndUpdate({ _id: post._id }, { title: post.title, content: post.content })
    let posts = await Post.find({ userId: username })

    return NextResponse.json(posts)
}

export async function DELETE(request, { params }) {
    const { username } = await params
    const { postId } = await request.json(); // Parse JSON data from request body

    let post = await Post.findByIdAndDelete({ _id: postId })
    let posts = await Post.find({ userId: username })

    return NextResponse.json(posts)
}
