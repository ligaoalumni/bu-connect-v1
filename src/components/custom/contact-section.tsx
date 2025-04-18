"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button, Input, Label, Textarea, Checkbox } from "@/components";

export function ContactSectionForm() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
		acceptTerms: false,
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleCheckboxChange = (checked: boolean) => {
		setFormData((prev) => ({ ...prev, acceptTerms: checked }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Form submitted:", formData);
		// Add your form submission logic here
	};

	return (
		<section
			id="contact-us"
			className="w-full min-h-screen flex items-center   bg-[#1a237e] justify-center  ">
			<div className="w-full container mx-auto text-white   overflow-hidden  ">
				<div className="flex flex-col md:flex-row">
					{/* Left side - Contact information */}
					<div className="p-8 md:p-12 md:w-1/3 flex flex-col justify-between">
						<div>
							<h2 className="text-2xl md:text-3xl font-bold mb-2">
								Contact us
							</h2>
							<p className="text-sm text-white/80 mb-8">
								register for daily updates
							</p>

							<div className="space-y-6">
								<div className="flex items-center gap-3">
									<Mail className="h-5 w-5 text-white/80" />
									<span>ligaoalumni@gmail.com</span>
								</div>
								<div className="flex items-center gap-3">
									<Phone className="h-5 w-5 text-white/80" />
									<span>+1 (555) 000-0000</span>
								</div>
								<div className="flex items-center gap-3">
									<MapPin className="h-5 w-5 text-white/80" />
									<span>Kuala Lajor City</span>
								</div>
							</div>
						</div>
					</div>

					{/* Right side - Form */}
					<div className="bg-[#1a237e] p-8 md:p-12 md:w-2/3">
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="name" className="text-white">
									Name
								</Label>
								<Input
									id="name"
									name="name"
									value={formData.name}
									onChange={handleChange}
									className="bg-white text-black"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email" className="text-white">
									Email
								</Label>
								<Input
									id="email"
									name="email"
									type="email"
									value={formData.email}
									onChange={handleChange}
									className="bg-white text-black"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="message" className="text-white">
									Message
								</Label>
								<Textarea
									id="message"
									name="message"
									value={formData.message}
									onChange={handleChange}
									placeholder="Type your message..."
									className="bg-white text-black min-h-[120px]"
									required
								/>
							</div>

							<div className="flex items-center space-x-2">
								<Checkbox
									id="terms"
									checked={formData.acceptTerms}
									onCheckedChange={handleCheckboxChange}
									required
								/>
								<Label htmlFor="terms" className="text-sm">
									I accept the{" "}
									<span className="underline cursor-pointer">Terms</span>
								</Label>
							</div>

							<Button
								type="submit"
								className="bg-white text-[#1a237e] hover:bg-white/90">
								Submit
							</Button>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
