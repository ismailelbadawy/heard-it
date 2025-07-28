import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-white text-black w-full border-b border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/logo.png"
                        alt="HeardIt Logo"
                        width={40}
                        height={40}
                        className="mr-2"
                    />
                    <span className="text-2xl font-bold tracking-tight">HeardIt</span>
                </Link>
            </div>
            <nav>
                <ul className="flex gap-6">
                    <li>
                        <Link href="/" className="text-gray-700 hover:text-black font-medium transition-colors duration-150 pb-1 border-b-2 border-transparent hover:border-black">Home</Link>
                    </li>
                    <li>
                        <Link href="/transcribe" className="text-gray-700 hover:text-black font-medium transition-colors duration-150 pb-1 border-b-2 border-transparent hover:border-black">Transcribe</Link>
                    </li>
                    <li>
                        <a href="#how" className="text-gray-700 hover:text-black font-medium transition-colors duration-150 pb-1 border-b-2 border-transparent hover:border-black">How It Works?</a>
                    </li>
                    <li>
                        <a href="#pricing" className="text-gray-700 hover:text-black font-medium transition-colors duration-150 pb-1 border-b-2 border-transparent hover:border-black">Pricing</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}