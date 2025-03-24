"use client"
import React from 'react'
import { useSession, signIn } from "next-auth/react"
import { useRouter } from 'next/navigation';

const HeroSection = () => {
    const { data: session } = useSession()
    const router = useRouter();

    return (
        <header className="relative h-[85vh] sm:h-screen text-center text-white bg-gradient-to-r from-gray-950 to-gray-800">
            <div className="w-full h-full absolute opacity-60">
                <video className="w-full h-full object-cover" src="/video.mp4" autoPlay loop muted></video>
            </div>
            <div className="bg-[#000000b0] w-[95%] md:w-[82%] lg:w-[80%] xl:w-[930px] border border-gray-500 py-8 sm:py-12 px-2 sm:px-4 lg:px-8 rounded-xl absolute top-[56%] sm:top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold relative leading-tight">
                    Support <span className="text-[#ffb400]">Creators</span>, Unlock <span className="text-[#ffb400]">Exclusive</span> Content
                </h2>
                <p className="mt-5 px-4 hidden min-[326px]:block text-[16px] sm:text-lg relative max-w-2xl mx-auto text-gray-300">
                    Subscribe to your favorite creators, fuel their creativity, and enjoy premium, members-only content.
                </p>
                {
                    !session
                        ? <button onClick={() => signIn()} className="mt-6 bg-[#ffb400] hover:bg-[#e6a300] text-gray-900 font-semibold drop-shadow-md px-6 py-3 rounded-lg text-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer">
                            Sign in to Explore
                        </button>
                        : <button onClick={() => router.push("/user/" + `${session.user.id}`)} className="mt-6 bg-[#ffb400] hover:bg-[#e6a300] text-gray-900 font-semibold drop-shadow-md px-6 py-3 rounded-lg text-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer">
                            Get Started
                        </button>
                }
            </div>
        </header>

    )
}

export default HeroSection
