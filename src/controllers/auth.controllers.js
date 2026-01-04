import { success } from "zod";
import { User } from "../models/user.model.js";
import { emailVerificationMailGenContent, sendMail } from "../utils/mail.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { forgotPasswordMailGenContent } from "../utils/mail.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
    const { fullname, email, phone, username, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists!"
            })
        }

        const token = crypto.randomBytes(32).toString("hex");
        const tokenExpiry = Date.now() + 30 * 60 * 1000;

        const user = await User.create({
            fullname,
            username,
            email,
            phone,
            password,
            emailVerificationToken: token,
            emailVerificationExpires: tokenExpiry,
        });

        const verificationUrl = `${process.env.URL}/api/v1/auth/verify-user/${token}`;

        await sendMail({
            email,
            subject: "Verify your account",
            mailGenContent: emailVerificationMailGenContent(
                username,
                verificationUrl,
            ),
        });

        return res
            .status(201)
            .json({
                success: true,
                message: "User created successfully!",
                user
            });
    } catch (error) {
        console.error("REGISTER ERROR STACK:\n", error.stack);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const verifyUser = async (req, res) => {
    const { token } = req.params;

    try {
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Invalid Link!"
            })
        }

        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Verification link is invalid or has expired!",
                }
            );
        }

        if (user.isVerified) {
            return res.status(400).json(
                {
                    success: false,
                    message: "User is already verified!",
                }
            );
        }

        ((user.isVerified = true),
            (user.emailVerificationToken = null),
            (user.emailVerificationExpires = null));

        await user.save();

        return res
            .status(200)
            .json({
                success: true,
                message: "User verified succesfully!"
            });
    } catch (error) {
        console.log(`Error in verify user! ${error}`);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your account first",
            });
        }

        const accessToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET_ACCESS_TOKEN,
            { expiresIn: "30d" }
        );

        const safeUser = await User.findById(user._id).select(
            "-password -forgotPasswordToken -emailVerificationToken"
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: safeUser,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const logoutUser = async (req, res) => {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        return res.status(400).json({
            success: false,
            message: "No access token found!"
        })
    };

    try {
        const user = await User.findOne({ accessToken: accessToken });
        if (user) {
            user.accessToken = null;
            await user.save();
        }

        res.clearCookie("accessToken").status(200).json({
            success: true,
            message: "User logged out successfully",
        });

    } catch (error) {
        console.log(`Error while logging in user! ${error}`);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const resendEmailVerification = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Please enter your email!"
        })
    };

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No user found!"
            })
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User already verified!"
            })
        };

        const token = crypto.randomBytes(32).toString("hex");
        const tokenExpiry = Date.now() + 30 * 60 * 1000;

        user.emailVerificationToken = token;
        user.emailVerificationExpires = tokenExpiry;
        await user.save();

        const verificationUrl = `${process.env.URL}/api/v1/user/verify-user/${token}`;

        await sendMail({
            email,
            subject: "Verify your account",
            mailGenContent: emailVerificationMailGenContent(
                username,
                verificationUrl,
            ),
        });

        return res
            .status(200)
            .json({
                success: true,
                message: "Verification email sent successfully!"
            })
    } catch (error) {
        console.log(`Error while re-sending email verification! ${error}`);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const forgotPasswordRequest = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Please enter your email!"
        })
    };

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exists!"
            })
        }

        const token = crypto.randomBytes(32).toString("hex");
        const tokenExpiry = Date.now() + 30 * 60 * 1000;

        const resetPasswordUrl = `${process.env.URL}/api/v1/user/reset-password/${token}`;

        user.forgotPasswordToken = token;
        user.forgotPasswordExpires = tokenExpiry;
        await user.save();

        const username = user.username;

        await sendMail({
            email,
            subject: "Reset Password",
            mailGenContent: forgotPasswordMailGenContent(
                username,
                resetPasswordUrl,
            ),
        });

        return res
            .status(200)
            .json({
                success: false,
                message: "Password reset link is sent to the email!"
            });
    } catch (error) {
        console.log(`Error while sending forgot password request! ${error}`);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Invalid/Expired Link!"
        })
    };

    try {
        const user = await User.findOne({
            forgotPasswordToken: token,
            forgotPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Reset password link is invalid or has expired!"
            })
        }

        user.password = password;
        user.forgotPasswordToken = null;
        user.forgotPasswordExpires = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password has been reset successfully!"
        });
    } catch (error) {
        console.log(`Error while sending forgot password request! ${error}`);
        ApiError(500, `Error while sending forgot password request!`);
    }
};

export const getCurrentUser = async (req, res) => {
    const { id } = req.user;

    try {
        const user = await User.findById(id).select(
            "-password -forgotPasswordToken -forgotPasswordExpires",
        );

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No user found!"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Current user fetched successfully!",
            user
        }
        );
    } catch (error) {
        console.log(`Error while fetching current user! ${error}`);
        return res.status(500).json({
            message: error.message,
        });
    }
};
