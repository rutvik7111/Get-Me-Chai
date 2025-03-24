"use client"
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const successfulPayment = () => {
    const [count, setCount] = useState(5)
    const [timeoutID, setTimeoutID] = useState(null)
    const searchParams = useSearchParams()
    const router = useRouter()
    const userid = searchParams.get('userid')
    const username = searchParams.get('username')

    useEffect(() => {
        const id = setInterval(() => {
            setCount(prev => prev - 1)
        }, 1000);
        setTimeoutID(id)
        toast(`You donated to ${username} successfully`);
    }, [])

    useEffect(() => {
        count === 0 && clearTimeout(timeoutID)
        count === 0 && router.push(`/user/${userid}`)
    }, [count])

    return (
        <div className="h-screen flex flex-col items-center justify-center text-white">
            {/* Card Container */}
            <div className="relative bg-slate-900 p-10 rounded-2xl shadow-2xl text-center w-full max-w-lg border border-gray-700 transition-all transform scale-105 duration-300">

                {/* Glowing Checkmark */}
                <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 bg-green-500 blur-3xl opacity-30 rounded-full"></div>
                    <div className="w-24 h-24 flex items-center justify-center bg-green-600 rounded-full shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-14 h-14">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="text-4xl font-bold mt-6 text-green-400 drop-shadow-lg">Payment Successful! 🎉</h1>

                {/* Description */}
                <p className="text-lg text-gray-300 mt-3">
                    Your generous donation has been received!
                    Every contribution makes a difference. 💖
                </p>

                {/* Countdown Timer */}
                <div className="mt-4 text-lg font-semibold animate-pulse text-gray-400">
                    Redirecting in <span className="text-white font-bold">{count}</span> seconds...
                </div>

                {/* Profile Button */}
                <button
                    onClick={() => router.push(`/user/${userid}`)}
                    className="mt-6 px-6 py-3 bg-green-700 text-white rounded-lg text-lg font-semibold hover:bg-green-600 transition shadow-lg"
                >
                    Go to Profile
                </button>
            </div>
        </div>
    )
}

export default successfulPayment
