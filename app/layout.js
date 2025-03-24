import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./components/SessionWrapper";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Script from "next/script";
import ContextProvider from "./context/UserContext";
import { ToastContainer } from 'react-toastify';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Get me A Chai - Fund your projects with chai",
  description: "This website is a crowdfunding platform for creators.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-gray-100 flex flex-col`}
      >
        <SessionWrapper>
          <ContextProvider>
            <Navbar />
            {children}
            <Footer />
            <ToastContainer position="bottom-right" />
            <Script src="https://cdn.lordicon.com/lordicon.js"></Script>
          </ContextProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
