"use client";
import { uploadAvatarImageAction } from "@/actions";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	Avatar,
	AvatarImage,
	AvatarFallback,
	Button,
} from "@/components";
import { Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AvatarUploadProps {
	avatarImage: string | null;
	handleSetValue: (value: string | null) => void;
	avatarFallback: string;
	isDisabled?: boolean;
}

export default function AvatarUpload({
	avatarImage,
	avatarFallback,
	handleSetValue,
	isDisabled,
}: AvatarUploadProps) {
	const [isUploading, setIsUploading] = useState(false);
	const [avatar, setAvatar] = useState<string | null>(avatarImage);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			try {
				setIsUploading(true);
				if (file.type.startsWith("image/")) {
					const img = await uploadAvatarImageAction(file);

					if (!img) {
						throw new Error("Failed to upload image");
					}
					setAvatar(img);
					handleSetValue(img);
				} else {
					throw new Error("Invalid file type");
				}
			} catch (err) {
				console.log(err);
				toast.error("Error uploading file", {
					richColors: true,
					description: "Please try again",
					position: "top-center",
				});
			} finally {
				setIsUploading(false);
			}
		}
	};

	const removeImage = () => {
		handleSetValue(null);
		setAvatar(null);
	};

	return (
		<Card className="bg-[#2F61A0] text-white">
			<CardHeader>
				<CardTitle className="text-center">Avatar Upload</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col items-center gap-4">
					<div className="relative">
						<Avatar className="h-[120px] w-[120px] border-2 border-white">
							{avatar ? (
								<AvatarImage src={avatar} alt="Profile picture" />
							) : (
								<AvatarFallback className="text-3xl bg-white/20">
									{avatarFallback}
								</AvatarFallback>
							)}

							{isUploading && (
								<div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
									<div className="h-8 w-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
								</div>
							)}

							{avatar && !isUploading && (
								<button
									onClick={removeImage}
									className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition-colors"
									type="button">
									<X className="h-4 w-4" />
								</button>
							)}
						</Avatar>
					</div>

					<div className="flex gap-2">
						<label htmlFor="avatar-upload-demo">
							<Button
								variant="outline"
								className="bg-white/20 hover:bg-white/30 border-white/50"
								disabled={isUploading || isDisabled}
								asChild>
								<div className="flex items-center gap-2 cursor-pointer">
									<Upload className="h-4 w-4" />
									{isUploading ? "Uploading..." : "Upload Photo"}
								</div>
							</Button>
						</label>
						<input
							id="avatar-upload-demo"
							type="file"
							accept="image/*"
							readOnly={isDisabled}
							className="hidden"
							onChange={handleFileChange}
							disabled={isUploading}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
