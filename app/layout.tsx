import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import Sidebar from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import MobileNavToggle from "@/components/MobileNavToggle";
import { I18nProvider } from "@/lib/i18n";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
	weight: ["400", "500", "600"],
	variable: "--font-ibm-plex-mono",
	subsets: ["latin"],
});


export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
};

export const metadata: Metadata = {
	applicationName: "Kit.",
	metadataBase: new URL("https://kit.ixtj.dev"),
	title: "Kit.",
	description: "A collection of developer tools.",
	openGraph: {
		title: "Kit.",
		description: "A collection of developer tools.",
		url: "https://kit.ixtj.dev",
		siteName: "Kit.",
		images: [
			{
				url: "/preview.png",
				width: 800,
				height: 600,
				alt: "A collection of developer tools.",
			},
		],
		locale: "en_US",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.variable} ${ibmPlexMono.variable} antialiased`}>
				<I18nProvider>
					<ThemeProvider>
						<div className="flex h-dvh overflow-hidden bg-background">
							{/* Desktop Sidebar */}
							<aside className="hidden md:flex md:flex-col w-72 border-r-2 border-ink bg-paper">
								<Sidebar />
							</aside>

							{/* Main Content */}
							<main className="flex-1 overflow-y-auto">
								{/* Mobile Header with Sheet Trigger */}
								<div className="sticky top-0 z-20 flex items-center gap-3 border-b-2 border-ink bg-paper p-3 md:hidden">
									<Sheet>
										<MobileNavToggle />
										<SheetContent side="left" className="w-64 p-0" aria-label="Sidebar">
											<Sidebar />
										</SheetContent>
									</Sheet>
									<span className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
										[ NAV ]
									</span>
								</div>

								<div className="p-4 md:p-8">{children}</div>
							</main>
						</div>
					</ThemeProvider>
					<Toaster />
					<SonnerToaster />
				</I18nProvider>
			</body>
		</html>
	);
}
