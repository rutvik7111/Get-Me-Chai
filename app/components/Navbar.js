"use client";
import React from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import Image from 'next/image';
import { PiSignOutBold, PiSignInBold } from "react-icons/pi";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const Navbar = () => {
    const { data: session, status } = useSession()
    const pathName = usePathname();
    const router = useRouter();

    if (status !== "loading") {
        return (
            <nav className={`bg-[#000000b0] text-white py-4 px-2 sm:p-4 pr-3 flex justify-between items-center ${pathName.startsWith("/user") ? "sticky" : "fixed"} w-full top-0 z-50 text-nowrap backdrop-blur-md`}>
                <Link href="/">
                    <div className='flex items-center sm:gap-1 relative'>
                        <lord-icon
                            className="aboslute top-0 w-[55px] h-[55px] sm:w-[70px] sm:h-[70px]"
                            src="https://cdn.lordicon.com/tonguyuk.json"
                            trigger="loop"
                            delay="2000"
                            colors="primary:#ffffff,secondary:#ffc738,tertiary:#f24c00">
                        </lord-icon>
                        <h1 className="text-4xl font-bold hidden lg:flex">GetMe<span className='text-[#ffc738] animate-pulse1 inline-block'>Chai</span></h1>
                        <h1 className="text-3xl sm:text-4xl font-bold flex lg:hidden">GM<span className='text-[#ffc738] animate-pulse1 inline-block'>C</span></h1>
                        <span className='ml-7 text-[22px] font-bold hidden xl:inline'>Fuel Creators, One ☕ at a Time!</span>
                    </div>
                </Link>
                <div>
                    {
                        session &&
                        <div className='flex items-center gap-2 sm:gap-5'>
                            <div className='gap-2 hidden min-[550px]:flex'>
                                <Image
                                    src={session.user.image}
                                    width={25}
                                    height={25}
                                    alt="Picture of the author"
                                />
                                <span className='truncate w-20 md:w-full'>{session.user.email}</span>
                            </div>
                            <button onClick={() => router.push("/user/" + `${session.user.id}`)} className='customButton'>
                                <span>Profile</span>
                            </button>
                            <button onClick={() => signOut()} className="flex items-center gap-1 customButton">
                                <PiSignOutBold size={23} />
                                <span className='hidden min-[395px]:inline'>Sign out</span>
                            </button>
                        </div>
                    }
                    {
                        !session &&
                        <button onClick={() => signIn()} className="flex items-center gap-1 customButton">
                            <PiSignInBold size={23} />
                            <span>Login</span>
                        </button>
                    }
                </div>
            </nav>
        )
    }
}

export default Navbar
