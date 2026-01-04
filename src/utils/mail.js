import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Mailgen from "mailgen";
import { MailtrapTransport } from 'mailtrap'

dotenv.config();

export const sendMail = async (options) => {
    try {
        if (!process.env.EMAIL_FROM) {
            throw new Error("EMAIL_FROM is missing");
        }

        const mailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "SmartToDo",
                link: "https://sahinmallick.tech",
            },
        });

        const emailBody = mailGenerator.generate(options.mailGenContent);
        const emailText = mailGenerator.generatePlaintext(options.mailGenContent);

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: `"SmartToDo API" <${process.env.EMAIL_FROM}>`,
            to: options.email,
            subject: options.subject,
            text: emailText,
            html: emailBody,
        });

        console.log("email sent:", info.messageId);
    } catch (error) {
        console.error("EMAIL ERROR:", error.message);
    }
};

export const emailVerificationMailGenContent = (username, verifyUrl) => ({
    body: {
        name: username,
        intro: "Welcome to Smart ToDo! Let’s get your account ready.",
        action: {
            instructions: "Click the button below to verify your account:",
            button: {
                color: "#2563EB",
                text: "Verify Account",
                link: verifyUrl,
            },
        },
        outro: "If you didn’t create this account, you can safely ignore this email.",
    },
});


export const forgotPasswordMailGenContent = (username, resetUrl) => ({
    body: {
        name: username,
        intro: "You requested a password reset for your Smart ToDo account.",
        action: {
            instructions: "Click below to reset your password:",
            button: {
                color: "#DC2626",
                text: "Reset Password",
                link: resetUrl,
            },
        },
        outro: "If this wasn’t you, no action is required.",
    },
});
