import express from "express";
import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
} from "../controllers/task.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const taskRouter = express.Router();

taskRouter.post("/tasks", isLoggedIn, createTask);
taskRouter.get("/tasks", isLoggedIn, getTasks);
taskRouter.put("/tasks/:id", isLoggedIn, updateTask);
taskRouter.delete("/tasks/:id", isLoggedIn, deleteTask);

export default taskRouter;
