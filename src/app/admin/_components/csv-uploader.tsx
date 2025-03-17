"use client";
import { useState } from "react";
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Progress,
} from "@/components";
import { toast } from "sonner";
import {
	Upload,
	CheckCircle,
	AlertCircle,
	FileSpreadsheet,
} from "lucide-react";

export default function CSVUploader() {
	const [file, setFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [result, setResult] = useState<{
		success: boolean;
		message: string;
		processed?: number;
		failed?: number;
		alreadyProcessed?: number;
	} | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile && selectedFile.type === "text/csv") {
			setFile(selectedFile);
			setResult(null);
		} else {
			toast.success("Invalid file", {
				description: "Please select a valid CSV file.",
				richColors: true,
				position: "top-center",
			});
		}
	};

	const handleUpload = async () => {
		if (!file) return;

		setIsUploading(true);
		setProgress(0);
		setResult(null);

		// Create a FormData object
		const formData = new FormData();
		formData.append("file", file);

		try {
			// Simulate progress updates
			const progressInterval = setInterval(() => {
				setProgress((prev) => {
					const newProgress = prev + 5;
					if (newProgress >= 90) {
						clearInterval(progressInterval);
						return 90;
					}
					return newProgress;
				});
			}, 100);

			// Send the file to the API route
			const response = await fetch("/api/upload-csv", {
				method: "POST",
				body: formData,
			});

			clearInterval(progressInterval);
			setProgress(100);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to upload CSV");
			}

			const data = await response.json();
			setResult({
				success: true,
				message: "Upload successful!",
				processed: data.processed,
				failed: data.failed,
				alreadyProcessed: data.alreadyExists,
			});

			toast.success("Success!", {
				richColors: true,
				position: "top-center",
				description: `Processed ${data.processed} records with ${data.failed} failures.`,
			});
		} catch (error) {
			setResult({
				success: false,
				message:
					error instanceof Error
						? error.message
						: "An error occurred during upload",
			});

			toast.error("Upload failed", {
				description:
					error instanceof Error
						? error.message
						: "An error occurred during upload",
				richColors: true,
				position: "top-center",
			});
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<Card className="w-full max-w-md ">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<FileSpreadsheet className="h-5 w-5" />
					CSV Data Upload
				</CardTitle>
				<CardDescription>
					Upload a CSV file to batch import data into the database.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex items-center justify-center w-full">
						<label
							htmlFor="csv-file"
							className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600">
							<div className="flex flex-col items-center justify-center pt-5 pb-6">
								<Upload className="w-8 h-8 mb-3 text-gray-500" />
								<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
									<span className="font-semibold">Click to upload</span> or drag
									and drop
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									CSV files only
								</p>
							</div>
							<input
								id="csv-file"
								type="file"
								accept=".csv"
								className="hidden"
								onChange={handleFileChange}
								disabled={isUploading}
							/>
						</label>
					</div>

					{file && (
						<div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
							<FileSpreadsheet className="h-5 w-5 text-blue-500" />
							<span className="text-sm font-medium truncate">{file.name}</span>
							<span className="text-xs text-gray-500 ml-auto">
								{(file.size / 1024).toFixed(2)} KB
							</span>
						</div>
					)}

					{isUploading && (
						<div className="space-y-2">
							<Progress value={progress} className="h-2" />
							<p className="text-xs text-center text-gray-500">
								Processing... {progress}%
							</p>
						</div>
					)}

					{result && (
						<div
							className={`p-3 rounded-md ${
								result.success ? "bg-green-50" : "bg-red-50"
							}`}>
							<div className="flex items-start">
								{result.success ? (
									<CheckCircle className="h-5 w-5 text-green-500 mr-2" />
								) : (
									<AlertCircle className="h-5 w-5 text-red-500 mr-2" />
								)}
								<div>
									<p
										className={`text-sm font-medium ${
											result.success ? "text-green-700" : "text-red-700"
										}`}>
										{result.message}
									</p>
									{result.success && (
										<p className="text-xs mt-1 text-gray-600">
											Processed {result.processed} records ({result.failed}{" "}
											failed and {result.alreadyProcessed} already exists).
										</p>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			</CardContent>
			<CardFooter>
				<Button
					onClick={handleUpload}
					disabled={!file || isUploading}
					className="w-full">
					{isUploading ? "Uploading..." : "Upload and Process"}
				</Button>
			</CardFooter>
		</Card>
	);
}
