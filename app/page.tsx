"use client";

import * as React from "react";
import Link from "next/link";
import {
	ArrowRightIcon,
	BookOpenIcon,
	LayersIcon,
	SettingsIcon,
	Wand2Icon,
} from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import ToolHeader from "@/components/ToolHeader";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const categories = [
	{
		title: "Converters & Parsers",
		description: "Transform and decode data formats quickly.",
		hrefs: [
			{ label: "Text Case", href: "/converters-parsers/text-case" },
			{ label: "JSON Parser", href: "/converters-parsers/json-parser" },
			{ label: "Regex Tester", href: "/converters-parsers/regex-tester" },
			{ label: "URL Tools", href: "/converters-parsers/url-parser" },
		],
		icon: <LayersIcon className="h-5 w-5" />,
	},
	{
		title: "Generators",
		description: "Produce IDs, passwords, gradients, and more.",
		hrefs: [
			{ label: "UUID", href: "/generators/uuid" },
			{ label: "Password", href: "/generators/password" },
			{ label: "QR Code", href: "/generators/qr-code" },
			{ label: "Gradient", href: "/generators/gradient" },
		],
		icon: <Wand2Icon className="h-5 w-5" />,
	},
	{
		title: "Viewers & Misc",
		description: "Inspect metadata and explore APIs.",
		hrefs: [
			{ label: "API Directory", href: "/viewers-miscellaneous/api-directory" },
			{
				label: "Image Metadata",
				href: "/viewers-miscellaneous/image-metadata-viewer",
			},
		],
		icon: <BookOpenIcon className="h-5 w-5" />,
	},
];

export default function HomePage() {
	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<SettingsIcon className="h-6 w-6" />}
					title="kit."
					actions={
						<Button asChild size="sm" variant="outline">
							<Link href="https://github.com/shanefully-done/kit">Star on GitHub</Link>
						</Button>
					}
				/>
			}
		>
			<div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{categories.map((cat) => (
					<Card key={cat.title} className="group">
						<CardHeader className="flex-row items-start justify-between gap-3">
							<div className="flex items-center gap-2">
								<span aria-hidden className="text-muted-foreground">
									{cat.icon}
								</span>
								<CardTitle className="text-base md:text-lg">{cat.title}</CardTitle>
							</div>
							<Badge variant="secondary" className="shrink-0">
								Category
							</Badge>
						</CardHeader>
						<CardContent className="space-y-3">
							<CardDescription>{cat.description}</CardDescription>
							<div className="flex flex-wrap gap-2">
								{cat.hrefs.map((item) => (
									<Button key={item.href} asChild variant="outline" size="sm">
										<Link href={item.href}>
											<span>{item.label}</span>
											<ArrowRightIcon className="ml-1 h-4 w-4" aria-hidden="true" />
										</Link>
									</Button>
								))}
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</ToolPageLayout>
	);
}
