"use client";
import { IDetectedBarcode, Scanner, outline } from "@yudiel/react-qr-scanner";
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner"; // Import toast component
import { Loader2 } from "lucide-react"; // For loading icon

// Function to handle database operations (replace with your actual DB function)
async function updateDatabase(code: string) {
	// Replace this with your actual database update/insert logic
	try {
		// Example implementation:
		// await db.insert({ code, timestamp: new Date() });
		console.log("Processing code:", code);

		// Simulate network delay for demonstration
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Return success or error based on your logic
		return { success: true, message: "QR code processed successfully" };
	} catch (error) {
		console.error("Database error:", error);
		return { success: false, message: "Failed to process QR code" };
	}
}

export function QRCodeScanner() {
	const [showQRScanner, setShowQRScanner] = useState(false);
	const [loading, setLoading] = useState(false);
	const [scanComplete, setScanComplete] = useState(false);
	const [lastProcessedCode, setLastProcessedCode] = useState("");
	const [processingStatus, setProcessingStatus] = useState<{
		success: boolean;
		message: string;
	} | null>(null);

	const handleScan = async (data: IDetectedBarcode[]) => {
		// Only process if we have data and not already loading
		if (data.length > 0 && !loading) {
			const qrCode = data[0].rawValue;

			// Skip if we've already processed this code
			if (qrCode === lastProcessedCode && scanComplete) {
				return;
			}

			setLastProcessedCode(qrCode);
			setLoading(true);

			try {
				// Process the QR code with database
				const result = await updateDatabase(qrCode);

				// Update status and show toast
				setProcessingStatus(result);
				setScanComplete(true);

				toast.success("Success", {
					description: result.message,
					richColors: true,
					duration: 5000,
					position: "top-center",
				});
			} catch (error) {
				// Handle any unexpected errors
				setProcessingStatus({
					success: false,
					message: "An unexpected error occurred",
				});

				toast.error("Error", {
					description: (error as Error).message,
					richColors: true,
					duration: 5000,
					position: "top-center",
				});
			} finally {
				setLoading(false);
			}
		}
	};

	const handleCancel = () => {
		setShowQRScanner(false);
		setScanComplete(false);
		setProcessingStatus(null);
	};

	const handleScanAgain = () => {
		setScanComplete(false);
		setProcessingStatus(null);
		setLastProcessedCode("");
	};

	const handleRetry = async () => {
		if (lastProcessedCode) {
			setLoading(true);

			try {
				const result = await updateDatabase(lastProcessedCode);
				setProcessingStatus(result);
				setScanComplete(result.success);
				toast.success("Success", {
					description: result.message,
					richColors: true,
					duration: 5000,
					position: "top-center",
				});
			} catch (error) {
				toast.error("Error", {
					description: (error as Error).message,
					richColors: true,
					duration: 5000,
					position: "top-center",
				});
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<div>
			<Button onClick={() => setShowQRScanner(true)}>Add Attendant</Button>

			{showQRScanner && (
				<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
					<div className="relative w-full h-full">
						<Scanner
							onScan={!scanComplete ? handleScan : () => {}}
							constraints={{
								facingMode: "environment",
							}}
							classNames={{
								container:
									"w-full backdrop-blur-xl h-full flex justify-center items-center",
								video: "object-cover",
							}}
							components={{
								audio: false,
								finder: false,
								torch: true,
								onOff: loading,
								tracker: outline,
							}}
							styles={{
								finderBorder: 1,
								container: {
									border: "none",
									position: "absolute",
									inset: 0,
								},
								video: {
									border: "none",
									objectFit: "cover",
								},
							}}
						/>

						{/* Loading overlay */}
						{loading && (
							<div className="absolute inset-0 flex items-center justify-center bg-black/50">
								<div className="bg-white/10 backdrop-blur-md p-6 rounded-lg flex flex-col items-center">
									<Loader2 className="h-8 w-8 animate-spin text-white mb-2" />
									<p className="text-white">Processing QR code...</p>
								</div>
							</div>
						)}

						{/* Status display after scan */}
						{scanComplete && processingStatus && (
							<div className="absolute inset-0 flex items-center justify-center bg-black/50">
								<div className="bg-white/10 backdrop-blur-md p-6 rounded-lg flex flex-col items-center">
									<div
										className={`text-xl font-bold mb-2 ${
											processingStatus.success
												? "text-green-400"
												: "text-red-400"
										}`}>
										{processingStatus.success ? "Success" : "Error"}
									</div>
									<p className="text-white mb-4">{processingStatus.message}</p>

									<div className="flex gap-3">
										{processingStatus.success ? (
											<>
												<Button
													variant="outline"
													className="text-white border-white hover:bg-white/20"
													onClick={handleScanAgain}>
													Scan Again
												</Button>
												<Button variant="default" onClick={handleCancel}>
													Done
												</Button>
											</>
										) : (
											<>
												<Button
													variant="outline"
													className="text-white border-white hover:bg-white/20"
													onClick={handleRetry}>
													Retry
												</Button>
												<Button variant="default" onClick={handleCancel}>
													Cancel
												</Button>
											</>
										)}
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Cancel button at bottom (visible when not showing status) */}
					{!scanComplete && (
						<div className="absolute bottom-12 z-10">
							<Button
								variant="default"
								className="bg-white/80 text-black hover:bg-white px-8 py-2 rounded-full"
								onClick={handleCancel}>
								Cancel
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
