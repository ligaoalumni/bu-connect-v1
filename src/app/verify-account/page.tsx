"use client";
import { getInformation, revalidatePathAction, verifyAccount } from "@/actions";
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components";
import { createToken } from "@/models/token";
import { User } from "@prisma/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function VerifyAccountPage() {
	const [timeLeft, setTimeLeft] = useState(0);
	const [user, setUser] = useState<User | null>(null);
	const [resendOTP, setResendOTP] = useState(false);
	const [verifying, setVerifying] = useState(false);
	const [token, setToken] = useState("");

	useEffect(() => {
		// Fetch user information on component mount
		getInformation().then((data) => setUser(data));
	}, []);

	useEffect(() => {
		if (timeLeft <= 0) return;

		const timer = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [timeLeft]);

	const handleResendOTP = async () => {
		if (!user) return;
		setResendOTP(true);
		try {
			await createToken(user.email);
			setTimeLeft(300);
			toast.success("OTP Sent", {
				description: "Please check your email or spam folder for OTP.",
				richColors: true,
				position: "top-center",
			});
		} catch (err) {
			toast.error("An Error Occurred", {
				description: (err as Error).message,
				richColors: true,
				position: "top-center",
			});
		} finally {
			setResendOTP(false);
		}
	};

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	const handleVerifyOTP = async () => {
		if (!user) return;
		setVerifying(true);
		let success = false;
		try {
			await verifyAccount(user.id, user.email, token);

			success = true;
			toast.success("OTP Verified!", {
				description: "Your account has been successfully verified!",
				richColors: true,
				position: "top-center",
			});
		} catch (err) {
			success = false;
			toast.error("An Error Occurred", {
				description: (err as Error).message,
				richColors: true,
				position: "top-center",
			});
		} finally {
			setVerifying(false);
		}

		if (success) {
			await revalidatePathAction("/", "/");
		}
	};

	return (
		<div className="relative flex items-center justify-center h-screen">
			<Card className="md:min-w-[400px] max-w-[400px]">
				<CardHeader>
					<CardTitle>Verify your account</CardTitle>
					<CardDescription>
						Hi there! We have sent an email to {user?.email}. Please check your
						email and click the link to verify your account.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<InputOTP
						readOnly={verifying || resendOTP}
						maxLength={6}
						value={token}
						onChange={setToken}
						className="gap-2">
						<InputOTPGroup>
							<InputOTPSlot className="text-2xl h-14 w-14" index={0} />
							<InputOTPSlot className="text-2xl h-14 w-14" index={1} />
							<InputOTPSlot className="text-2xl h-14 w-14" index={2} />

							<InputOTPSlot className="text-2xl h-14 w-14" index={3} />
							<InputOTPSlot className="text-2xl h-14 w-14" index={4} />
							<InputOTPSlot className="text-2xl h-14 w-14" index={5} />
						</InputOTPGroup>
					</InputOTP>
					<div className="flex justify-center items-center mt-2 text-sm mx-auto">
						<p>Didn&apos;t receive OTP? </p>
						{timeLeft > 0 ? (
							<span className="text-muted-foreground ml-2">
								Resend in {formatTime(timeLeft)}
							</span>
						) : (
							<Button
								disabled={resendOTP || verifying}
								variant="link"
								className="-ml-3"
								onClick={handleResendOTP}>
								{resendOTP ? "Sending otp" : "Resend OTP"}
							</Button>
						)}
					</div>
					<Button
						className="w-full mt-2"
						onClick={handleVerifyOTP}
						disabled={resendOTP || verifying}>
						Verify
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
