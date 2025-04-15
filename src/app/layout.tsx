import type { Metadata } from "next";
import { Geist } from "next/font/google";
import type React from "react";
import "./globals.css";
import Footer from "~/components/footer";
import Header from "~/components/header";
import { ThemeProvider } from "~/components/theme-provider";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Yam Borodetsky · Software Engineer",
	description:
		"Yam Borodetsky is a software engineer specializing in full-stack development",
	icons: {
		icon: [{ url: "https://github.com/yamcodes.png", type: "image/png" }],
		apple: [{ url: "https://github.com/yamcodes.png", type: "image/png" }],
	},
	openGraph: {
		title: "Yam Borodetsky · Software Engineer",
		description:
			"Yam Borodetsky is a software engineer specializing in full-stack development",
	},
	twitter: {
		card: "summary_large_image",
		title: "Yam Borodetsky · Software Engineer",
		description:
			"Yam Borodetsky is a software engineer specializing in full-stack development",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={geist.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<div className="flex min-h-screen flex-col">
						<Header />
						<main className="flex-1">
							<div className="container max-w-6xl mx-auto px-4 py-12 md:py-24">
								{children}
							</div>
						</main>
						<Footer />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
