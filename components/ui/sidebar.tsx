"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MenuIcon, SearchIcon, SunIcon, MoonIcon } from "lucide-react"; // Assuming lucide-react for icons
import { useMounted } from "@/hooks/use-mounted";

const Sidebar = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const { theme, setTheme, resolvedTheme } = useTheme();
	const mounted = useMounted();

	const toggleSidebar = () => {
		setIsCollapsed(!isCollapsed);
	};

	const tools = [
		{ name: "API Directory", href: "/viewers-miscellaneous/api-directory" },
		{ name: "UUID Generator", href: "/generators/uuid" },
		{ name: "Password Generator", href: "/generators/password" },
		{ name: "Text Case Converter", href: "/converters-parsers/text-case" },
		{ name: "QR Code Generator & Reader", href: "/generators/qr-code" },
		{ name: "Gradient Generator", href: "/generators/gradient" },
		{ name: "CRON Parser", href: "/converters-parsers/cron-parser" },
		{ name: "JSON Parser", href: "/converters-parsers/json-parser" },
		{ name: "Hash Generator", href: "/generators/hash" },
		{ name: "JWT Decoder", href: "/converters-parsers/jwt-decoder" },
		{
			name: "URL Encoder/Decoder",
			href: "/converters-parsers/url-encoder-decoder",
		},
		{ name: "URL Parser", href: "/converters-parsers/url-parser" },
		{
			name: "Timezone Converter",
			href: "/converters-parsers/timezone-converter",
		},
		{
			name: "Base64 Encoder/Decoder",
			href: "/converters-parsers/base64-encoder-decoder",
		},
		{ name: "Regex Tester", href: "/converters-parsers/regex-tester" },
		{
			name: "Number Base Converter",
			href: "/converters-parsers/number-base-converter",
		},
		{
			name: "Image Metadata Viewer",
			href: "/viewers-miscellaneous/image-metadata-viewer",
		},
		{
			name: "Timestamp Converter",
			href: "/converters-parsers/timestamp-converter",
		},
		{ name: "Unit Converter", href: "/converters-parsers/unit-converter" },
		// Add more tools as needed
	];

	return (
		<div
			className={`flex flex-col h-full border-r bg-background transition-all duration-300 ${
				isCollapsed ? "w-16" : "w-72"
			} md:w-72`}
		>
			<div className="flex items-center justify-between h-16 px-4 border-b">
				{!isCollapsed && (
					<Link href="/" className="text-xl font-bold">
						kit.
					</Link>
				)}
				<Button
					variant="ghost"
					size="icon"
					className="md:hidden"
					onClick={toggleSidebar}
				>
					<MenuIcon className="h-6 w-6" />
				</Button>
			</div>
			<div className="flex-1 overflow-y-auto p-4">
				{!isCollapsed && (
					<>
						<div className="relative mb-4">
							<SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input placeholder="Search" className="pl-8" />
						</div>
						<nav className="grid items-start gap-2">
							{tools.map((tool) => (
								<Link
									key={tool.name}
									href={tool.href}
									className="flex items-center gap-0 rounded-lg px-0 py-2 text-muted-foreground transition-all hover:text-primary"
								>
									{/* Placeholder for icon, you'd add actual icons here */}
									<span className="h-5 w-5" />
									{tool.name}
								</Link>
							))}
						</nav>
					</>
				)}
			</div>
			<div className="flex items-center justify-between h-16 px-4 border-t">
				{!isCollapsed && (
					<div className="flex items-center gap-2">
						{/* Theme icon placeholder on SSR to avoid hydration mismatch */}
						{!mounted ? (
							<span
								aria-hidden="true"
								suppressHydrationWarning={true}
								className="inline-block h-5 w-5"
							/>
						) : resolvedTheme === "dark" || theme === "dark" ? (
							<MoonIcon className="h-5 w-5" aria-hidden="true" />
						) : (
							<SunIcon className="h-5 w-5" aria-hidden="true" />
						)}
						<Label htmlFor="theme-switch">Dark Mode</Label>
						<Switch
							id="theme-switch"
							checked={(resolvedTheme ?? theme) === "dark"}
							onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default Sidebar;
