import React from 'react'
import { FiAlertTriangle } from "react-icons/fi";

const notfound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[700px] bg-slate-800 text-white">
            <FiAlertTriangle className='absolute opacity-10 animate-ping text-[200px] text-[#ffc738] z-[0]' />
            <div className='flex flex-col items-center justify-center relative'>
                <div className='flex gap-1 animate-bounce text-[#ffc738] text-6xl font-bold'>
                    <FiAlertTriangle />
                    <h1>404</h1>
                </div>
                <p className="text-xl mt-4 text-gray-300">Oops! The page you are looking for does not exist.</p>
                <p className="text-md text-gray-400 mt-2">It might have been removed or is temporarily unavailable.</p>
                <a
                    href="/"
                    className="mt-6 px-6 py-3 bg-[#ffb400] hover:bg-[#e6a300] text-gray-900 rounded-lg text-lg font-semibold transition-transform transform hover:scale-105"
                >
                    Go Home
                </a>
            </div>
        </div>
    )
}

export default notfound
