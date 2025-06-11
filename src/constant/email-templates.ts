import { generateEmailHTML } from "@/lib";

export const resetPasswordEmailTemplate = (name: string, token: string) => {
	return generateEmailHTML(`
                    <p>Hello ${name},</p>
    
                    <p>Your password reset token is:</p>
    
                    <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
                        ${token}
                    </div>
    
                    <p>This token will expire in 5 minutes.</p>
    
                    <p class="warning">Important: Never share this token with anyone. Our team will never ask for your password reset token.</p>
    
                    <p>If you didn't request a password reset, please ignore this email.</p>
    
                    <p>Thank you,<br>The Team</p>
                `);
};

export const verificationCodeEmailTemplate = (name: string, token: string) => {
	return generateEmailHTML(`
                   <p>Hello ${name},</p>

                <p>Your verification code is:</p>

                <div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
                    ${token}
                </div>

                <p>This code will expire in 5 minutes.</p>

                <p class="warning">Important: Never share this code with anyone. Our team will never ask for your verification code.</p>

                <p>If you didn't request this code, please ignore this email.</p>

                <p>Thank you,<br>The Team</p>
                `);
};
