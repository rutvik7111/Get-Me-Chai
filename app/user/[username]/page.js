"use client"
import React, { useEffect, useContext, useState, use } from "react";
import { Context } from "@/app/context/UserContext";
import { FaHeart, FaComment, FaShare, FaRegBell, FaTrash, FaEdit, FaSave, FaRegCommentDots } from "react-icons/fa";
import { RiMoneyRupeeCircleFill, RiVipCrownFill } from "react-icons/ri";
import { MdSend } from "react-icons/md";
import Image from "next/image";
import CreatePost from "@/app/components/CreatePost";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { notFound } from "next/navigation";
import createOrder from "@/app/razorpay/razorpay";
import TopDonators from "@/app/components/TopDonators";
import { toast } from "react-toastify";

export default function ProfilePage({ params }) {
    const { user, setUser, isUserProfile, setIsUserProfile, userSubs, setUserSubs, posts, setPosts, handleSubscription } = useContext(Context);
    const [filteredPosts, setFilteredPosts] = useState([])
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [secretData, setSecretData] = useState("");
    const [defaultSecretData, setDefaultSecretData] = useState("razorpay secret is not ready")
    const [paymentFormData, setPaymentFormData] = useState({ amount: "", message: "" });
    const [editPost, setEditPost] = useState(false);
    const [loading, setloading] = useState(true)
    const { username } = use(params)
    const { data: session, status } = useSession()
    const [updatedTitle, setUpdatedTitle] = useState("")
    const [updatedContent, setUpdatedContent] = useState("")
    const [editPostId, setEditPostId] = useState(null)
    const [totalDonation, setTotalDonation] = useState(0)
    const [newComments, setNewComments] = useState({});
    const [showReplies, setShowReplies] = useState({});
    const [showCommentSection, setShowCommentSection] = useState({})
    const [showLoginText, setShowLoginText] = useState(false)

    useEffect(() => {
        (async function () {
            if (status !== "loading") {
                const res = await fetch("/api/user/" + username);
                const user = await res.json();

                const res1 = await fetch("/api/posts/" + username);
                const posts_ = await res1.json();

                const res2 = await fetch(`/api/payment/${username}`)
                const data = await res2.json()
                setTotalDonation(data.reduce((a, b) => a + b.amount, 0))

                if (!user.error) {
                    setUser(user)
                    setFormData(user)
                    setPosts(posts_)
                    if (status === "authenticated" && user.userId == session?.user.id) {
                        setIsUserProfile(true);
                    } else if (status !== "loading") {
                        setIsUserProfile(false);
                    }
                } else {
                    setUser(user)
                }
                setloading(false)
            }
        })();
    }, [status])

    useEffect(() => {
        (async function () {
            if (isUserProfile) {
                const res3 = await fetch(`/api/secret/${username}`)
                const { secret: secret_ } = await res3.json()
                setSecretData(secret_)
                setDefaultSecretData(secret_)
            }
        })();
    }, [isUserProfile])

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    // manage members-only posts
    useEffect(() => {
        if (status !== "loading" && posts) {
            if (status === "unauthenticated") {
                setFilteredPosts(posts.filter(post => !post.membersOnly))
            } else if (userSubs) {
                isUserProfile === true && setFilteredPosts(posts)
                if (isUserProfile === false) {
                    if (!userSubs.includes(user.userId)) {
                        setFilteredPosts(posts.filter(post => !post.membersOnly))
                    } else {
                        setFilteredPosts(posts)
                    }
                }
            }
        }
    }, [status, isUserProfile, userSubs, posts])

    const handleEditClick = () => {
        setEditMode(!editMode);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCommentChange = (e) => {
        setNewComments({ ...newComments, [e.target.name]: e.target.value });
    }

    const handlePaymentDataChange = (e) => {
        setPaymentFormData({ ...paymentFormData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        // Update the user state
        setUser(formData);
        setEditMode(false);

        // Optionally, update the backend
        const res = await fetch("/api/user/" + username, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        const data = await res.json()

        const res1 = await fetch("/api/secret/" + username, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(secretData)
        });
        const data1 = await res1.json()

        toast("Profile updated.")
    };

    const handleDelete = async (postId) => {
        const confirmDelete = confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;
        const res = await fetch(`/api/posts/${session.user.id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId }),
        });
        const posts_ = await res.json();
        setPosts(posts_);
        toast("Post deleted successfully.")
    };

    const handlePostEdit = (post) => {
        setEditPost(!editPost)
        setEditPostId(post._id)
        setUpdatedTitle(post.title)
        setUpdatedContent(post.content)
    }

    const handleSavePost = async (post) => {
        const res = await fetch(`/api/posts/${session.user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...post, title: updatedTitle, content: updatedContent }),
        });
        const posts_ = await res.json();
        setPosts(posts_);
        setEditPost(false)
        toast("Post edited successfully.")
    }

    const handleCancel = () => {
        setEditMode(false)
        setFormData(user)
        setSecretData(defaultSecretData)
    }

    const handlePaymentButton = async (e) => {
        const order = await createOrder(paymentFormData.amount * 100, session.user, user, paymentFormData.message);
        if (order) {
            var options = {
                "key": user.razorpayId, // Enter the Key ID generated from the Dashboard
                "name": "Give Me Chai", //your business name
                "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                "callback_url": `/api/checkPayment?userid=${user.userId}&username=${user.name}`,
                "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                    "name": "Gaurav Kumar", //your customer's name
                    "email": "gaurav.kumar@example.com",
                    "contact": "9000090000" //Provide the customer's phone number for better conversion rates 
                },
                "theme": {
                    "color": "#3399cc"
                }
            };
            try {
                var rzp1 = new Razorpay(options);
                rzp1.open();
                e.preventDefault();
            } catch (error) {
                console.log("user page tryCatch error is", error);

            }
        } else {
            console.log("error came from razorpay.js");
        }
    }

    const handleDeleteComment = async (postId, commentId) => {
        const confirmDelete = confirm("Are you sure you want to delete this comment?");
        if (!confirmDelete) return;
        const res = await fetch(`/api/comments/${postId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ commentId, userId: user.userId }),
        });
        const posts_ = await res.json();
        setPosts(posts_);
        toast("Comment deleted successfully.")
    }

    const toggleCommentSection = (postId) => {
        setShowCommentSection(prev => {
            const x = prev[postId]
            return { ...prev, [postId]: !x }
        })
    }

    const toggleReplies = async (postId, value = "ignore") => {
        if (value !== "ignore") {
            setShowReplies({ ...showReplies, [postId]: value })
            return;
        }
        setShowReplies(prev => {
            const x = prev[postId]
            return { ...prev, [postId]: !x }
        });
    };

    const addComment = async (postId) => {
        if (!newComments[postId].trim()) return;
        const res = await fetch(`/api/comments/${postId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comment: newComments[postId], name: session.user.pageName, profilePhoto: session.user.profilePhoto, userId: user.userId }),
        });
        const data = await res.json();
        setNewComments({ ...newComments, [postId]: "" }); // Reset input
        setPosts(data)
        toggleReplies(postId, true)
    };

    if (user?.error) {
        return notFound()
    }

    return (
        <div className="min-h-screen bg-gray-800 text-white pb-15 overflow-hidden">
            {
                // Loading Spinner
                loading ? <div className="bg-slate-800 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-16 h-16 border-4 border-gold border-t-orange-500 rounded-full"
                    ></motion.div>
                </div> :
                    <>
                        {/* Cover Photo */}
                        < div className="relative max-h-[40vh] md:max-h-[45vh] -left-1/4 md:left-0 w-3/2 md:w-full overflow-hidden flex items-center justify-center">
                            <Image
                                src={user.coverPhoto || "/default-cover.jpg"}
                                alt="Cover" width={500}
                                height={500}
                                className="w-full object-contain opacity-100"
                                unoptimized
                            />
                        </div>

                        {/* Profile Section */}
                        <div className="w-[95%] sm:w-[85%] lg:w-4xl mx-auto -mt-3.5 md:-mt-5 lg:-mt-15 relative z-10 bg-[#000000b0] p-3.5 sm:p-8 rounded-xl shadow-lg border border-gray-700 backdrop-blur-md">
                            <div className="flex flex-col justify-between gap-4">
                                <div className="flex items-center gap-4.5">
                                    {/* Profile Picture */}
                                    <div className="min-w-20 sm:min-w-28 min-h-20 sm:min-h-28 aspect-square rounded-full border-4 border-[#ffc738] shadow-lg overflow-hidden relative">
                                        <Image fill src={user.profilePhoto || "/default-profile.jpg"} alt="Profile" className="w-full h-full object-cover" unoptimized />
                                    </div>

                                    {/* User Info */}
                                    <div className="flex flex-col gap-2 w-full">
                                        {editMode ? (
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="bg-gray-700 p-2 rounded-md outline-none text-white w-full md:w-1/2"
                                            />
                                        ) : (
                                            <h1 className="text-2xl sm:text-3xl font-extrabold line-clamp-2">{user.name}</h1>
                                        )}
                                        {editMode ? (
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className="bg-gray-700 p-2 rounded-md outline-none text-white w-full md:w-1/2"
                                            />
                                        ) : (
                                            <p className="text-gray-300">@{user.username}</p>
                                        )}
                                    </div>
                                </div>

                                {
                                    editMode &&
                                    <>
                                        <label className="flex items-center gap-4" htmlFor="profilePhoto">
                                            <span className="text-gray-400">Profile photo</span>
                                            <input onChange={handleChange} className="bg-gray-700 px-2.5 py-1 flex-1 w-full rounded-lg" type="text" name="profilePhoto" id="profilePhoto" value={formData.profilePhoto} placeholder="Profile photo URL" />
                                        </label>
                                        <label className="flex items-center gap-4" htmlFor="coverPhoto">
                                            <span className="text-gray-400">Cover photo</span>
                                            <input onChange={handleChange} className="bg-gray-700 px-2.5 py-1 flex-1 w-full rounded-lg" type="text" name="coverPhoto" id="coverPhoto" value={formData.coverPhoto} placeholder="Cover photo URL" />
                                        </label>
                                    </>
                                }
                            </div>

                            {/* User Details */}
                            <div className="mt-6 space-y-4">
                                <div className={"flex justify-between items-center border-b border-gray-700 pb-2 gap-2"}>
                                    <span className="text-gray-400">Email:</span>
                                    {editMode ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="bg-gray-700 p-2 rounded-md outline-none text-white w-1/2"
                                        />
                                    ) : (
                                        <span className="font-medium truncate">{user.email}</span>
                                    )}
                                </div>

                                {
                                    isUserProfile &&
                                    <>
                                        <div className="flex justify-between items-center border-b border-gray-700 pb-2 gap-2">
                                            <span className="text-gray-400">Razorpay ID:</span>
                                            {editMode ? (
                                                <input
                                                    type="text"
                                                    name="razorpayId"
                                                    value={formData.razorpayId}
                                                    onChange={handleChange}
                                                    className="bg-gray-700 p-2 rounded-md outline-none text-white w-1/2"
                                                />
                                            ) : (
                                                <span className="font-medium truncate">{user.razorpayId || "Not Set"}</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-700 pb-2 gap-2">
                                            <span className="text-gray-400">Razorpay Secret:</span>
                                            {editMode ? (
                                                <input
                                                    type="password"
                                                    name="secret"
                                                    value={secretData}
                                                    onChange={(e) => setSecretData(e.target.value)}
                                                    className="bg-gray-700 p-2 rounded-md outline-none text-white w-1/2"
                                                />
                                            ) : (
                                                <span className="font-medium truncate">{secretData ? '***************' : "Not set"}</span>
                                            )}
                                        </div>
                                    </>
                                }

                                <div className="flex justify-between items-center border-b border-gray-700 pb-2 gap-2">
                                    <span className="text-gray-400">Posts:</span>
                                    <span className="font-medium truncate">{posts.length}</span>
                                </div>

                                <div className="flex justify-between items-center border-b border-gray-700 pb-2 gap-2">
                                    <span className="text-gray-400">Total money raised:</span>
                                    <span className="font-medium truncate">
                                        <span className="mr-0.5">₹</span>
                                        {totalDonation}</span>
                                </div>

                                {
                                    (!isUserProfile && !userSubs?.includes(user.userId)) &&
                                    <button onClick={e => handleSubscription(e, user.userId, user.name)} className="subscribeButton">
                                        <FaRegBell className="w-6 h-6" />
                                        {!session ? "Login to subscribe" : 'Subscribe Now'}
                                    </button>
                                }

                                {
                                    userSubs?.includes(user.userId) &&
                                    <button onClick={() => {
                                        setUserSubs(prev => prev.filter(val => val !== user.userId));
                                        toast(`Unsubscribed to ${user.name}.`)
                                    }} className="subscribedButton">
                                        <FaRegBell className="w-6 h-6" />
                                        Subscribed
                                    </button >
                                }

                            </div>

                            <div className="flex flex-col items-center mt-6 justify-center gap-5">
                                {/* Edit Profile Button */}
                                {
                                    isUserProfile &&
                                    <div className="flex justify-center">
                                        {editMode ? (
                                            <div className="flex gap-2">
                                                <button onClick={handleSave} className="customButton flex items-center gap-1">
                                                    <FaSave />
                                                    <span>Save</span>
                                                </button>
                                                <button onClick={handleCancel} className="customButton flex items-center gap-1">
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <button onClick={handleEditClick} className="customButton flex items-center gap-1" disabled={defaultSecretData === "razorpay secret is not ready"}>
                                                <FaEdit />
                                                <span>Edit Profile</span>
                                            </button>
                                        )}
                                    </div>
                                }

                                {
                                    session &&
                                    <div className="flex flex-col md:flex-row justify-center items-center gap-2 w-full">
                                        <input className="bg-white rounded-lg p-1.5 pl-2 text-black w-34" type="number" name="amount" id="amount" value={paymentFormData.amount} onChange={handlePaymentDataChange} placeholder="Enter amount" />

                                        <input className="bg-white rounded-lg p-1.5 pl-2 text-black w-[95%] sm:w-96" type="text" name="message" id="message" value={paymentFormData.message} onChange={handlePaymentDataChange} placeholder="Enter message" />

                                        <button className="customButton flex items-center gap-1" id="rzp-button1" onClick={handlePaymentButton} disabled={paymentFormData.amount <= 0 || paymentFormData.message.length < 5}>
                                            <RiMoneyRupeeCircleFill className="text-xl" />
                                            <span className="">Pay</span>
                                        </button>
                                    </div>
                                }
                            </div>

                            {
                                session &&
                                <TopDonators userId={user.userId} />
                            }
                        </div>

                        {/* Create Post */}
                        {
                            isUserProfile &&
                            <CreatePost userId={session.user.id} />
                        }
                        {/* User's Posts Section */}
                        <div className="max-w-3xl mx-auto mt-12 px-4">
                            <h2 className="text-2xl font-bold border-b-2 border-[#ffc738] pb-2">
                                Posts by {user.name}
                            </h2>

                            {filteredPosts.length > 0 ? (
                                <div className="grid gap-6 mt-6">
                                    {filteredPosts.map((post) => (
                                        <div
                                            key={post._id}
                                            className="bg-[#1a1a1a] hover:bg-[#161616] p-3.5 sm:p-6 rounded-lg shadow-lg border border-gray-700 transition-all duration-300 cursor-pointer"
                                        >
                                            {/* User Info & Date */}
                                            <div className="flex flex-col gap-2 sm:flex-row justify-between items-start">
                                                <div className="flex items-center gap-4">
                                                    <Image
                                                        width={500}
                                                        height={500}
                                                        src={user.profilePhoto || "/default-profile.jpg"}
                                                        alt="Profile"
                                                        className="w-12 h-12 object-cover rounded-full border-2 border-[#ffc738]"
                                                        unoptimized
                                                    />
                                                    <div className="flex flex-col">
                                                        <h3 className="text-lg font-semibold">{user.name}</h3>
                                                        <p className="text-gray-400 text-sm">@{user.username} • {new Date(post.date).toLocaleString("en-IN")}</p>
                                                    </div>
                                                </div>
                                                <>
                                                    {post.membersOnly && (
                                                        <span className="flex items-center gap-1 px-2 py-0.5 bg-[#ffc738]/20 text-[#ffc738] text-sm font-medium rounded-md border border-[#ffc738]/50">
                                                            <RiVipCrownFill className="text-lg text-[#ffc738]" />
                                                            Members Only
                                                        </span>
                                                    )}
                                                </>
                                            </div>

                                            {/* Post Content */}
                                            <div className="mt-4 flex flex-col w-fit gap-3">
                                                {
                                                    (editPost && editPostId === post._id) ? (
                                                        <input
                                                            type="text"
                                                            name="postTitle"
                                                            defaultValue={post.title}
                                                            onChange={(e) => setUpdatedTitle(e.target.value)}
                                                            className="bg-gray-700 p-2 rounded-md outline-none text-white"
                                                        />
                                                    ) : (
                                                        <h3 className="text-xl font-bold">{post.title}</h3>
                                                    )}
                                                {
                                                    (editPost && editPostId === post._id) ? (
                                                        <textarea
                                                            type="text"
                                                            name="postContent"
                                                            defaultValue={post.content}
                                                            onChange={(e) => setUpdatedContent(e.target.value)}
                                                            className="bg-gray-700 p-2 rounded-md outline-none text-white"
                                                        />
                                                    ) : (
                                                        <p className="text-gray-300 mt-2">{post.content}</p>
                                                    )}
                                            </div>

                                            {/* Post Actions */}
                                            <div className="flex flex-col sm:flex-row justify-between gap-2.5 sm:gap-0 sm:items-center mt-6 sm:mt-4 text-gray-400">
                                                <div className="flex gap-3 min-[350px]:gap-6 *:cursor-pointer flex-wrap">
                                                    <button onClick={() => {
                                                        if (!session) {
                                                            setShowLoginText(true)
                                                        }
                                                    }} className="flex items-center gap-2 hover:text-[#ffc738] transition">
                                                        <FaHeart /> <span>Like</span>
                                                    </button>
                                                    <button onClick={() => {
                                                        toggleCommentSection(post._id)
                                                        if (!session) {
                                                            setShowLoginText(true)
                                                        }
                                                    }} className="flex items-center gap-2 hover:text-[#ffc738] transition">
                                                        <FaComment /> <span>Comment</span>
                                                    </button>
                                                    <button onClick={() => {
                                                        if (!session) {
                                                            setShowLoginText(true)
                                                        }
                                                    }} className="flex items-center gap-2 hover:text-[#ffc738] transition">
                                                        <FaShare /> <span>Share</span>
                                                    </button>
                                                </div>
                                                {
                                                    isUserProfile &&
                                                    <div className="flex bg-[#252525] gap-4 min-[350px]:gap-10 sm:gap-4 py-1.5 px-3.5 rounded-lg justify-center">
                                                        {/* Save Button */}
                                                        {
                                                            (isUserProfile && editPost && editPostId === post._id) &&
                                                            <button onClick={() => handleSavePost(post)} className="text-gray-400 hover:text-[#ffc738] transition cursor-pointer group flex items-center gap-1">
                                                                <span>
                                                                    <FaSave size={18} />
                                                                </span>
                                                                <span>Save post</span>
                                                            </button>
                                                        }

                                                        {/* Edit Button */}
                                                        {
                                                            (isUserProfile && !editPost) &&
                                                            <button onClick={() => handlePostEdit(post)} className="text-gray-400 hover:text-[#ffc738] transition cursor-pointer group flex items-center gap-1">
                                                                <span>
                                                                    <FaEdit size={18} />
                                                                </span>
                                                                <span>Edit post</span>
                                                            </button>
                                                        }

                                                        {/* Delete Button */}
                                                        {
                                                            (isUserProfile && !editPost) &&
                                                            <button onClick={() => handleDelete(post._id)} className="text-gray-400 hover:text-red-500 transition cursor-pointer group flex items-center gap-1">
                                                                <span>
                                                                    <FaTrash size={18} />
                                                                </span>
                                                                <span>Delete post</span>
                                                            </button>
                                                        }
                                                    </div>
                                                }
                                            </div>
                                            {
                                                (!session && showLoginText) &&
                                                <div className="mt-2 text-lg font-semibold">Please login to like, comment or share.</div>
                                            }
                                            <div className="mt-1.5 rounded-lg">
                                                {/* Comment Input Box */}
                                                {
                                                    (session && showCommentSection[post._id]) &&
                                                    < div className="flex items-center gap-2 border mt-3.5 border-gray-700 p-3 rounded-lg bg-[#0d0d0d]">
                                                        <input
                                                            type="text"
                                                            placeholder="Write a comment..."
                                                            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
                                                            name={post._id}
                                                            value={newComments[post._id] || ""}
                                                            onChange={handleCommentChange}
                                                        />
                                                        <button
                                                            onClick={() => addComment(post._id)}
                                                            className="hover:text-yellow-400 transition cursor-pointer"
                                                        >
                                                            <MdSend size={22} />
                                                        </button>
                                                    </div>
                                                }

                                                {/* Show Replies Button */}
                                                {
                                                    post.comments.length !== 0 &&
                                                    <>
                                                        <button
                                                            onClick={() => toggleReplies(post._id)}
                                                            className="mt-3 text-sm text-[#ffc738] hover:underline flex items-center gap-1 cursor-pointer"
                                                        >
                                                            <FaRegCommentDots /> {showReplies[post._id] ? "Hide Replies" : "Show Replies"}
                                                        </button>

                                                        {/* Comment List */}
                                                        {showReplies[post._id] && (
                                                            <div className="mt-3 space-y-3">
                                                                {post.comments?.length === 0 ? (
                                                                    <p className="text-gray-400 text-sm">No comments yet.</p>
                                                                ) : (
                                                                    post.comments.map((comment, i) => (
                                                                        <div
                                                                            key={i}
                                                                            className="flex justify-between items-start gap-3 p-4 bg-[#0d0d0d] rounded-lg shadow-md border border-gray-700"
                                                                        >
                                                                            <div className="flex items-start gap-3">
                                                                                {/* Profile Picture */}
                                                                                <img
                                                                                    src={comment.profilePhoto}
                                                                                    alt="profile"
                                                                                    className="w-10 sm:w-12 rounded-full border border-gray-600"
                                                                                />

                                                                                {/* Comment Content */}
                                                                                <div className="flex-1">
                                                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                                                                        <span className="truncate max-w-30 min-[385px]:max-w-50 min-[485px]:max-w-70 sm:max-w-65 text-white font-semibold">{comment.name}</span>
                                                                                        <span className="text-sm text-gray-400">{new Date(comment.date).toLocaleString()}</span>
                                                                                    </div>
                                                                                    <p className="text-gray-300 mt-1">{comment.comment}</p>
                                                                                </div>
                                                                            </div>
                                                                            {/* Delete Button */}
                                                                            {
                                                                                (isUserProfile) &&
                                                                                <button onClick={() => handleDeleteComment(post._id, comment._id)} className="text-gray-400 hover:text-red-500 transition cursor-pointer group flex items-center gap-1">
                                                                                    <FaTrash size={18} />
                                                                                </button>
                                                                            }
                                                                        </div>
                                                                    ))
                                                                )}
                                                            </div>
                                                        )}
                                                    </>
                                                }
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 mt-6">No posts yet.</p>
                            )}
                        </div>
                    </>
            }
        </div >
    );
}
