import mongoose from "mongoose";

const RazorpaySecretSchema = new mongoose.Schema({
    razorpaySecret: String,
    userId: String
});

const RazorpaySecret = mongoose.models.RazorpaySecret || mongoose.model("RazorpaySecret", RazorpaySecretSchema);
export default RazorpaySecret;