"use client";

import Link from "next/link";
import Image from "next/image";
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
					<div className="font-bold text-lg mb-2">My Website</div>
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
