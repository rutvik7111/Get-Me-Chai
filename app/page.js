"use client"
import Creators from "./components/Creators";
import HeroSection from "./components/HeroSection";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function Home() {
  const { status } = useSession();

  if (status === "loading") {
    return <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-16 h-16 border-4 border-gold border-t-orange-500 rounded-full"
      ></motion.div>
    </div>
  }

  return (
    <div>
      <HeroSection />
      <Creators />
    </div>
  );
}