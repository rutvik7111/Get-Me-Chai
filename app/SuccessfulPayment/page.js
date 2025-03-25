// "use client"
import React from 'react'
import { Suspense } from 'react'
import Success from '../components/Success'

const page = () => {
    return (
        <Suspense>
            <Success />
        </Suspense>
    )
}

export default page

export const metadata = {
    title: "Success",
    description: "successful payment page.",
};