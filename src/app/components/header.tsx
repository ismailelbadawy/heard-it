"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 bg-white text-black w-full border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
                        <Image
                            src="/logo.png"
                            alt="HeardIt Logo"
                            width={40}
                            height={40}
                            className="mr-2"
                        />
                        <span className="text-xl sm:text-2xl font-bold tracking-tight">HeardIt</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:block">
                    <ul className="flex gap-6">
                        <li>
                            <Link href="/" className="text-gray-700 hover:text-black font-medium transition-colors duration-150 pb-1 border-b-2 border-transparent hover:border-black">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/transcribe" className="text-gray-700 hover:text-black font-medium transition-colors duration-150 pb-1 border-b-2 border-transparent hover:border-black">
                                Analyze
                            </Link>
                        </li>
                        <li>
                            <a href="#how" className="text-gray-700 hover:text-black font-medium transition-colors duration-150 pb-1 border-b-2 border-transparent hover:border-black">
                                How It Works?
                            </a>
                        </li>
                        <li>
                            <a href="#pricing" className="text-gray-700 hover:text-black font-medium transition-colors duration-150 pb-1 border-b-2 border-transparent hover:border-black">
                                Pricing
                            </a>
                        </li>
                    </ul>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle mobile menu"
                >
                    <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                <nav className="px-4 pb-4 border-t border-gray-200">
                    <ul className="space-y-3 pt-4">
                        <li>
                            <Link 
                                href="/" 
                                className="block text-gray-700 hover:text-black font-medium transition-colors duration-150 py-2 px-2 rounded hover:bg-gray-50"
                                onClick={closeMobileMenu}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/transcribe" 
                                className="block text-gray-700 hover:text-black font-medium transition-colors duration-150 py-2 px-2 rounded hover:bg-gray-50"
                                onClick={closeMobileMenu}
                            >
                                Analyze
                            </Link>
                        </li>
                        <li>
                            <a 
                                href="#how" 
                                className="block text-gray-700 hover:text-black font-medium transition-colors duration-150 py-2 px-2 rounded hover:bg-gray-50"
                                onClick={closeMobileMenu}
                            >
                                How It Works?
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#pricing" 
                                className="block text-gray-700 hover:text-black font-medium transition-colors duration-150 py-2 px-2 rounded hover:bg-gray-50"
                                onClick={closeMobileMenu}
                            >
                                Pricing
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}