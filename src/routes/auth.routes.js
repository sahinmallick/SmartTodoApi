import express from 'express'
import { userLoginValidator, userRegistrationValidator } from '../validators/index.js'
import { validate } from '../middlewares/validate.js'
import { forgotPasswordRequest, getCurrentUser, loginUser, logoutUser, register, resetPassword, verifyUser } from '../controllers/auth.controllers.js'
import { isLoggedIn } from '../middlewares/auth.middleware.js'

const userRouter = express.Router()

userRouter.post('/auth/register', validate(userRegistrationValidator), register)
userRouter.get('/auth/verify-user/:token', verifyUser)
userRouter.post('/auth/login', validate(userLoginValidator), loginUser)
userRouter.get('/user', isLoggedIn, getCurrentUser)
userRouter.get('/auth/logout', isLoggedIn, logoutUser)
userRouter.post('/auth/forget-password', forgotPasswordRequest)
userRouter.post("/auth/reset-password/:token", resetPassword);


export default userRouter;