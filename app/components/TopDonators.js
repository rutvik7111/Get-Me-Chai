import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import { Noto_Sans } from "next/font/google";
import { motion } from "framer-motion";

const notoSans = Noto_Sans({ subsets: ["latin", "devanagari"] });

const TopDonators = ({ userId }) => {
    const [allPayments, setAllPayments] = useState([])
    const { data: session, status } = useSession()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async function () {
            if (session) {
                const res = await fetch(`/api/payment/${userId}`)
                const data = await res.json()
                setAllPayments(data.sort((a, b) => b.amount - a.amount).slice(0, 10));
                setLoading(false)
            }
        })();
    }, [status])

    if (loading) {
        return (
            <div className='relative mt-20'>
                <div className="absolute pb-15 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-16 h-16 border-4 border-gold border-t-orange-500 rounded-full"
                    ></motion.div>
                </div>
            </div>
        )
    }

    return (
        <div className=''>
            {
                allPayments.length === 0 ? <div className='mt-5 text-xl animate-pulse text-center'>Be the first donator :)</div> :
                    <div className="bg-slate-800 text-white p-6 px-3 sm:px-6 rounded-2xl shadow-lg w-full mx-auto mt-14">
                        <h2 className="text-2xl font-bold text-center mb-5">
                            <span className='hidden min-[400px]:inline'>⭐</span> Top 10 Donators <span className='hidden min-[400px]:inline'>⭐</span>
                        </h2>
                        <ul className="space-y-3 relative">
                            {allPayments.map((payment, index) => (
                                <li
                                    key={payment.orderId}
                                    className="p-3 bg-gray-900 rounded-lg shadow-md hover:bg-[#0c111d] transition px-4 pl-10 cursor-pointer text-left *:break-words"
                                >
                                    <span className='absolute rounded-full left-3.5 font-semibold'>{index + 1}</span>
                                    <span className="font-semibold">{payment.name} </span>
                                    <span>says </span>
                                    <span className='italic font-semibold' title={`${payment.message}`}>"{payment.message}" </span>
                                    <span>and donated </span>
                                    <span className={"text-[#ffc738] font-semibold " + `${notoSans.className}`}>
                                        ₹{payment.amount.toLocaleString("en-IN")}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
            }
        </div>
    )
}

export default TopDonators
