import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  sendmail: true,
  newline: "unix",
  path: "/usr/sbin/sendmail",
});


export default async function sendEmail(to: string, subject: string, text: string) {
    const NO_REPLY_EMAIL_ADDRESS = process.env.NO_REPLY_EMAIL_ADDRESS;
    if (!NO_REPLY_EMAIL_ADDRESS) {
        throw new Error("NO_REPLY_EMAIL_ADDRESS is not set in environment variables");
    }
    const mailOptions = {
        from: NO_REPLY_EMAIL_ADDRESS,
        to,
        subject,
        text,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("[mailer] -- Email sent:", info.response);
    } catch (error) {
        console.error("[mailer] -- Error sending email:", error);
        throw error;
    }
}

