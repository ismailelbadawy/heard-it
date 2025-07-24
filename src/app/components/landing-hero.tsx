import Image from "next/image";
export default function LandingHero() {
    return (
        <div className="flex items-center justify-space-between w-full bg-f5f5f5 text-center">
            <Image
                src="/tasks.svg"
                alt="Hero Image"
                width={100}
                height={100}
                className="w-1/2 h-auto"
            />
            <div className="p-8 align-center">
                <h1 className="text-5xl font-bold align-center">HeardIt</h1>
                <h2 className="text-2xl align-center">Said and Done</h2>
            </div>
        </div>
    );
}
