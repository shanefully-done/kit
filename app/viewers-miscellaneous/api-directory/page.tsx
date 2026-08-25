"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { BookOpen as BookOpenIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n/en";

import apiData from "@/data/api-list.json";

type ApiId = keyof Dictionary["tools"]["apiDirectory"]["items"];

const apiList = apiData as Array<{ id: ApiId; auth: string; link: string }>;

export default function ApiDirectoryPage() {
	const { t } = useI18n();
	const [searchTerm, setSearchTerm] = useState("");

	const filteredApis = apiList.filter((api) => {
		const query = searchTerm.toLowerCase();
		return (
			t(`tools.apiDirectory.items.${api.id}.name`)
				.toLowerCase()
				.includes(query) ||
			t(`tools.apiDirectory.items.${api.id}.description`)
				.toLowerCase()
				.includes(query)
		);
	});

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					icon={<BookOpenIcon aria-hidden />}
					title={t("tools.apiDirectory.title")}
				/>
			}
		>
			<div className="space-y-4">
				<div className="space-y-2">
					<label
						htmlFor="api-search"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						{t("tools.apiDirectory.searchLabel")}
					</label>
					<Input
						id="api-search"
						type="text"
						placeholder={t("tools.apiDirectory.searchPlaceholder")}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="font-mono"
					/>
				</div>

				<div>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="font-mono text-[11px] uppercase tracking-[0.08em]">
									{t("tools.apiDirectory.nameHeader")}
								</TableHead>
								<TableHead className="font-mono text-[11px] uppercase tracking-[0.08em]">
									{t("tools.apiDirectory.authHeader")}
								</TableHead>
								<TableHead className="font-mono text-[11px] uppercase tracking-[0.08em]">
									{t("tools.apiDirectory.endpointHeader")}
								</TableHead>
								<TableHead className="font-mono text-[11px] uppercase tracking-[0.08em] w-12"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredApis.map((api) => (
								<TableRow key={api.id}>
									<TableCell>
										<div className="font-mono text-sm">
											{t(`tools.apiDirectory.items.${api.id}.name`)}
										</div>
										<div className="mt-0.5 font-mono text-[10px] tracking-[0.08em] text-muted-foreground">
											{t(`tools.apiDirectory.items.${api.id}.description`)}
										</div>
									</TableCell>
									<TableCell>
										<Badge variant={api.auth === "No" ? "secondary" : "default"}>
											{api.auth}
										</Badge>
									</TableCell>
									<TableCell className="font-mono text-sm break-all max-w-xs">
										{api.link}
									</TableCell>
									<TableCell>
										<a
											href={api.link}
											target="_blank"
											rel="noopener noreferrer"
											className="font-mono text-sm"
										>
											{">>>"}
										</a>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					{filteredApis.length === 0 && (
						<p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
							{t("tools.apiDirectory.noMatch")}
						</p>
					)}
				</div>
			</div>
		</ToolPageLayout>
	);
}
