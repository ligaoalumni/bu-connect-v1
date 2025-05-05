interface PasswordOptions {
	length: number;
	uppercase: boolean;
	lowercase: boolean;
	numbers: boolean;
	symbols: boolean;
}

export function generatePassword(options: PasswordOptions): string {
	const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
	const numberChars = "0123456789";
	const symbolChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

	let availableChars = "";
	let password = "";

	// Build the character set based on options
	if (options.uppercase) availableChars += uppercaseChars;
	if (options.lowercase) availableChars += lowercaseChars;
	if (options.numbers) availableChars += numberChars;
	if (options.symbols) availableChars += symbolChars;

	// Ensure at least one character set is selected
	if (availableChars === "") {
		availableChars = lowercaseChars + numberChars;
	}

	// Generate the password
	for (let i = 0; i < options.length; i++) {
		const randomIndex = Math.floor(Math.random() * availableChars.length);
		password += availableChars[randomIndex];
	}

	// Ensure the password contains at least one character from each selected set
	let validPassword = true;

	if (options.uppercase && !/[A-Z]/.test(password)) validPassword = false;
	if (options.lowercase && !/[a-z]/.test(password)) validPassword = false;
	if (options.numbers && !/[0-9]/.test(password)) validPassword = false;
	if (options.symbols && !/[!@#$%^&*()-_=+[\]{}|;:,.<>?]/.test(password))
		validPassword = false;

	// If the password doesn't meet requirements, generate a new one
	if (!validPassword) {
		return generatePassword(options);
	}

	return password;
}

// Function to calculate password strength (0-100)
export function calculatePasswordStrength(password: string): number {
	if (!password) return 0;

	let strength = 0;

	// Length contribution (up to 40 points)
	strength += Math.min(password.length * 2, 40);

	// Character variety contribution (up to 60 points)
	if (/[A-Z]/.test(password)) strength += 15;
	if (/[a-z]/.test(password)) strength += 15;
	if (/[0-9]/.test(password)) strength += 15;
	if (/[^A-Za-z0-9]/.test(password)) strength += 15;

	return Math.min(strength, 100);
}
