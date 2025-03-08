"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
	const pathname = usePathname();
	const isHomePage = pathname === "/";

	if (isHomePage) {
		return null;
	}

	return (
		<nav className="bg-white shadow-sm py-4">
			<div className="container mx-auto px-8 flex justify-between">
				<div className="flex flex-col items-center">
					<div className="font-bold text-lg mb-2">Yam Borodetsky</div>
					<div className="rounded-full overflow-hidden w-16 h-16 border-2 border-gray-300 shadow-sm">
						<Image
							src="/pfp.jpg"
							alt="Spider-Man Avatar"
							width={64}
							height={64}
							className="object-cover"
							priority
						/>
					</div>
				</div>
				<div className="space-x-6 self-center">
					<Link href="/" className="hover:underline">
						Home
					</Link>
					<Link href="/about" className="hover:underline">
						About
					</Link>
				</div>
			</div>
		</nav>
	);
}
