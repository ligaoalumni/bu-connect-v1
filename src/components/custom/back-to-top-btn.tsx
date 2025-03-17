// components/BackToTopButton.jsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

export const BackToTopButton = () => {
	const [isVisible, setIsVisible] = useState(false);

	// Show button when page is scrolled down
	useEffect(() => {
		const toggleVisibility = () => {
			if (window.scrollY > 300) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", toggleVisibility);

		// Clean up event listener
		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	// Scroll to top smoothly
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<>
			{isVisible && (
				<Button
					className="fixed bottom-4  shadow-2xl right-4 md:bottom-8 md:right-8 rounded-full p-3  "
					onClick={scrollToTop}
					size="icon"
					variant="default"
					aria-label="Back to top">
					<ArrowUp className="h-5 w-5" />
				</Button>
			)}
		</>
	);
};
