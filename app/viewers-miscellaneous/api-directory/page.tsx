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

interface ApiEntry {
	name: string;
	description: string;
	auth: string;
	link: string;
}

import apiData from "@/data/api-list.json";

const apiList: ApiEntry[] = apiData;

export default function ApiDirectoryPage() {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredApis = apiList.filter(
		(api) =>
			api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			api.description.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<ToolPageLayout
			header={
				<ToolHeader icon={<BookOpenIcon aria-hidden />} title="API Directory" />
			}
		>
			<div className="space-y-4">
				<div className="space-y-2">
					<label
						htmlFor="api-search"
						className="font-mono text-[11px] uppercase tracking-[0.08em]"
					>
						Search
					</label>
					<Input
						id="api-search"
						type="text"
						placeholder="Filter by name or description..."
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
									Name
								</TableHead>
								<TableHead className="font-mono text-[11px] uppercase tracking-[0.08em]">
									Auth
								</TableHead>
								<TableHead className="font-mono text-[11px] uppercase tracking-[0.08em]">
									Endpoint
								</TableHead>
								<TableHead className="font-mono text-[11px] uppercase tracking-[0.08em] w-12"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredApis.map((api) => (
								<TableRow key={api.name}>
									<TableCell>
										<div className="font-mono text-sm">{api.name}</div>
										<div className="mt-0.5 font-mono text-[10px] tracking-[0.08em] text-muted-foreground">
											{api.description}
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
							[ NO MATCH ]
						</p>
					)}
				</div>
			</div>
		</ToolPageLayout>
	);
}
