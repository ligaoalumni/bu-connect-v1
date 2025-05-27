import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Twitter, Github, Wrench } from "lucide-react";

export default function MaintenancePage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
			<div className="max-w-2xl w-full text-center space-y-8">
				{/* Icon and Title */}
				<div className="space-y-4">
					<div className="flex justify-center">
						<div className="relative">
							<div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
								<Wrench className="w-12 h-12 text-orange-600" />
							</div>
							<div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full animate-pulse"></div>
						</div>
					</div>

					<div className="space-y-2">
						<h1 className="text-4xl md:text-5xl font-bold text-slate-900">
							Under Maintenance
						</h1>
						<p className="text-xl text-slate-600">
							We&apos;re making some improvements to serve you better
						</p>
					</div>
				</div>

				{/* Main Content Card */}
				<Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
					<CardContent className="p-8 space-y-6">
						<div className="space-y-4">
							<p className="text-slate-600 leading-relaxed">
								We&apos;re currently performing scheduled maintenance to improve
								our services. We expect to be back online shortly. Thank you for
								your patience!
							</p>
						</div>

						{/* Progress Bar */}
					</CardContent>
				</Card>

				{/* Contact and Social Links */}
				<div className="space-y-4">
					<p className="text-slate-600">
						Need immediate assistance? Contact our support team
					</p>

					<div className="flex justify-center gap-4">
						<Button variant="outline" size="sm" className="gap-2">
							<Mail className="w-4 h-4" />
							support@company.com
						</Button>
						<Button variant="outline" size="sm" className="gap-2">
							<Twitter className="w-4 h-4" />
							@company
						</Button>
						<Button variant="outline" size="sm" className="gap-2">
							<Github className="w-4 h-4" />
							Status Page
						</Button>
					</div>
				</div>

				{/* Footer */}
				<div className="text-sm text-slate-500 pt-8 border-t border-slate-200">
					<p>© 2024 Your Company. We&apos;ll be back soon!</p>
				</div>
			</div>
		</div>
	);
}
