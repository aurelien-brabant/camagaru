import {existsSync, readFileSync} from 'fs';
import { createTransport } from 'nodemailer';
import {join} from 'path';
import ejs from 'ejs';

const SMTP_PORT = Number(process.env.SMTP_PORT) || 587
const EMAIL_TEMPLATE_PATH = join(process.cwd(), 'src', 'email-template')

const transport = createTransport({
	host: process.env.MAILER_SMTP_SERVER,
	port: SMTP_PORT,
	secure: SMTP_PORT === 465,
	auth: {
		user: process.env.MAILER_EMAIL,
		pass: process.env.MAILER_PASSWORD
	}
});

type MailPayload = {
	recipient: string;
	subject: string;
	html: string;
}

export const sendEmail = async (payload: MailPayload) => {
	return transport.sendMail({
		from: `"Camagru Admin" <${process.env.MAILER_EMAIL}>`,
		to: payload.recipient,
		subject: payload.subject,
		html: payload.html
	});
}

export const sendTemplatedEmail = async (recipient: string, subject: string, templateName: string, templateArguments: any) => {
	const templatePath = join(EMAIL_TEMPLATE_PATH, templateName);

	if (existsSync(templatePath)) {
		const buf = readFileSync(templatePath);
		const html = ejs.render(buf.toString(), templateArguments);

		await sendEmail({
			subject,
			recipient,
			html
		});
	} else {
		console.error('Could not generate mail template.');
	}
}
