import React, { useContext } from "react";
import { Context } from "@/app/context/UserContext";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FaRegBell } from "react-icons/fa";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";

const Creators = () => {
    const { setUserSubs, userSubs, users, handleSubscription } = useContext(Context);
    const { data: session } = useSession()
    const router = useRouter();

    return (
        < section className="p-5 sm:p-12" >
            <h3 className="text-3xl font-semibold text-center mb-8 text-white">Featured Creators</h3>
            {
                users.length === 0 ? <div className="mt-11">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-16 h-16 border-4 border-gold border-t-orange-500 rounded-full relative left-1/2 -translate-x-1/2"
                    ></motion.div>
                </div> :
                    <>
                        <div className="grid grid-cols-[minmax(0,1060px)] xl:grid-cols-2 justify-center gap-8">
                            {users.map((creator) => (
                                <div key={creator.userId} className="bg-gray-900 hover:bg-gray-800 p-6 rounded-lg relative overflow-hidden cursor-pointer flex flex-col items-center" onClick={() => router.push("/user/" + `${creator.userId}`)}>
                                    <div className="h-65 w-full bg-gray-700 rounded-lg hidden min-[500px]:block">
                                        <Image
                                            src={creator.coverPhoto}
                                            alt="Cover" width={500}
                                            height={500}
                                            className="w-full h-full object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="aspect-square w-[235px] bg-gray-700 min-[500px]:hidden rounded-full overflow-hidden ring">
                                        <Image
                                            src={creator.profilePhoto}
                                            alt="Profile" width={500}
                                            height={500}
                                            className="w-full h-full object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <h4 className="mt-4 text-xl text-center min-[500px]:text-left font-semibold relative text-white">{creator.name}</h4>
                                    <p className="text-gray-400 relative hidden min-[500px]:block">Exclusive content for premium subscribers</p>
                                    {
                                        (session?.user.id != creator.userId && !userSubs?.includes(creator.userId)) &&
                                        <button onClick={(e) => handleSubscription(e, creator.userId, creator.name)} className="subscribeButton w-full flex justify-center">
                                            <FaRegBell className="w-6 h-6" />
                                            {!session ? "Login to subscribe" : 'Subscribe Now'}
                                        </button>
                                    }
                                    {
                                        (session?.user.id != creator.userId && userSubs?.includes(creator.userId)) &&
                                        <button onClick={(event) => {
                                            event.stopPropagation();
                                            setUserSubs(prev => prev.filter(val => val !== creator.userId))
                                            toast(`Unsubscribed to ${creator.name}.`)
                                        }} className="subscribedButton w-full flex justify-center">
                                            <FaRegBell className="w-6 h-6" />
                                            Subscribed
                                        </button >
                                    }
                                    {
                                        session?.user.id == creator.userId &&
                                        <button className="subscribeButton w-full flex justify-center">Go to profile</button>
                                    }
                                </div>
                            ))}
                        </div>
                    </>
            }
        </section >

    )
}

export default Creators
