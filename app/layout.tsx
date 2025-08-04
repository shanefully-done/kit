import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Sidebar from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import MobileNavToggle from "@/components/MobileNavToggle";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Developer Utilities Hub",
	description: "A collection of developer tools.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<div className="flex min-h-screen">
						{/* Desktop Sidebar */}
						<aside className="hidden md:flex md:flex-col w-72 border-r bg-background">
							<Sidebar />
						</aside>

						{/* Main Content */}
						<main className="flex-1 overflow-auto">
							{/* Mobile Header with Sheet Trigger */}
							<div className="sticky top-0 z-20 flex items-center gap-2 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-3 md:hidden">
								<Sheet>
									<MobileNavToggle />
									<SheetContent side="left" className="w-64 p-0" aria-label="Sidebar">
										<Sidebar />
									</SheetContent>
								</Sheet>
								<span className="text-sm font-medium text-muted-foreground">Menu</span>
							</div>

							<div className="p-4 md:p-6">{children}</div>
						</main>
					</div>
				</ThemeProvider>
				<Toaster />
			</body>
		</html>
	);
}
