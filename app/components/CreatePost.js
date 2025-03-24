"use client"
import { useState } from "react";
import { useContext } from "react";
import { Context } from "../context/UserContext";
import { toast } from "react-toastify";

const CreatePost = ({ userId }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isMembersOnly, setIsMembersOnly] = useState(false);
    const { setPosts } = useContext(Context);

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            alert("Title and content cannot be empty!");
            return;
        }
        const res = await fetch("/api/posts/" + userId, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content, userId, membersOnly: isMembersOnly }),
        });
        const data = await res.json();
        setPosts(data)
        setTitle("");
        setContent("");
        toast("Post created successfully.")
    };

    return (
        <div className="bg-slate-900 w-[95vw] min-[700px]:w-2xl mt-12 text-white p-6 rounded-lg shadow-lg mx-auto">
            <h2 className="text-2xl font-semibold text-gold-500 mb-4">Create a New Post</h2>

            {/* Title Input */}
            <input
                type="text"
                placeholder="Enter title..."
                className="w-full p-3 bg-gray-950 placeholder-gray-300 text-white border border-gray-600 rounded-md focus:outline-none focus:border-[#ffc738] mb-4"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            {/* Content Textarea */}
            <textarea
                rows="4"
                placeholder="Write something inspiring..."
                className="w-full p-3 bg-gray-950 placeholder-gray-300 text-white border border-gray-600 rounded-md focus:outline-none focus:border-[#ffc738] mb-4"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            {/* Members Only Checkbox */}
            <div className="flex items-center gap-2 mb-4">
                <input
                    type="checkbox"
                    id="membersOnly"
                    className="w-5 h-5 accent-[#ffc738] cursor-pointer"
                    checked={isMembersOnly}
                    onChange={(e) => setIsMembersOnly(e.target.checked)}
                />
                <label htmlFor="membersOnly" className="text-gray-300 text-sm cursor-pointer">
                    Members Only
                </label>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                className="w-full bg-[#ffc738] hover:bg-[#e6a300] text-black text-[17px] font-semibold py-2 rounded-md transition duration-200 cursor-pointer"
            >
                Publish Post
            </button>
        </div>
    );
};

export default CreatePost;
