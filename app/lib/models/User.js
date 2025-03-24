import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    razorpayId: String,
    profilePhoto: String,
    coverPhoto: String,
    userId: String,
    subscriptions: { type: [String], default: [] }
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;