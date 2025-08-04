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
			api.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<ToolPageLayout
			header={
				<ToolHeader icon={<BookOpenIcon aria-hidden />} title="API Directory" />
			}
		>
			<div className="space-y-4">
				<div>
					<label htmlFor="api-search" className="sr-only">
						Search APIs
					</label>
					<Input
						id="api-search"
						type="text"
						placeholder="Search APIs..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>

				<div>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Description</TableHead>
								<TableHead>Auth</TableHead>
								<TableHead>Link</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredApis.map((api) => (
								<TableRow key={api.name}>
									<TableCell className="font-medium">{api.name}</TableCell>
									<TableCell>{api.description}</TableCell>
									<TableCell>
										<Badge variant="secondary">{api.auth}</Badge>
									</TableCell>
									<TableCell>
										<a
											href={api.link}
											target="_blank"
											rel="noopener noreferrer"
											className="text-primary underline-offset-4 hover:underline"
										>
											Documentation
										</a>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>

					{filteredApis.length === 0 && (
						<p className="text-center text-muted-foreground mt-4">No APIs found.</p>
					)}
				</div>
			</div>
		</ToolPageLayout>
	);
}
