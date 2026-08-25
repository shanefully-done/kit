"use client";

import React, { useState, useCallback } from "react";
import NextImage from "next/image";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useDropzone } from "react-dropzone";
import EXIF from "exif-js";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { ToolHeader } from "@/components/ToolHeader";
import { ImageIcon } from "lucide-react";

interface ExifData {
	[key: string]: unknown;
}

const ImageMetadataViewerPage = () => {
	const [image, setImage] = useState<File | null>(null);
	const [exifData, setExifData] = useState<ExifData | null>(null);
	const [error, setError] = useState<string | null>(null);

	const onDrop = useCallback((acceptedFiles: File[]) => {
		if (acceptedFiles.length > 0) {
			const file = acceptedFiles[0];
			if (file.type.startsWith("image/")) {
				setImage(file);
				setError(null);

				const reader = new FileReader();
				reader.onload = (e) => {
					const img = new Image();
					img.onload = () => {
						// exif-js expects `this` to be the image element
						EXIF.getData(img as unknown as string, function (this: HTMLImageElement) {
							const allTags = EXIF.getAllTags(this as unknown as string) as Record<
								string,
								unknown
							>;
							if (Object.keys(allTags).length > 0) {
								setExifData(allTags);
							} else {
								setExifData(null);
								setError("No EXIF data found in this image.");
							}
						});
					};
					img.src = e.target?.result as string;
				};
				reader.readAsDataURL(file);
			} else {
				setError("Please upload a valid image file.");
				setImage(null);
				setExifData(null);
			}
		}
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	return (
		<ToolPageLayout
			header={
				<ToolHeader
					title="Image Metadata Viewer"
					icon={<ImageIcon aria-hidden="true" className="h-5 w-5" />}
				/>
			}
		>
			<div className="space-y-4">
				{/* Dropzone */}
				<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
					[ UPLOAD ]
				</p>
				<div
					{...getRootProps()}
					className="border border-ink border-dashed p-6 grid place-items-center cursor-pointer"
				>
					<Input {...getInputProps()} />
					{isDragActive ? (
						<p className="font-mono text-sm">Drop the image here ...</p>
					) : (
						<p className="font-mono text-sm text-muted-foreground">
							Drag &apos;n&apos; drop an image here, or click to select
						</p>
					)}
				</div>

				{image && (
					<div className="border border-ink bg-card p-4 grid place-items-center">
						<p className="font-mono text-sm mb-2">{image.name}</p>
						<NextImage
							src={URL.createObjectURL(image)}
							alt="Uploaded"
							className="max-w-full h-auto"
							width={300}
							height={300}
							unoptimized
						/>
					</div>
				)}

				{error && <p className="font-mono text-sm text-hazard mt-2">{error}</p>}

				{/* EXIF Data */}
				{exifData && (
					<>
						<p className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
							[ EXIF DATA ]
						</p>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="font-mono text-[10px] uppercase tracking-[0.08em] w-1/3">
										Tag
									</TableHead>
									<TableHead className="font-mono text-[10px] uppercase tracking-[0.08em]">
										Value
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{Object.entries(exifData).map(([key, value]) => (
									<TableRow key={key}>
										<TableCell className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground align-top">
											{key}
										</TableCell>
										<TableCell className="font-mono text-sm break-all align-top">
											{String(value)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</>
				)}

				{!exifData && !error && (
					<p className="font-mono text-sm text-muted-foreground">
						Upload an image to view its metadata.
					</p>
				)}
			</div>
		</ToolPageLayout>
	);
};

export default ImageMetadataViewerPage;
