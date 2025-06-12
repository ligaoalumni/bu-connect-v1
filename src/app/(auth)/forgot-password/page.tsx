"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
	Button,
	Input,
	Label,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components";

import { ArrowLeft, Mail, Shield, Lock } from "lucide-react";
import { toast } from "sonner";
import {
	sendPasswordRequestTokenAction,
	updateResetPasswordAction,
	validateResetTokenAction,
} from "@/actions";

type Step = "email" | "otp" | "reset";

export default function ForgotPassword() {
	const [currentStep, setCurrentStep] = useState<Step>("email");
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [countdown, setCountdown] = useState(0);
	const [canResend, setCanResend] = useState(true);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (countdown > 0) {
			interval = setInterval(() => {
				setCountdown((prev) => {
					if (prev <= 1) {
						setCanResend(true);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}
		return () => clearInterval(interval);
	}, [countdown]);

	const handleSendOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) {
			toast.error("Please enter your email address");
			return;
		}

		setIsLoading(true);

		try {
			await sendPasswordRequestTokenAction(email);

			toast.success("OTP sent to your email address", {
				description: "Please check your inbox and spam folder.",
				duration: 5000,
				richColors: true,
				position: "top-center",
			});
			setCanResend(false);
			setCurrentStep("otp");
			setCountdown(300);
		} catch {
			toast.error("Failed to send OTP", {
				description: "Please try again later or contact support.",
				duration: 5000,
				richColors: true,
				position: "top-center",
			});
		} finally {
			setIsLoading(false);
		}

		// // Simulate API call
		// setTimeout(() => {
		// 	setIsLoading(false);
		// 	setCurrentStep("otp");
		// 	setCountdown(300); // 5 minutes = 300 seconds
		// }, 2000);
	};

	const handleVerifyOTP = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!otp || otp.length !== 6) {
			toast.error("Please enter a valid 6-digit OTP");
			return;
		}

		setIsLoading(true);

		try {
			await validateResetTokenAction(email, otp);
			toast.success("OTP verified successfully");
			setCurrentStep("reset");
			setCountdown(0);
		} catch {
			toast.error("Invalid OTP. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!password || !confirmPassword) {
			toast.error("Please fill in all fields", {
				description: "Both password fields are required.",
				duration: 5000,
				richColors: true,
				position: "top-center",
			});
			return;
		}

		if (password !== confirmPassword) {
			toast.error("Passwords do not match", {
				description: "Please ensure both passwords are the same.",
				duration: 5000,
				richColors: true,
				position: "top-center",
			});
			return;
		}

		if (password.length < 8) {
			toast.error("Password must be at least 8 characters long", {
				description: "Please ensure your password meets the requirements.",
				duration: 5000,
				richColors: true,
				position: "top-center",
			});
			return;
		}

		setIsLoading(true);

		try {
			await updateResetPasswordAction(email, password);

			setCurrentStep("email");
			setEmail("");
			setOtp("");
			setPassword("");
			setConfirmPassword("");
			setCountdown(0);
			setCanResend(true);
			toast.success("Password reset successfully", {
				description: "You can now log in with your new password.",
				duration: 5000,
				richColors: true,
				position: "top-center",
			});
		} catch {
			toast.error("Failed to reset password", {
				description: "Please try again later or contact support.",
				duration: 5000,
				richColors: true,
				position: "top-center",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const goBack = () => {
		if (currentStep === "otp") {
			setCurrentStep("email");
		} else if (currentStep === "reset") {
			setCurrentStep("otp");
		}
	};

	const getStepIcon = () => {
		switch (currentStep) {
			case "email":
				return <Mail className="h-6 w-6" />;
			case "otp":
				return <Shield className="h-6 w-6" />;
			case "reset":
				return <Lock className="h-6 w-6" />;
		}
	};

	const getStepTitle = () => {
		switch (currentStep) {
			case "email":
				return "Forgot Password";
			case "otp":
				return "Verify OTP";
			case "reset":
				return "Reset Password";
		}
	};

	const getStepDescription = () => {
		switch (currentStep) {
			case "email":
				return "Enter your email address and we'll send you an OTP to reset your password";
			case "otp":
				return `We've sent a 6-digit code to ${email}. Enter it below to continue`;
			case "reset":
				return "Create a new password for your account";
		}
	};

	const formatCountdown = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	return (
		<div className=" bg-[#94949440]  bg-cover bg-center rounded-[0.7rem] ring-0 ring-[#949494] bg-opacity-20   ">
			<Card className="w-full md:min-w-[400px]   max-w-md mx-auto border-none bg-transparent relative">
				<CardHeader className="space-y-4 backdrop-blur-sm rounded-lg  mb-0">
					<div className="flex items-center gap-3">
						{currentStep !== "email" && (
							<Button
								variant="ghost"
								size="sm"
								onClick={goBack}
								className="p-1 h-8 w-8">
								<ArrowLeft className="h-4 w-4" />
							</Button>
						)}
						<div className="flex items-center gap-2">
							{getStepIcon()}
							<CardTitle className="text-xl">{getStepTitle()}</CardTitle>
						</div>
					</div>
					<CardDescription className="text-sm text-muted-foreground">
						{getStepDescription()}
					</CardDescription>
				</CardHeader>
				<CardContent className=" backdrop-blur-sm rounded-lg  ">
					{currentStep === "email" && (
						<form onSubmit={handleSendOTP} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email Address</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Sending OTP..." : "Send OTP"}
							</Button>
						</form>
					)}

					{currentStep === "otp" && (
						<form onSubmit={handleVerifyOTP} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="otp">Enter OTP</Label>
								<div className="flex justify-center">
									<InputOTP
										maxLength={6}
										value={otp}
										onChange={(value) => setOtp(value)}>
										<InputOTPGroup className="/90 backdrop-blur-sm rounded-lg p-2">
											<InputOTPSlot index={0} className=" border-2 " />
											<InputOTPSlot index={1} className=" border-2 " />
											<InputOTPSlot index={2} className=" border-2 " />
											<InputOTPSlot index={3} className=" border-2 " />
											<InputOTPSlot index={4} className=" border-2 " />
											<InputOTPSlot index={5} className=" border-2 " />
										</InputOTPGroup>
									</InputOTP>
								</div>
								<div className="text-center space-y-2">
									{countdown > 0 && (
										<p className="text-sm text-muted-foreground">
											Resend OTP in {formatCountdown(countdown)}
										</p>
									)}
									{canResend && countdown === 0 && (
										<p className="text-xs text-muted-foreground">
											Didn&apos;t receive the code?{" "}
											<button
												type="button"
												onClick={() =>
													handleSendOTP({
														preventDefault: () => {},
													} as React.FormEvent)
												}
												className="text-primary hover:underline"
												disabled={isLoading}>
												Resend OTP
											</button>
										</p>
									)}
								</div>
							</div>
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Verifying..." : "Verify OTP"}
							</Button>
						</form>
					)}

					{currentStep === "reset" && (
						<form onSubmit={handleResetPassword} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="password">New Password</Label>
								<Input
									id="password"
									type="password"
									placeholder="Enter new password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirm Password</Label>
								<Input
									id="confirmPassword"
									type="password"
									placeholder="Confirm new password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
								/>
							</div>
							<div className="text-xs text-muted-foreground">
								<p>Password must be at least 8 characters long</p>
							</div>
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Resetting Password..." : "Reset Password"}
							</Button>
						</form>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
