import type { Metadata } from "next";
import { Courier_Prime, Poiret_One, Sora } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Link from "next/link";
import { AuthNavActions } from "@/components/auth-nav-actions";
import { ModeToggle } from "@/components/theme-toggle";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import dynamic from 'next/dynamic';

// Lazy load AnimatedLayout for better performance
const AnimatedLayout = dynamic(() => import('./AnimatedLayout'), {
  loading: () => <div className="container mx-auto py-6 flex-1 max-w-[955px] mr-auto ml-auto px-2"></div>,
  ssr: true
});

// Optimize font loading with display swap
const sora = Sora({
	variable: "--font-sora",
	subsets: ["latin"],
	weight: ["400", "500"],
	display: 'swap',
	preload: true,
});

const poiretOne = Poiret_One({
	variable: "--font-poiret-one",
	subsets: ["latin"],
	weight: "400",
	display: 'swap',
});

const courier = Courier_Prime({
	variable: "--font-courier-prime",
	subsets: ['latin'],
	weight: "400",
	display: 'swap',
});


export const metadata: Metadata = {
	title: "Personal Blog | Burak Demir",
	description: "Clean modern personal blog with admin CMS featuring tech articles and insights",
	keywords: ["blog", "tech", "programming", "web development", "Burak Demir"],
	authors: [{ name: "Burak Demir" }],
	creator: "Burak Demir",
	openGraph: {
		title: "Personal Blog | Burak Demir",
		description: "Clean modern personal blog with admin CMS featuring tech articles and insights",
		type: "website",
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: "Personal Blog | Burak Demir",
		description: "Clean modern personal blog with admin CMS featuring tech articles and insights",
	},
	robots: {
		index: true,
		follow: true,
	},
};

// Memoized header component for better performance
const Header = () => (
	<header className="border-b">
		<div className="container mx-auto w-full p-12 py-6 flex items-center justify-around">
			<h1 className="text-xl font-thin tracking-wide hover:underline">
				<Link href="/" aria-label="Go home" prefetch={true}>
					Burak Demir
				</Link>
			</h1>
			<nav className="flex items-center gap-6" aria-label="Main navigation">
				<Link 
					href="/" 
					className="relative text-sm font-medium transition-colors hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full" 
					tabIndex={0}
					prefetch={true}
				>
					Blog
				</Link>
				<Link 
					href="/about" 
					className="relative text-sm font-medium transition-colors hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full" 
					tabIndex={0}
					prefetch={true}
				>
					About
				</Link>
				<Link 
					href="https://github.com/burakdemirrr" 
					target="_blank" 
					rel="noopener noreferrer" 
					className="relative text-sm font-medium transition-colors hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full" 
					tabIndex={0}
				>
					Github
				</Link>
				<ModeToggle />
				<AuthNavActions />
			</nav>
		</div>
	</header>
);

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Get messages for the current locale
	const messages = await getMessages();

	return (
		<html lang="tr" className="hide-scrollbar" suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
							try {
								const theme = localStorage.getItem('theme') || 'system';
								if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
									document.documentElement.classList.add('dark');
								}
							} catch (e) {}
						`,
					}}
				/>
			</head>
			<body className={`${sora.variable} ${poiretOne.variable} ${courier.variable} font-sans antialiased min-h-screen bg-background text-foreground hide-scrollbar`} suppressHydrationWarning>
				<Providers>
					<NextIntlClientProvider messages={messages}>
						<div className="min-h-screen flex flex-col hide-scrollbar" id="fullDiv">
							<Header />
							<AnimatedLayout>
								{children}
							</AnimatedLayout>
						</div>
					</NextIntlClientProvider>
				</Providers>
			</body>
		</html>
	);
}
