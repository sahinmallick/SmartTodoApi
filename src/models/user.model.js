import mongoose from 'mongoose'
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    username:{
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    phone:{
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password:{
        type: String,
        required: [true, "Password is required!"],
    },
    role:{
        type: String,
        enum:['USER', 'ADMIN']
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    emailVerificationToken:{
        type: String
    },
    emailVerificationExpires:{
        type: Date
    },
    forgotPasswordToken: {
        type: String,
    },
    forgotPasswordExpires: {
        type: Date,
    },
})

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema)