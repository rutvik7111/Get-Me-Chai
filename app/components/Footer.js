"use client"
import React from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation';

const Footer = () => {
    const { status } = useSession();
    const pathName = usePathname();

    if (status !== "loading") {
        return (
            <div className={`bg-slate-900 text-center p-5 text-[16px] sm:text-lg ${pathName.startsWith("/api") && "hidden"}`}>
                Copyright © 2025 Get Me Chai - All rights reserved!
            </div>
        )
    }
}

export default Footer
