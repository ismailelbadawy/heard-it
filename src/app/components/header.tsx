import Image from "next/image";

export default function Header() {
    return (
        <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-white text-black w-full border-b border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
                <Image
                    src="/logo.png"
                    alt="HeardIt Logo"
                    width={40}
                    height={40}
                    className="mr-2"
                />
                <span className="text-2xl font-bold tracking-tight">HeardIt</span>
            </div>
            <nav>
                <ul className="flex gap-6">
                    <li>
                        <a href="#hero" className="text-gray-700 hover:text-black font-medium transition-colors duration-150 pb-1 border-b-2 border-transparent hover:border-black">Home</a>
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