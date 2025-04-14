"use client";

import { QRCodeCanvas } from "qrcode.react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Button,
	ButtonProps,
} from "@/components";
import { QRCodeValues } from "@/types";

interface QRCodeViewerProps {
	data?: QRCodeValues;
	buttonLabel: string;
	buttonProps?: ButtonProps;
}

export function QRCodeViewer({
	data,
	buttonLabel,
	buttonProps,
}: QRCodeViewerProps) {
	if (!data) return null;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button {...buttonProps}>{buttonLabel}</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>QR Code Viewer</DialogTitle>
					<DialogDescription>
						Scan the QR code to view and share alumni information.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<QRCodeCanvas
						value={JSON.stringify(data)}
						size={250}
						className="mx-auto"
					/>
					{/* {J	SON.stringify(values)} */}
				</div>
				<DialogFooter>
					<Button type="submit">Save changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
