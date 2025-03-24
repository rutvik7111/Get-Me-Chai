import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    name: String,
    orderId: String,
    amount: Number,
    message: String,
    from_user: String,
    to_user: String,
    success: { type: Boolean, default: false }
}, { timestamps: true });

const Payments = mongoose.models.Payments || mongoose.model("Payments", PaymentSchema);
export default Payments;