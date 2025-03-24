import { NextResponse } from "next/server"
import mongoose from "mongoose"
import Post from "@/app/lib/models/Posts"

mongoose.connect("mongodb://localhost:27017/getmechai")

export async function POST(request, { params }) {
    const { post_id } = await params
    const { comment, name, profilePhoto, userId } = await request.json(); // Parse JSON data from request body

    let comment_ = await Post.findOneAndUpdate({ _id: post_id }, { $push: { comments: { comment, profilePhoto, name } } }, { new: true })
    let posts = await Post.find({ userId })

    return NextResponse.json(posts)
}

export async function DELETE(request, { params }) {
    const { post_id } = await params
    const { commentId, userId } = await request.json(); // Parse JSON data from request body

    const comment = await Post.findOneAndUpdate(
        { _id: post_id },
        { $pull: { comments: { _id: commentId } } },
        { new: true } // Returns the updated document
    );

    let posts = await Post.find({ userId })
    return NextResponse.json(posts)
}