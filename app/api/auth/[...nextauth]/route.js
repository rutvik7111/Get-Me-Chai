import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import mongoose from "mongoose";
import User from "@/app/lib/models/User";
import RazorpaySecret from "@/app/lib/models/RazorpaySecret";

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],
    callbacks: {
        async redirect({ baseUrl }) {
            return baseUrl; // Ensures redirection to the correct domain
        },
        async signIn({ user, account, profile, email, credentials }) {
            mongoose.connect("mongodb://localhost:27017/getmechai")
            let _user = await User.findOne({ userId: user.id })
            let _secret = await RazorpaySecret.findOne({ userId: user.id })
            if (!_user) {
                user = await User.create({
                    name: user.name,
                    username: user.email.split("@")[0],
                    email: user.email,
                    razorpayId: "",
                    profilePhoto: {},
                    coverPhoto: {},
                    userId: user.id,
                })
            }
            if (!_secret) {
                await RazorpaySecret.create({
                    razorpaySecret: "",
                    userId: user.id,
                })
            }
            return true
        },
        async jwt({ token, account, profile }) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            if (account) {
                token.accessToken = account.access_token
                token.id = profile.id
            }
            return token
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token and user id from a provider.
            session.accessToken = token.accessToken
            session.user.id = token.id

            if (session) {
                mongoose.connect("mongodb://localhost:27017/getmechai")
                let _user = await User.findOne({ userId: session.user.id })
                session.user.subscriptions = _user.subscriptions
                session.user.pageName = _user.name
                session.user.profilePhoto = _user.profilePhoto
            }

            return session
        }
    }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };