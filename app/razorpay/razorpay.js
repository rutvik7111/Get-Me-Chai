"use server"
import Razorpay from "razorpay"
import Payments from "../lib/models/Payments"
import RazorpaySecret from "../lib/models/RazorpaySecret"
import mongoose from "mongoose"

export default async function createOrder(amount, fromUser, toUser, message) {
    await mongoose.connect(process.env.MONGODB_URI)
    const secret = await RazorpaySecret.findOne({ userId: toUser.userId })

    try {
        var instance = new Razorpay({ key_id: toUser.razorpayId, key_secret: secret.razorpaySecret })

        const order = await instance.orders.create({
            amount: `${amount}`,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                key1: "value3",
                key2: "value2"
            }
        })

        const payment = await Payments.create({
            orderId: order.id,
            amount: amount / 100,
            from_user: fromUser.id,
            to_user: toUser.userId,
            name: fromUser.name,
            message: message
        })
    } catch (error) {
        console.log(error);
    }

    return order;
}