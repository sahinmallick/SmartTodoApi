import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please login.",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_ACCESS_TOKEN
        );

        const user = await User.findById(decoded.id).select(
            "-password -forgotPasswordToken -emailVerificationToken"
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Invalid token.",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized.",
        });
    }
};


