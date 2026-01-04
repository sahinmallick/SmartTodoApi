import express from 'express'
import dotenv from 'dotenv'
import db from './db/db.js'
import userRouter from './routes/auth.routes.js'
import cookieParser from 'cookie-parser'
import taskRouter from './routes/task.routes.js'
import cors from 'cors'

dotenv.config({
    path: './.env'
})

const app =  express()

db()

app.use(
    cors({
        origin: '*',
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/", userRouter);
app.use("/api/v1/", taskRouter);


export default app;