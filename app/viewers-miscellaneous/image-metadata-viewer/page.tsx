"use client";

import React, { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
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
				{/* InputArea */}
				<div className="space-y-2">
					<span className="text-sm font-medium">Upload Image</span>
					<div
						{...getRootProps()}
						className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer"
					>
						<Input {...getInputProps()} />
						{isDragActive ? (
							<p>Drop the image here ...</p>
						) : (
							<p>Drag &apos;n&apos; drop an image here, or click to select one</p>
						)}
					</div>
					{image && (
						<div className="mt-2 text-center">
							<p className="text-sm">Selected file: {image.name}</p>
							<img
								src={URL.createObjectURL(image)}
								alt="Uploaded"
								className="max-w-full h-auto mt-2 mx-auto"
							/>
						</div>
					)}
					{error && <p className="text-red-500 mt-2">{error}</p>}
				</div>

				{/* AdditionalSettings */}
				<div className="sr-only">
					<h2>Additional Settings</h2>
				</div>

				{/* ResultDisplay */}
				<div className="space-y-2">
					<span className="text-sm font-medium">EXIF Data</span>
					{exifData ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Tag</TableHead>
									<TableHead>Value</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{Object.entries(exifData).map(([key, value]) => (
									<TableRow key={key}>
										<TableCell>{key}</TableCell>
										<TableCell>{String(value)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<p className="text-muted-foreground text-sm">
							Upload an image to view its metadata.
						</p>
					)}
				</div>
			</div>
		</ToolPageLayout>
	);
};

export default ImageMetadataViewerPage;
