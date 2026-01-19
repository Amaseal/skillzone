import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

const transporter = nodemailer.createTransport({
	host: env.SMTP_HOST,
	port: parseInt(env.SMTP_PORT || '587'),
	secure: env.SMTP_SECURE === 'true',
	auth: {
		user: env.SMTP_USER,
		pass: env.SMTP_PASS
	}
});

export const sendEmail = async (to: string, subject: string, html: string) => {
	try {
		const info = await transporter.sendMail({
			from: env.SMTP_FROM || env.SMTP_USER, // sender address
			to,
			subject,
			html
		});
		console.log('Message sent: %s', info.messageId);
		return { success: true, messageId: info.messageId };
	} catch (error) {
		console.error('Error sending email:', error);
		return { success: false, error };
	}
};
