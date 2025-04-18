"use client";

import { changeEmailAction, validateTokenAction } from "@/actions";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Button,
	AlertDescription,
	Alert,
	Label,
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
	Input,
} from "@/components";
import { useAuth } from "@/contexts/auth-context";
import { UserCredentials } from "@/types";
import { AlertCircle, Check, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ChangeEmail() {
	const { user, setUser } = useAuth();
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [currentEmail, setCurrentEmail] = useState(user?.email); // Example current email
	const [newEmail, setNewEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP
	const [otpSent, setOtpSent] = useState(false);

	const handleSendOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		// Validate email
		if (!newEmail) {
			setError("Email is required");
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(newEmail)) {
			setError("Please enter a valid email address");
			return;
		}

		// Simulate sending OTP
		setLoading(true);
		try {
			// This would be your actual API call to send OTP
			await changeEmailAction({ email: newEmail });
			setOtpSent(true);

			setStep(2);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to send verification code"
			);
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (otp.length !== 6) {
			setError("Please enter the complete verification code");
			return;
		}

		// Simulate verifying OTP
		setLoading(true);
		try {
			// This would be your actual API call to verify OTP
			const isSuccess = await validateTokenAction({
				email: newEmail,
				otp,
				id: Number(user?.id),
			});
			if (!isSuccess) {
				setError("Invalid verification code");
				return;
			}

			setUser(
				(values) =>
					({
						...values,
						email: newEmail,
					} as UserCredentials)
			);
			setSuccess(true);
			// Update the current email to the new one after verification
			setCurrentEmail(newEmail);
			setShowModal(false);

			toast.success("Email updated successfully!", {
				description: "Your email address has been changed.",
				duration: 5000,
				richColors: true,
				position: "top-center",
			});
			setNewEmail("");
			setOtp("");
			setStep(1);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to send verification code"
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog modal open={showModal}>
			<DialogTrigger asChild onClick={() => setShowModal(true)}>
				<Button>Change Email</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<form
					onSubmit={step === 1 ? handleSendOTP : handleVerifyOTP}
					className="space-y-4">
					<DialogHeader>
						<DialogTitle>Change Email Address</DialogTitle>
						<DialogDescription>
							Update your email address with verification
						</DialogDescription>
					</DialogHeader>
					<div className="grid  space-y-4">
						{step === 1 ? (
							<>
								{error && (
									<Alert variant="destructive">
										<AlertCircle className="h-4 w-4" />
										<AlertDescription>{error}</AlertDescription>
									</Alert>
								)}

								{success && (
									<Alert className="bg-green-50 text-green-800 border-green-200">
										<Check className="h-4 w-4 text-green-600" />
										<AlertDescription>
											Email updated successfully!
										</AlertDescription>
									</Alert>
								)}

								<div className="space-y-2">
									<Label htmlFor="current-email">Current Email</Label>
									<Input
										id="current-email"
										type="email"
										value={currentEmail}
										disabled
										className="bg-muted"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="new-email">New Email</Label>
									<Input
										disabled={loading}
										id="new-email"
										type="email"
										value={newEmail}
										onChange={(e) => setNewEmail(e.target.value)}
										placeholder="Enter your new email address"
										required
									/>
								</div>
							</>
						) : (
							// <form onSubmit={handleVerifyOTP} className="space-y-4">
							<>
								{error && (
									<Alert variant="destructive">
										<AlertCircle className="h-4 w-4" />
										<AlertDescription>{error}</AlertDescription>
									</Alert>
								)}

								{otpSent && (
									<Alert className="bg-blue-50 text-blue-800 border-blue-200">
										<Mail className="h-4 w-4 text-blue-600" />
										<AlertDescription>
											A verification code has been sent to{" "}
											<strong>{newEmail}</strong>
										</AlertDescription>
									</Alert>
								)}

								<div className="space-y-2">
									<Label htmlFor="otp">Verification Code</Label>
									<div className="flex justify-center py-2">
										<InputOTP
											disabled={loading}
											maxLength={6}
											value={otp}
											onChange={setOtp}>
											<InputOTPGroup>
												<InputOTPSlot index={0} />
												<InputOTPSlot index={1} />
												<InputOTPSlot index={2} />
												<InputOTPSlot index={3} />
												<InputOTPSlot index={4} />
												<InputOTPSlot index={5} />
											</InputOTPGroup>
										</InputOTP>
									</div>
									<p className="text-xs text-muted-foreground text-center">
										Enter the 6-digit code sent to your new email address
									</p>
								</div>
							</>
						)}
					</div>
					<DialogFooter className="mt-3">
						{step === 1 ? (
							<Button
								type="button"
								variant="destructive"
								disabled={loading}
								onClick={() => setShowModal(false)}>
								Close
							</Button>
						) : (
							<Button
								type="button"
								variant="outline"
								className="w-full"
								onClick={() => setStep(1)}
								disabled={loading}>
								Back
							</Button>
						)}

						<Button type="submit" className="w-fit" disabled={loading}>
							{loading
								? step === 1
									? "Sending..."
									: "Verifying..."
								: step === 1
								? "Send Verification Code"
								: "Verify & Update Email"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
